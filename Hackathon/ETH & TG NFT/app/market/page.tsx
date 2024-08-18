"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import NFTCardList from "@/components/market-nft-list";
import { useCollection, useNFTGetList } from "@/hooks/useMarket";
import { Image, Spinner } from "@nextui-org/react";
import { DefaultPageParams } from "@/utils/constant";
import { NFTStatus } from "@prisma/client";
import { NFTProps } from "@/types/nft";
import { useTranscationContract } from "@/hooks/useTranscationContract";
import { useListingContract } from "@/hooks/useListingContract";
import { useDelistingContract } from "@/hooks/useDelistingContract";

export default function MarketPage() {
  const [page, setPage] = useState(DefaultPageParams.page);
  const [nfts, setNfts] = useState<NFTProps[]>([]);
  const [response, setData] = useState([Boolean]);
  const [hasMore, setHasMore] = useState(true); // 追踪是否有更多数据
  const { handleContractTranscation } = useTranscationContract();
  const { data: collection } = useCollection();

  const { listingContract } = useListingContract();
  const { handleContractDelisting } = useDelistingContract();

  const { data: nftData, isLoading: nftLoading } = useNFTGetList({
    filter: {
      status: NFTStatus["LISTING"],
    },
    pagination: {
      page,
      size: DefaultPageParams.size,
    },
  });

  const observerRef = useRef<HTMLDivElement | null>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && !nftLoading && hasMore) {
        setPage((prevPage) => prevPage + 1);
      }
    },
    [nftLoading, hasMore]
  );

  // useEffect(() => {
  //   debugger
  //   async function fetchData() {
  //     try {
  //       const response = await handleCollectionContract();
  //       setData(response);
  //     } catch (error) {
  //       console.error('Error occurred while fetching data:', error);
  //     }
  //   }

  //   fetchData();
  // }, [Boolean]);

  // const fetchData = async() => {
  //   try {
  //     const response = await handleCollectionContract();
  //     console.log("get result = ", response);
  //   } catch (error) {
  //     console.error('Error occurred while fetching data:', error);
  //   }
  // }
  const listNft = async () => {
    try {
      const response = await listingContract();
      console.log("get result = ", response);
    } catch (error) {
      console.error("Error occurred while fetching data:", error);
    }
  };
  // };

  useEffect(() => {
    if (nftData?.list) {
      setNfts((prevNfts) => [...prevNfts, ...nftData.list]);
      // 如果已经加载的总数 >= 总数据量，说明没有更多数据了
      if (nfts.length + nftData.list.length >= nftData.totalCount) {
        setHasMore(false);
      }
    }
  }, [nftData]);

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 0.5,
    };

    const observer = new IntersectionObserver(handleObserver, option);

    if (observerRef.current) observer.observe(observerRef.current);

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [handleObserver]);

  return (
    <div className="w-full text-[15px] font-semibold min-h-screen">
      <div onClick={listingContract}>上架</div>
      <div onClick={handleContractDelisting}>下架</div>
      <div onClick={handleContractTranscation}>购买</div>
      <Image
        src={collection?.url}
        alt="coverImage"
        className="w-[100%] h-auto min-h-48 mb-4"
      />
      <div className="flex justify-center items-center">
        {nftLoading ? (
          <Spinner className="mt-32" />
        ) : nfts.length === 0 ? (
          <div className="mt-32">暂无NFT数据</div>
        ) : (
          <NFTCardList items={nfts} />
        )}
        <div ref={observerRef} />
        {!hasMore && (
          <div className="text-center mt-4 text-gray-500">—— 到底了 ————</div>
        )}
      </div>
    </div>
  );
}
