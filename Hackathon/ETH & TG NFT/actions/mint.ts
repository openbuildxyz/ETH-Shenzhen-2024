"use server";
import { NFTProps } from "@/types/nft"
import { NFTStatus, prisma } from "@repo/database"
/**
 * 批量更新NDT的状态及数据
 * @param data 
 * @returns 
 */
export const updateNFT = async (data: NFTProps) => {
  try {
    return await prisma.nFT.updateMany({
      where: {
        id: {
          in: [1, 2]  // TODO批量查找
        }
      },
      data: {
        status: NFTStatus['MINT'],
        contractAddress: ''  // TODO 合约地址处理
      }
    })
  } catch (error: any) {
    console.log("创建 nft 失败", error)
    throw Error(error)
  }
}

export const getMintPercent = async ({
  telegramId,
  nftCollectionId
}: { telegramId: string, nftCollectionId: string }) => {
  try {
    // TODO 查找获取已经mint的总的数量
    const mintedCount = await prisma.nFT.count({
      where: {
        status: 'MINT'
      }
    })
    // 计算状态为Mint和create的数量
    const collection = await prisma.nFTCollection.findUnique({
      where: {
        id: nftCollectionId
      }
    })
    return {
      totalCount: collection?.projectNum,
      mintedCount,  // 总共需要mint的数量
    }
  } catch (error: any) {
    console.log("获取 nft mint 进度失败", error)
    throw Error(error)
  }
}