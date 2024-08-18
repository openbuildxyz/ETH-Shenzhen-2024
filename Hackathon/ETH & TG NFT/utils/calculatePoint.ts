/**
 * @file 积分算法
 * @description
 * ChatId 区间区分 1 亿 -9亿 	50000 | 10亿 -20亿 45000 |  20亿 -30亿 40000 | 30亿 -40亿	35000 | 40亿 -50亿 30000  |  50亿 -60亿 25000 |  60亿 -70亿 20000 |   70亿 -80亿 15000 | 80亿以上默认给10000积分
 *
 * .TG会员维度: 非TG会员,积分0分 |  TG普通会员,积分20000 | TG高级会员,积分30000 | 如果区分不出来普通会员跟高级会员，直接区分Tg会员 直接送25000分
 *
 * 邀请人数维度: 获取被邀请人积分的10%
 * 例如 A邀请B
 * A算下来初始积分 10000
 * B初始积分5000
 * A得到B的10%
 * A总共得到10500
 *
 * 频道活跃性维度:
 * 关注我们频道送5000积分
 */

import { Telegram } from "@prisma/client";

/**
 * @name 计算TGid积分
 * @param telegramId
 */
export function calculateTgIdPoint(telegramId: number | string) {
  const chatIdNumber = +telegramId;
  if (chatIdNumber < 0) return 0;
  const pointsMap = [
    { start: 1e8, end: 1e9 - 1, points: 50000 },
    { start: 1e9, end: 2e9 - 1, points: 45000 },
    { start: 2e9, end: 3e9 - 1, points: 40000 },
    { start: 3e9, end: 4e9 - 1, points: 35000 },
    { start: 4e9, end: 5e9 - 1, points: 30000 },
    { start: 5e9, end: 6e9 - 1, points: 25000 },
    { start: 6e9, end: 7e9 - 1, points: 20000 },
    { start: 7e9, end: 8e9 - 1, points: 15000 },
    { start: 8e9, points: 10000 },
  ];

  // 寻找 chatId 所属的区间
  for (const { start, end, points } of pointsMap) {
    if (chatIdNumber >= start && (end === undefined || chatIdNumber <= end)) {
      return points;
    }
  }
  // 都没找到返回默认积分
  return 10000;
}

/**
 * @name 计算会员积分
 */
export function calculatePremiumPoint(is_premium: boolean | undefined) {
  if (!is_premium) return 0;
  // todo 待确认区分普通会员 or 高级会员
  return 20000;
}

/**
 * @name 计算邀请积分
 * @param invitee 被邀请人data
 */
export function calculateInvitePoint(invitee: Telegram) {
  const { creationPoints, premiumPoints, chatPoints } = invitee;
  const inviteeBasePoints = creationPoints + premiumPoints + chatPoints;
  return (inviteeBasePoints * 10) / 100;
}
