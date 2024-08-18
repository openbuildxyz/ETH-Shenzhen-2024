import { NFTProps } from "@/types/nft";
import React, { useState, useEffect } from "react";
import { useTanscationList } from "@/hooks/useMarket";
import { TranscationProps } from "@/types/nft";
import { Button, Spinner } from "@nextui-org/react";

const TransactionHistory = ({ nft }: { nft: NFTProps }) => {
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [transactions, setTransactions] = useState<TranscationProps[]>([]);
  const { data, isLoading, error, refetch } = useTanscationList({
    nftId: nft.id!,
    page,
    size: 10, // 每页加载的数量
  });

  useEffect(() => {
    if (data) {
      setTransactions((prev) => [...prev, ...data.list]);
    }
  }, [data]);

  const loadMore = () => {
    setPage((prev) => prev + 1);
    refetch();
  };

  useEffect(() => {
    setPages(data?.totalPages ?? 0);
    setTotalCount(data?.totalCount ?? 0);
  }, [data]);

  return (
    <div className="w-full">
      {totalCount > 0 && (
        <>
          <ul className="space-y-4">
            {transactions.map((tx: TranscationProps, index) => (
              <li
                key={index}
                className="bg-gray-800 p-4 rounded-lg shadow-md text-white"
              >
                <p className="mb-1">{tx.type}</p>
                <p className="mb-1">{tx?.createdAt?.toLocaleString()}</p>
                <p className="mb-1">U {tx.price}</p>
                <p>{tx.nft?.transactionHash}</p>
              </li>
            ))}
          </ul>
          <div className="flex justify-center">
            {isLoading ? (
              <Spinner title="加载中..." />
            ) : error ? (
              <div>加载异常，请稍后再试～</div>
            ) : page === pages ? (
              <div>—— 到底了 ——</div>
            ) : (
              <Button
                onClick={loadMore}
                className="mt-4 px-6 py-2 text-white rounded hover:bg-gray-600"
              >
                查看更多
              </Button>
            )}
          </div>
        </>
      )}
      {totalCount <= 0 && (
        <div className="flex items-center justify-center">
          {isLoading ? <Spinner title="加载中..." /> : <div>暂无数据</div>}
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
