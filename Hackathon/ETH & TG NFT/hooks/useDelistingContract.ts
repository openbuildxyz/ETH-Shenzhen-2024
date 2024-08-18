import { toNano, Address, } from '@ton/core';
import { NftFixPriceSale, NftItem } from '@repo/ton-lib';
import { useState } from 'react';
import { useTonClient, useTonConnect } from '@repo/ton-hooks';
import { useTonAddress, useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";

export const useDelistingContract = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { sender } = useTonConnect();
  const { client } = useTonClient();
  const address = useTonAddress();
  const handleContractDelisting = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // 要下架的nft地址
      const nftAddress = Address.parse('EQBTj0aPFxfyIMZCOzw0HYF_pGZyp-1xx_Jnnbp6cjR6BEuF');

      const nftItem = client!.open(NftItem.createFromAddress(nftAddress));
      
      const nftData = await nftItem.getNftData();
      console.log("🚀 ~ handleContractDelisting ~ nftData:", nftData)

      const sale = client!.open(NftFixPriceSale.createFromAddress(nftData.ownerAddress));
      await sale.sendDeListingNft(sender, {
        value: toNano(0.1),
        queryId: Date.now(),
      });

      const res = await client.getContractState(sale.address);
      console.log("🚀 ~ handleContractTranscation ~ res:", res)

    } catch (error: any) {
      console.error(`Error delsting nft: ${error?.message}`);
      setError(error?.message);
    } finally {
      setIsLoading(false);
    }
  }
  return {
    handleContractDelisting,
    error,
    isLoading
  }
}