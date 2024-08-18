"use client";

import { BsStars } from "react-icons/bs";
import { MdWorkspacePremium } from "react-icons/md";
import { GiThreeFriends } from "react-icons/gi";
import { MdOutlineChat } from "react-icons/md";
import { HttpClient, Api } from 'tonapi-sdk-js';
import { Skeleton } from "@nextui-org/react";
import clsx from "clsx";
// import { HttpClient, Api } from 'tonapi-sdk-js';
import thousandsSeparator from "@/utils/thousandsSeparator";
import { useCurrentUser } from "@/hooks/useUser";
import { title } from "../primitives";
import ConnectWallet from "../connect-wallet";
import { useTonAddress, useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";

import { useMintContract } from "../../hooks/useMintContract";

type PointItemProps = {
  title: string;
  icon: React.ReactNode;
  value: number | string;
  isLoading?: boolean;
};

export default function Home() {
  const { data: userInfo, isLoading } = useCurrentUser();

  const address = useTonAddress();
  const { getAccountNftItems, getNftItemByAddress, getNftHistoryById, getItemsFromCollection } = useMintContract();

  const getNfts = async () => {

    // Retrieve an NFT collection
    // const collection = await client.nft.getNftItemByAddress('EQDR9dLHMssHt-uLOZN8g-iHvxaHBBBV32P_3pVc2XckRfvi');
    // console.log("🚀 ~ getNftCollection ~ collection:", collection)
    const nfts = await getAccountNftItems();
    console.log("🚀 ~ getNfts ~ nfts:", nfts)
  }

  const getNftDetail = async () => {
    // nft地址
    const nftData = await getNftItemByAddress('EQDR9dLHMssHt-uLOZN8g-iHvxaHBBBV32P_3pVc2XckRfvi');
    console.log("🚀 ~ getNftDetail ~ nftData:", nftData)
  }
  const getNftHistory = async () => {
    // nft地址
    const nftHistory = await getNftHistoryById('EQBTj0aPFxfyIMZCOzw0HYF_pGZyp-1xx_Jnnbp6cjR6BEuF');
    console.log("🚀 ~ getNftHistory ~ nftHistory:", nftHistory)
  }
  const getCollectionNfts = async () => {
    // nft地址
    const collectionNfts = await getItemsFromCollection('EQB2V8PczobjFXl6qCgj3yxuFqmKuTicc8ExGDN4DDbPWkql');
    console.log("🚀 ~ getCollectionNfts ~ collectionNfts:", collectionNfts)
  }

  return (
    <section className="w-full" >
      <h1
        onClick={getCollectionNfts}
        className={clsx(
          title({ size: "md" }),
          "flex justify-center items-center gap-2 my-8",
        )}
      >
        <Skeleton
          className="rounded-lg min-w-[100px] inline-block text-right"
          isLoaded={!isLoading}
        >
          <span className="leading-none">
            {thousandsSeparator(userInfo?.totalPoint)}
          </span>
        </Skeleton>
        <span onClick={getNftHistory}> Points</span>
      </h1>
      <div onClick={getNftDetail}>
        <div className="mb-3">
          <h2 className={title({ size: "sm" })}>Your reward points</h2>
        </div>
        <PointItem
          
          isLoading={isLoading}
          title="Account Age"
          icon={<BsStars size={30} />}
          value={thousandsSeparator(userInfo?.creationPoints)}
        />
        <PointItem
          isLoading={isLoading}
          title="Telegram Premium"
          icon={<MdWorkspacePremium size={30} />}
          value={thousandsSeparator(userInfo?.premiumPoints)}
        />
        <PointItem
          isLoading={isLoading}
          title="Invited Friends"
          icon={<GiThreeFriends size={30} />}
          value={thousandsSeparator(userInfo?.invitationPoints)}
        />
        <PointItem
          isLoading={isLoading}
          title="Join WooKong Community"
          icon={<MdOutlineChat size={30} />}
          value={thousandsSeparator(userInfo?.chatPoints)}
        />
      </div>
      <ConnectWallet />
    </section>
  );
}

export function PointItem({ title, icon, value, isLoading }: PointItemProps) {
  return (
    <div className="min-h-[70px] flex justify-between items-center text-medium font-semibold">
      <div className="flex items-center gap-3">
        {icon}
        <div>{title}</div>
      </div>
      <Skeleton className="rounded-lg min-h-4" isLoaded={!isLoading}>
        <div className="leading-none min-w-[40px] text-right">
          {value === 0 ? "" : "+"}
          {value}
        </div>
      </Skeleton>
    </div>
  );
}
