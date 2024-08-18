import { useState } from 'react';
import { address, Address, beginCell, storeStateInit, toNano } from '@ton/core';
import { nftFixPriceSaleConfigToCell, NftItem, NftCollection as ContractNftCollection } from '@repo/ton-lib';
// import { readFileSync, writeFileSync } from 'fs';
import { readContract } from '@repo/ton-lib';
import { useAsyncInitialize, useTonClient, useTonConnect } from "@repo/ton-hooks"
import { useTonAddress, useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";

const OperationCodes = {
  AcceptCoins: 1,
  Purchase: 2,
  DeListingNft: 3,
  ChangePrice: 0x6c6c2080,
  OwnershipAssigned: 0x05138d91,
  TransferNft: 0x5fcc3d14,
  EmergencyTransfer: 555,
};

export const useListingContract = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { client } = useTonClient()
  const { sender } = useTonConnect()
  const address = useTonAddress();
  console.log("🚀 ~ useListingContract ~ address:", address)

  const listingContract = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // const contract = readFileSync('./temp/nft-market.json');  // 写死 market地址 
      // const contractJson = JSON.parse(contract.toString());
      // const nftMarket = address(contractJson.address);
      const nftMarket = Address.parse("EQDBHSRUMvvDtKbGonhhJpCikAx5_hQ_1-5GuPLY0-Ihh-JM");
      const nftAddress = Address.parse('EQBTj0aPFxfyIMZCOzw0HYF_pGZyp-1xx_Jnnbp6cjR6BEuF');
      const nft = client!.open(NftItem.createFromAddress(nftAddress));
      const nftData = await nft.getNftData();
      console.log("🚀 ~ handleListingContract ~ nftData:", nftData)

      const nftCollection = client!.open(ContractNftCollection.createFromAddress(nftData.collectionAddress));
      const nftToSaleAddress = await nftCollection.getNftAddressByIndex(BigInt(nftData.index));
      console.log("🚀 ~ handleListingContract ~ nftToSaleAddress:", nftToSaleAddress)
      const now = parseInt((Date.now() / 1000) + '');

      const defaultConfig = {
        isComplete: false,
        createdAt: now,  // 当前时间戳（秒）
        marketplaceAddress: nftData.collectionAddress,  //集合合约地址
        nftAddress: nftToSaleAddress,
        nftOwnerAddress: nftData.ownerAddress,  // mint 地址
        fullPrice: toNano(1),  // 上架的价格
        marketplaceFee: toNano(0.03), // 上架的价格 * 对应钱包后边百分比
        marketplaceFeeAddress: Address.parse(address ?? ""), // 平台收益钱包地址
        royaltyAmount: toNano(0.04), // 上架的价格 * 对应项目方收益钱包地址
        royaltyAddress: Address.parse(address ?? ""), // 对应项目项目方的地址
        soldAt: 0,
        queryId: 0,
      };

      const saleCode = readContract('NftFixPriceSale');
      console.log("🚀 ~ handleListingContract ~ saleCode:", saleCode)
      const saleData = nftFixPriceSaleConfigToCell(defaultConfig);
      console.log("🚀 ~ handleListingContract ~ saleData:", saleData)
      const saleBody = beginCell()
        .storeUint(OperationCodes.AcceptCoins, 32)
        .storeUint(0, 64)
        .endCell();

      const stateInitCell = beginCell()
        .store(storeStateInit({ code: saleCode, data: saleData }))
        .endCell();
      console.log("🚀 ~ handleListingContract ~ stateInitCell:", stateInitCell)

      const saleContractAddress = new Address(0, stateInitCell.hash());
      console.log(`sale contract address of ${nftAddress.toString()} is ${saleContractAddress.toString()}`);

      await nft.sendTransfer(sender, {
        value: toNano(0.25), // 价格不变的
        newOwner: nftMarket,
        forwardAmount: toNano(0.2),
        stateInitCell,
        saleBody: saleBody,
      });

      const res = await client!.getContractState(nft.address);
      console.log("🚀 ~ handleContractTranscation ~ res:", res)
    } catch (error: any) {
      console.error(`Error handling contract collection: ${error?.message}`);
      setError(error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    listingContract,
    isLoading,
    error,
  };
};