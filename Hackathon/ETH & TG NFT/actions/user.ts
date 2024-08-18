"use server";

import { getSession, login, logout } from "@/lib";
import {
  PaginationQueryType,
  PaginationType,
  SessionUserType,
  UserWithRankType,
} from "@/types";
import {
  calculateInvitePoint,
  calculatePremiumPoint,
  calculateTgIdPoint,
} from "@/utils/calculatePoint";
import { verifyTelegramData } from "@/utils/verifyTelegramData";
/**
 * @file telegram用户相关
 */
import { Invitation, Telegram, UserRankSnapshot, WalletAddress, prisma } from "@repo/database";

/**
 * 验证tg data 是否有效，以及是否登录
 * @doc https://core.telegram.org/bots/webapps#direct-link-mini-apps
 * @param initData A string with raw data transferred to the Mini App
 */
export async function validateTgLogin(
  initData: string,
): Promise<SessionUserType> {
  try {
    const user = {
      id: 5546272954,
      first_name: "Finch",
      last_name: "R",
      username: "DaaaVichiii",
      language_code: "zh-hans",
      allows_write_to_pm: true,
    } as any
    // const user = await verifyTelegramData(initData);
    console.log("🍷 = ", user)
    const initDataSafeUser = user;
    const session = await getSession();
    // 登录账号不一致时也要重新登录
    if (!session || session?.user?.telegramId !== String(user.id)) {
      // 清除session
      await logout();
      // 未登录则返回原始tg数据
      return { initDataSafeUser };
    }
    return session;
  } catch (error) {
    console.log("[ Telegram data validation failed ] >", error);
    throw new Error("Telegram data validation failed");
  }
}

export async function tgLogin(user: Telegram) {
  await login(user);
}

export async function getCurrentUser(): Promise<UserWithRankType & { userRankSnapshot: UserRankSnapshot; walletAddresses: WalletAddress[] } > {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  try {
    const telegramWithRank: (UserWithRankType & { walletAddresses: WalletAddress[] })[] = await prisma.$queryRaw`
      WITH TelegramPoints AS (
        SELECT
          t.id,
          t."telegramId",
          t."createdAt",
          t."updatedAt",
          t.first_name,
          t.last_name,
          t.username,
          t.language_code,
          t."creationPoints",
          t."premiumPoints",
          t."chatPoints",
          t."inviteCode",
          COALESCE(SUM(i.points), 0) AS "invitationPoints",
          (t."creationPoints" + t."premiumPoints" + t."chatPoints" + COALESCE(SUM(i.points), 0)) AS "totalPoint",
          COALESCE(
            JSON_AGG(
              JSON_BUILD_OBJECT(
                'id', wa.id,
                'createdAt', wa."createdAt",
                'address', wa."address",
                'telegramId', wa."telegramId",
                'userId', wa."userId"
              )
            ) FILTER (WHERE wa.id IS NOT NULL), '[]'
          ) AS "walletAddresses"
        FROM
          "Telegram" t
        LEFT JOIN
          "WalletAddress" wa
        ON  wa."telegramId" = t."id"
        LEFT JOIN
          "Invitation" i
        ON
          t."inviteCode" = i."inviterCode"
          AND t.id != i."inviteeId"
        GROUP BY
          t.id
      ),
      RankedTelegrams AS (
        SELECT
          tp.*,
          ROW_NUMBER() OVER (ORDER BY "totalPoint" DESC, "createdAt" ASC) AS rank
        FROM
          TelegramPoints tp
      )
      SELECT
        *
      FROM
        RankedTelegrams
      WHERE
        id = ${session.user.id}
      ORDER BY
        rank
      LIMIT 1;
    `;
    const rankUserRes = telegramWithRank[0];
    const userRankSnapshot = await prisma.userRankSnapshot.findUnique({
      where: { telegramId: rankUserRes.telegramId }
    })
    return {
      ...rankUserRes,
      userRankSnapshot: userRankSnapshot!,
    }
  } catch (error) {
    console.log("[ getCurrentUser error ] >", error);
    throw new Error("Get Current User Failed");
  }
}

export async function getUserById(id: string) {
  return prisma.telegram
    .findUnique({
      where: {
        id,
      },
      include: {
        invitation: true,
      },
    })
    .catch((error) => {
      console.log("[ getUserById error ] >", error);
      throw new Error("Get telegram user error");
    });
}

export async function getUserByTelegramId(telegramId: string | number) {
  return prisma.telegram
    .findUnique({
      where: {
        telegramId: String(telegramId),
      },
      include: {
        invitation: true,
      },
    })
    .catch((error) => {
      console.log("[ getUserByTelegramId error ] >", error);
      throw new Error("Get telegram user error");
    });
}

/**
 * @name 用户积分排名分页查询
 */
export async function getUserRankList(
  pagination: PaginationQueryType = { page: 1, size: 100 },
): Promise<PaginationType<UserWithRankType>> {
  const { page, size } = pagination;
  const totalCount = await prisma.telegram.count();
  const totalPages = Math.ceil(totalCount / size);
  const skip = (page - 1) * size;
  const take = size;

  const telegramsWithRank = await prisma.$queryRaw`
    WITH TelegramPoints AS (
      SELECT
        t.id,
        t."telegramId",
        t."createdAt",
        t."updatedAt",
        t.first_name,
        t.last_name,
        t.username,
        t.language_code,
        t."creationPoints",
        t."premiumPoints",
        t."chatPoints",
        t."inviteCode",
        COALESCE(SUM(i.points), 0) AS "invitationPoints",
        (t."creationPoints" + t."premiumPoints" + t."chatPoints" + COALESCE(SUM(i.points), 0)) AS "totalPoint"
      FROM
        "Telegram" t
      LEFT JOIN
        "Invitation" i
      ON
        t."inviteCode" = i."inviterCode"
        AND t.id != i."inviteeId"
      GROUP BY
        t.id
    ),
    RankedTelegrams AS (
      SELECT
        tp.*,
        ROW_NUMBER() OVER (ORDER BY "totalPoint" DESC, "createdAt" ASC) AS rank
      FROM
        TelegramPoints tp
    )
    SELECT
      *
    FROM
      RankedTelegrams
    ORDER BY
      rank
    LIMIT ${take} OFFSET ${skip};
  `;

  return {
    list: telegramsWithRank as any,
    totalCount,
    totalPages,
    page,
    size,
  };
}

/**
 * @name 查找或创建用户
 * @param payload
 */
// todo user type
export async function getOrCreateUser(
  payload: any,
  inviterCode?: string | null,
): Promise<Telegram & { invitation?: Invitation | null }> {
  const { id, is_premium, ...res } = payload;
  const telegramId = String(id);
  try {
    const user = await getUserByTelegramId(telegramId);
    const creationPoints = calculateTgIdPoint(telegramId);
    const premiumPoints = calculatePremiumPoint(is_premium);
    if (user?.creationPoints === 0) {
      // 如果先加入频道 判断creationPoints 没有积分则更新其他维度积分
      return await prisma.telegram.update({
        where: {
          id: user.id,
        },
        data: {
          ...res,
          creationPoints,
          premiumPoints,
        },
      });
    }
    if (user) return user;
    const newUser = await prisma.telegram.create({
      data: {
        ...res,
        telegramId,
        creationPoints,
        premiumPoints,
      },
    });
    // 只有新用户被邀请时，邀请者才获取积分
    if (inviterCode) {
      await createInvitation({
        inviterCode,
        inviteeId: newUser.id,
        user: newUser,
      });
    }
    return newUser;
  } catch (error) {
    console.log("[ getOrCreateUser error ] >", error);
    throw new Error("Create User error");
  }
}

/**
 *
 * @param invitedId 被邀请人的主键id
 * @returns
 */
export async function getInvitationByInviteeIdId(inviteeId: string) {
  try {
    return await prisma.invitation.findUnique({
      where: { inviteeId },
    });
  } catch (error) {
    console.log("[ Get Invitation error ] >", error);
    throw new Error("Get Invitation error");
  }
}

/**
 * @name 创建邀请记录
 */
export async function createInvitation(payload: {
  inviteeId: string;
  inviterCode: string;
  user: Telegram;
}) {
  const { inviteeId, inviterCode, user } = payload;
  try {
    const inviteePoints = calculateInvitePoint(user);
    return await prisma.invitation.create({
      data: {
        inviterCode,
        inviteeId,
        points: inviteePoints,
      },
    });
  } catch (error) {
    console.log("[ createInvitation error ] >", error);
    throw new Error("Create Invitation error");
  }
}


export async function getCurrentUserFriends() {
  const session = await getSession()
  if (!session) {
    throw new Error("Unauthorized");
  }
  try {
    return await prisma.invitation.findMany({
      where: {
        inviterCode: session.user.inviteCode,
        inviteeId: {
          not: session.user.id
        }
      },
      include: {
        invitee: true,
      }
    })
  } catch (error) {
    console.log('[ Get User friends error ] >', error)
    throw new Error("Get User friends error");
  }
}

/**
 * @name 自增mint次数
 * @return
 * null |
 * {
 *  id: 'DW05fh_qVFfKvqecT5x0_',
 *  telegramId: 'xxxx',
 *  rank: 1,
 *  totalMintCount: 216,
 *  mintedCount: 3,
 *  snapshotAt: xxxx,
 *  walletAddress: null,
 * }
 */
export async function incrementMintedCount() {
  const session = await getSession()
  if (!session) {
    throw new Error("Unauthorized");
  }
  try {
    const snapshot = await prisma.userRankSnapshot.findUnique({
      where: {
        telegramId: session.user.telegramId,
      }
    })
    // 没找到则是普通用户 返回空
    if (!snapshot) return snapshot
    return await  prisma.userRankSnapshot.update({
      where: {
        id: snapshot.id,
      },
      data: {
        mintedCount: {
          increment: 1,
        },
      },
    })
  } catch (error) {
    console.log('[ error ] >', error)
    throw Error("Increment MintedCount Error")
  }
}

/**
 * 用户添加钱包地址
 * @param address 钱包地址
 */
export async function addWalletAddress(address: string) {
  const session = await getSession()
  if (!session) {
    throw new Error("Unauthorized");
  }
  try {
    const walletAddress =  await prisma.walletAddress.findUnique({
      where: { address }
    })
    if (walletAddress) return walletAddress
    return await prisma.walletAddress.create({
      data: {
        address,
        // 注意这里表关联的是 //! telegram.id
        telegramId: session.user.id
      }
    });
  } catch (error) {
    throw new Error("Add Wallet Address Error");
  }
}