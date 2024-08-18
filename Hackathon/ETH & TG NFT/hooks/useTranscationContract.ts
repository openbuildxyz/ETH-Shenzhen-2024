import { toNano , Address, } from '@ton/core';
import { NftFixPriceSale, NftItem } from '@repo/ton-lib';
import { useState } from 'react';
import { useTonClient, useTonConnect } from '@repo/ton-hooks';
import { useTonAddress, useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";

export const useTranscationContract = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { sender } = useTonConnect();
  const { client } = useTonClient();
  const address = useTonAddress();

  const handleContractTranscation = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const nftAddress = Address.parse('EQBTj0aPFxfyIMZCOzw0HYF_pGZyp-1xx_Jnnbp6cjR6BEuF');
      const nftItem = client.open(NftItem.createFromAddress(nftAddress));
      console.log("🚀 ~ handleContractTranscation ~ nftItem:", nftItem)
      const nftData = await nftItem.getNftData();

      const sale = client.open(NftFixPriceSale.createFromAddress(nftData.ownerAddress));
      await sale.sendPurchase(sender, {
        value: toNano(1.5),
        queryId: Date.now(),
      });
     const res = await client.getContractState(sale.address);
     console.log("🚀 ~ handleContractTranscation ~ res:", res)
    } catch (error: any) {
      console.error(`Error handling contract collection: ${error?.message}`);
      setError(error?.message);
    } finally {
      setIsLoading(false);
    }
  }
  return {
    handleContractTranscation,
    error,
    isLoading
  }
}