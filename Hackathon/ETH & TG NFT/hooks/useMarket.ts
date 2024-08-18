import { getCollection, getNFTDetail, getNFTList, getTranscationList, updateAndPostTransication, updateNFT } from "@/actions/market";
import { NFTCollectionProps, NFTProps, PaginationType, TranscationProps } from "@/types/nft";
import { UseMutationResult, UseQueryResult, useMutation, useQuery } from "@repo/react-query";
import { OrderStatusType } from '@prisma/client'

interface UpdateAndPostProps {
  data: NFTProps,
  transcationData?: {
    payStatus?: OrderStatusType,
    expedited: boolean
  }
}

/**
 * 获取集合，目前只支持一个集合，所以拿第一个
 * @param params 
 * @returns 
 */
export const useCollection = (): UseQueryResult<NFTCollectionProps, Error> => {
  return useQuery({
    queryKey: ["collection"],
    queryFn: async () => getCollection(),
  });
};

/**
 * 获取NFT列表
 * @param params 
 * @returns 
 */
export const useNFTGetList = (params: {
  filter: {},
  pagination: {
    page?: number,
    size?: number
  }
}): UseQueryResult<PaginationType<NFTProps>, Error> => {
  return useQuery({
    queryKey: ['nftList'],
    queryFn: async () => getNFTList(params),
  })
}
/**
 * 获取NFT的详情
 * @param id 
 * @returns 
 */
export const useNFTGet = (id: string): UseQueryResult<NFTProps, Error> => {
  return useQuery({
    queryKey: ['nftDetail'],
    queryFn: async () => getNFTDetail(id)
  })
}
/**
 * 更新NFT
 * @returns 
 */
export const useNFTUpdate = (data: NFTProps): UseMutationResult<NFTProps, Error, NFTProps> => {
  return useMutation({
    mutationKey: ['nftUpdate'],
    mutationFn: async () => updateNFT(data)
  });
};

/**
 * 更新NFT状态并新增交易记录
 * @param data 
 * @returns 
 */
export const useUpdateAndPostTranscation = (): UseMutationResult<boolean, Error, UpdateAndPostProps> => {
  return useMutation({
    mutationKey: ['updateAndPostTransiction'],
    mutationFn: async (postData: UpdateAndPostProps) => updateAndPostTransication(postData)
  })
}
/**
 * 获取交易列表
 * @param nftId 
 * @returns 
 */
export const useTanscationList = (params: {
  nftId: number;
  page?: number;
  size?: number
}): UseQueryResult<PaginationType<TranscationProps>, Error> => {
  return useQuery({
    queryKey: ['nftList'],
    queryFn: async () => getTranscationList(params),
  })
}