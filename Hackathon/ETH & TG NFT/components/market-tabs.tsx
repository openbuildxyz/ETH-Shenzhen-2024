"use client";
import React, { useState } from "react";
import NFTDetails from "./market-nft-detail";
import TransactionHistory from "./market-transaction-history";
import { NFTProps } from "@/types/nft";

const Tabs = ({ nft }: { nft: NFTProps }) => {
  const [activeTab, setActiveTab] = useState<string>("details");

  return (
    <div>
      <div className="flex space-x-4 mb-4">
        <button
          className={`${activeTab === "details" ? "border-b-2 border-white" : ""} py-2 px-4`}
          onClick={() => setActiveTab("details")}
        >
          藏品详情
        </button>
        <button
          className={`${activeTab === "history" ? "border-b-2 border-white" : ""} py-2 px-4`}
          onClick={() => setActiveTab("history")}
        >
          交易历史
        </button>
      </div>
      {activeTab === "details" ? (
        <NFTDetails nft={nft} />
      ) : (
        <TransactionHistory nft={nft} />
      )}
    </div>
  );
};

export default Tabs;
