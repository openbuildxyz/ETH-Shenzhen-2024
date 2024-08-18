"use client";
import { useUpdateAndPostTranscation } from "@/hooks/useMarket";
import { NFTProps } from "@/types/nft";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import React, { useState } from "react";
import { NFTStatus } from "@prisma/client";
import { useTranscationContract } from "@/hooks/useTranscationContract";
import { useListingContract } from "@/hooks/useListingContract";
import { useDelistingContract } from "@/hooks/useDelistingContract";

const NFTDetails = ({ nft }: { nft: NFTProps }) => {
  // TODO
  // const isCreator = currentUserAddress && nft.creator === currentUserAddress;
  const isCreator = false;
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [price, setPrice] = useState<string | null>();
  const {
    error: tranContractError,
    isLoading: tranContractLoading,
    handleContractTranscation,
  } = useTranscationContract(); // todo参数处理
  const {
    error: listContractError,
    isLoading: listContractLoading,
    listingContract,
  } = useListingContract();

  const {
    error: delContractError,
    isLoading: delContractLoading,
    handleContractDelisting,
  } = useDelistingContract();

  const { mutate: listingMutate } = useUpdateAndPostTranscation();

  const { mutate: transcationMutate } = useUpdateAndPostTranscation();

  const { mutate: delistingMutate } = useUpdateAndPostTranscation();

  const onListing = async () => {
    await listingContract();
    // TODO 禁用“上架“按钮
    listingMutate({
      data: {
        id: nft.id,
        status: NFTStatus["LISTING"],
      },
    });
  };

  const onTranscation = async () => {
    await handleContractTranscation();
    // TODO 禁用“购买”按钮
    transcationMutate({
      data: {
        id: nft.id,
        status: NFTStatus["TRANSACTION"],
      },
      transcationData: {
        //TODO 购买合约返回的数据
        payStatus: "PAY_ABLE", // 替换为购买合约的支付结果
        expedited: false,
      },
    });
  };

  const onDelisting = async () => {
    await handleContractDelisting();
    // 禁用“下架”按钮
    delistingMutate({
      data: {
        id: nft.id,
        status: NFTStatus["DELISTING"],
      },
    });
  };

  return (
    <>
      <div className="text-white p-2">
        <h2 className="text-2xl font-bold mb-4">{nft.name}</h2>
        <div className="mb-4">
          <p className="text-sm mb-1">
            <span className="font-semibold">创作者地址:</span>
            {nft?.creatorAddress}
          </p>
          <p className="text-sm mb-1">
            <span className="font-semibold">合约地址:</span>
            {nft?.contractAddress}
          </p>
          <p className="text-sm mb-1">
            <span className="font-semibold">网络:</span> {nft?.network}
          </p>
          <p className="text-sm mb-4">
            <span className="font-semibold">交易hash:</span>
            {nft?.transactionHash}
          </p>
        </div>
        {isCreator ? (
          <div className="flex flex-row justify-center space-x-4">
            <Button
              // disabled={}
              onClick={onOpen}
              className="px-8 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition duration-300 ease-in-out"
            >
              上架
            </Button>
            <Button
              // disabled={}
              onClick={onDelisting}
              className="px-8 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition duration-300 ease-in-out"
            >
              下架
            </Button>
          </div>
        ) : (
          <div className="flex flex-row justify-center">
            <Button
              // disabled={}
              onClick={onTranscation}
              className="px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition duration-300 ease-in-out"
            >
              购买
            </Button>
          </div>
        )}
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">定价</ModalHeader>
              <ModalBody>
                <Input
                  required
                  placeholder="请输入上架价格"
                  value={price ?? ""}
                  onChange={(e) => setPrice(e?.target?.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  关闭
                </Button>
                <Button color="primary" onPress={onListing}>
                  上架
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default NFTDetails;
