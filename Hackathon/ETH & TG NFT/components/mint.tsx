"use client";
import { toast } from "sonner";
import thousandsSeparator from "@/utils/thousandsSeparator";
import { title } from "./primitives";
import { useEffect, useState } from "react";
import { useMintPercent, useNFTUpdate } from "@/hooks/useMint";
import { NFTProps } from "@/types/nft";
import { Image, Input, Link } from "@nextui-org/react";
import { useMintContract } from "@/hooks/useMintContract";
import { useCollection } from "@/hooks/useMarket";
import { toNano, Address,  } from "@ton/core";
import ConnectWallet from "./connect-wallet";
import { useCurrentUser } from "@/hooks/useUser";

const socialLinks =
  "https://ton.diamonds/collection/octopusboyz/?utm_source=blockchain";

const { WHITE_USER_TON, REGULAR_USER_TON } = process.env;

export default function Mint() {
  const { data: userInfo } = useCurrentUser();
  const [mintCount, setMintCount] = useState("1");
  const [mintMessage, setMintMessage] = useState<string | null>(); // 添加用于显示Mint结果的消息状态
  const { mutate } = useNFTUpdate();
  const { data: collection } = useCollection();
  console.log("🚀 ~ Mint ~ collection:", collection);
  const { mint, error: mintError , getRes} = useMintContract({
    contractAddress: collection?.contractAddress ?? "",
  });
  const { data: percentData, refetch } = useMintPercent({
    telegramId: userInfo?.telegramId!,
    nftCollectionId: collection?.id!,
  });
  const [percent, setPercent] = useState(0);
  useEffect(() => {
    const mintedCount = percentData?.mintedCount ?? 0;
    const totalCount = percentData?.totalCount ?? 100; // 避免除以0的情况
    const newPercent = parseFloat(
      ((mintedCount / totalCount) * 100).toFixed(2)
    );
    setPercent(newPercent);
  }, [percentData]);

  const updateNFT = async (data: NFTProps) => {
    return mutate(data, {
      onSuccess: () => {
        return true;
      },
      onError: (error: any) => {
        console.log(`[save nft] error: ${error?.message}`);
        alert(`mint error: ${error?.message}`);
      },
    });
  };

  const handleMint = async () => {
    const rankSnapshot = userInfo?.userRankSnapshot;
    const pay_value = rankSnapshot
      ? (WHITE_USER_TON ?? 0.08)
      : (REGULAR_USER_TON ?? 0.2);
    console.log(" ~ 🏠 ～mintData,,,,,", mintCount);
    console.log("... pay_value,,,,,", pay_value);
    // if (
    //   !mintCount ||
    //   Number(mintCount) >
    //     rankSnapshot?.totalMintCount! - rankSnapshot?.mintedCount!
    // ) {
    //   console.log("校验不通过");
    //   return toast.warning("校验个数不通过，请确认可以mint的个数");
    // }
    // if (!collection?.contractAddress) return;
    const mintData: any = await mint({
      value: toNano(pay_value!),
      queryId: Date.now(),
      index: rankSnapshot?.rank ?? 10000000000, // 普通用户写死的一个大的数据
      mintAmount: Number(mintCount),
    });
    console.log("mini result = ", mintData);

    if (mintError) {
      return;
    }
    await getRes();
    // setMintMessage("Mint 成功！你的 NFT 已经成功生成。");
    // await updateNFT(mintData);
    refetch();
  };

  return (
    <section className="w-full min-h-screen bg-black text-white flex flex-col p-4 text-center">
      <div className="my-4">
        <h1 className={title({ size: "md" })} onClick={getRes}>
          {thousandsSeparator(userInfo?.totalPoint)}
          <span> Points</span>
        </h1>
      </div>
      <div className="flex justify-center">
        <Image
          src={collection?.url}
          alt="collection"
          className="w-[100%] min-h-[163px]"
        />
      </div>
      <div className="my-4">
        <h1 className="text-2xl font-bold">{collection?.name ?? "集合名称"}</h1>
      </div>
      <div className="w-full p-2 mb-6">
        <Link href={socialLinks}>{socialLinks}</Link>
      </div>
      <div className="w-full flex justify-center bg-gray-700 rounded-full h-6 mb-6">
        <div
          className="text-green-600 h-full"
          style={{
            width: `${percent}%`,
          }}
        >
          <span className="block text-center text-white">{`${percent}%`}</span>
        </div>
      </div>
      {mintMessage && (
        <div className="text-center my-4">
          <h2 className="text-sm text-green-600">{mintMessage}</h2>
        </div>
      )}
      <div className="flex justify-center">
        <Input
          type="number"
          size="sm"
          required
          value={mintCount}
          placeholder={`mint的个数`}
          onChange={(e: any) => {
            setMintCount(e?.target?.value);
          }}
          style={{ textAlign: "center" }}
          className="mb-6 text-center"
        />
      </div>
      <div className="flex justify-center">
        <ConnectWallet handleMint={handleMint} btnText={"Mint"} />
      </div>
    </section>
  );
}
