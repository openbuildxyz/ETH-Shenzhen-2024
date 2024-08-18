"use client";

import Tabs from "@/components/market-tabs";
import { useNFTGet } from "@/hooks/useMarket";
import { useIsMounted } from "@/hooks/useMouted";
import { Image, Spinner } from "@nextui-org/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const NFTDetail: React.FC = () => {
  const mouted = useIsMounted();
  const [id, setId] = useState<any>(1);
  const { data: nft, isLoading, refetch } = useNFTGet(id);

  useEffect(() => {
    if (mouted) {
      const router = useRouter();
      const { id } = router.query;
      setId(id);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [id]);

  return (
    <div className="min-h-screen flex flex-col">
      {isLoading ? (
        <Spinner />
      ) : (
        <Image
          src={nft?.url}
          alt={nft?.name}
          className="w-full h-48 object-cover mb-4"
        />
      )}
      <Tabs nft={nft!} />
    </div>
  );
};

export default NFTDetail;
