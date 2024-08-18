"use server";
import { NFTCollectionProps, NFTProps, TranscationProps } from "@/types/nft";
import { DefaultPageParams } from "@/utils/constant";
import { NFTStatus, prisma, OrderStatusType } from "@repo/database";

/**
 * @name NFT集合
 */
export async function getCollection(): Promise<NFTCollectionProps> {
  try {

    const collectionList = await prisma.nFTCollection.findMany()
    return collectionList[0];
  } catch (error) {
    console.error("[ get collection error ] >", error);
    throw new Error(JSON.stringify(error));
  }
}
/**
 * 获取已上架NFT列表
 * @param params 
 * @returns 
 */
export const getNFTList = async (params: {
  pagination: { page?: number; size?: number },
  filter: {}
}) => {
  try {
    const collection = await getCollection()
    if (!collection) {
      throw new Error('集合不存在')
    }

    const { page, size, order, filter } = { ...DefaultPageParams, ...params };
    const { id } = collection
    const newFilter = {
      nftCollectionId: id ?? "",
      status: NFTStatus['LISTING'], // 默认获取已上架的NFT
      ...filter
    }
    const totalCount = await prisma.nFT.count({
      where: newFilter,
    });
    const totalPages = Math.ceil(totalCount / size);
    const nftList = await prisma.nFT.findMany({
      where: newFilter,
      skip: (page - 1) * size,
      take: size,
      orderBy: {
        createdAt: order
      },
    })

    console.log("....", nftList)
    return {
      list: nftList,
      page,
      size,
      totalPages
    };
  } catch (error: any) {
    console.error("获取nft列表失败", error)
    throw new Error(error)
  }
}

export const getNFTDetail = async (id: string) => {
  try {
    const nft = await prisma.nFT.findUnique({
      where: {
        id: Number(id)
      }
    })
    return nft
  } catch (error: any) {
    console.log("获取nft详情失败", error)
    throw new Error(error)
  }
}
export const updateNFT = async ({ id, ...rest }: NFTProps) => {
  try {
    return await prisma.nFT.update({
      where: {
        id
      },
      data: rest
    })
  } catch (error: any) {
    console.error("更新nft失败", error)
    throw new Error(error)
  }
}

export const postTransication = async (nft: NFTProps, transcationData?: {
  payStatus?: OrderStatusType,
  expedited?: boolean
}) => {
  try {
    const nftDetail = getNFTDetail(String(nft.id))
    if (!nftDetail) {
      throw new Error('当前NFT已不存在')
    }
    const transaction = await prisma.transaction.create({
      price: nft.price,
      nftId: nft.id,
      type: nft.status, // NFT的状态（除了CREATE）正好是交易的类型
      status: nft.status === NFTStatus['TRANSACTION'] ? transcationData?.payStatus : OrderStatusType['PAY_ABLE'],
      expedited: transcationData?.expedited
    })
    return transaction
  } catch (error: any) {
    console.error("新增交易记录失败", error)
    throw new Error(error)
  }
}

/**
 * 更新NFT的状态并新增交易记录
 * @param param0 
 * @returns 
 */
export const updateAndPostTransication = async ({ data, transcationData }: {
  data: NFTProps,
  transcationData?: {
    payStatus?: OrderStatusType
    expedited?: boolean
  }
}) => {
  try {
    await Promise.all([
      updateNFT(data),
      postTransication(data, transcationData)
    ])
    return true
  } catch (error: any) {
    console.error('更新NFT或新增交易记录失败', error)
    throw new Error(error)
  }
}

export const getTranscationList = async ({
  nftId,
  page = DefaultPageParams.page,
  size = DefaultPageParams.size,
}: {
  nftId: number;
  page?: number;
  size?: number;
}) => {
  try {
    const totalCount = await prisma.transaction.count({
      where: {
        nftId
      },
    });
    const totalPages = Math.ceil(totalCount / size);
    const transactionList = await prisma.transaction.findMany({
      where: {
        nftId
      },
      skip: (page - 1) * size,
      take: size,
      orderBy: {
        createdAt: DefaultPageParams.order
      },
      include: {
        nft: {
          where: {
            id: nftId
          }
        }
      }
    })

    const transactionsWithHash = transactionList.map((transaction: TranscationProps) => ({
      ...transaction,
      transactionHash: transaction.nft.transactionHash,
    }));
    console.log("....", transactionsWithHash)
    return {
      list: transactionsWithHash,
      page,
      size,
      totalPages
    };
  } catch (error: any) {
    console.log("获取交易记录失败", error)
    throw new Error(JSON.stringify(error))
  }
}