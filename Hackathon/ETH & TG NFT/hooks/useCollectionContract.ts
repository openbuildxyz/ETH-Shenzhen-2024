import { useState } from 'react';
import { address, Address, beginCell, storeStateInit, toNano } from '@ton/core';
import { nftFixPriceSaleConfigToCell, NftItem, NftCollection as ContractNftCollection, NftCollection } from '@repo/ton-lib';
import {useAsyncInitialize, useTonClient } from "@repo/ton-hooks"


export const useCollectionContract = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { client } = useTonClient();
  const nftAddress = Address.parse('EQB2V8PczobjFXl6qCgj3yxuFqmKuTicc8ExGDN4DDbPWkql');
  const nftCollection = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = NftCollection.createFromAddress(
      nftAddress
    );
    return client.open(contract);
  }, [client]);
  const handleCollectionContract = async () => {
    try {
      // const contract = readFileSync('./temp/nft-market.json');  // 写死 market地址 
      // const contractJson = JSON.parse(contract.toString());
      // const nftMarket = address(contractJson.address);
      const nftMarket = ""
      debugger
      // const ui = provider.ui();
      
      // const nft = client.open(NftItem.createFromAddress(nftAddress));
      // const nftData = await nft.getNftData();
      
      return await nftCollection!.getCollectionData();
      // writeFileSync(
      //   './temp/nft-collection.json',
      //   JSON.stringify(
      //     {
      //       address: saleContractAddress.toString(),
      //     },
      //     null,
      //     4
      //   )
      // );
    } catch (error: any) {
      console.error(`Error handling contract collection: ${error?.message}`);
      setError(error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleCollectionContract,
    isLoading,
    error,
  };
};