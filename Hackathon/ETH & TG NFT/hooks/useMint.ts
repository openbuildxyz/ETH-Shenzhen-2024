import { getMintPercent, updateNFT } from "@/actions/mint";
import { NFTProps } from "@/types/nft";
import { UseMutationResult, UseQueryResult, useMutation, useQuery } from "@repo/react-query";


/**
 * 保存NFT
 * @returns 
 */
export const useNFTUpdate = (): UseMutationResult<NFTProps, Error, NFTProps> => {
  return useMutation({
    mutationKey: ['nftUpdate'],
    mutationFn: async (data: NFTProps) => updateNFT(data)
  });
};

export const useMintPercent = ({ telegramId, nftCollectionId }: {
  telegramId: string
  nftCollectionId: string
}): UseQueryResult<{
  totalCount: number;
  mintedCount: number;
}, Error> => {
  return useQuery({
    queryKey: ['mintCount'],
    queryFn: async () => getMintPercent({ telegramId, nftCollectionId }),
    enabled: !!telegramId && !!nftCollectionId,
  })
}
