"use client";
import { NFTProps } from "@/types/nft";
import { Image } from "@nextui-org/react";
import Link from "next/link";

const NFTCardList = ({ items }: { items: NFTProps[] }) => {
  return (
    <div className="grid grid-cols-2 gap-4 mt-4">
      {items.map((nft, index) => (
        <Link key={index} href={`/market/${nft.id}`}>
          <Image
            src={nft.url}
            alt={nft.name}
            className="w-full h-32 object-cover mb-2 rounded"
          />
          <h3 className="text-lg font-bold">{nft.name}</h3>
          <p>{nft.description}</p>
          <div className="flex items-center mt-2">
            <Image
              src="/marker/ton-icon.png"
              alt="Coin"
              className="w-4 h-4 mr-1"
            />
            <span>{nft.price}</span>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default NFTCardList;
