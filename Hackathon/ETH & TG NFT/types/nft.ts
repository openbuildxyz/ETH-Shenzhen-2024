import { CollectionType, OrderStatusType, TransactionType, NFTStatus } from "@prisma/client";
import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type PaginationType<T> = {
  list: T[];
  totalCount: number;
  totalPages: number;
  page: number;  // 当前页码
  size: number;
};

export type PaginationQueryProps = {
  page?: number;
  size?: number;
  field?: string;
  order?: 'asc' | 'desc'
};


export type NFTProps = {
  id?: number;
  createdAt?: Date;
  name?: string;
  description?: string;
  url?: string;
  contractAddress?: string;
  creatorAddress?: string;
  sellerAddress?: string;
  transactionHash?: string;
  network?: string;
  isUnique?: boolean;
  nftCollectionId?: string;
  status: NFTStatus;
  price?: string;
}

export type WalletProps = {
  id: string;
  createdAt: string;
  address: string;
  telegram: any; // 其实是Telegram的对象
}

export type NFTCollectionProps = {
  id: string | null;
  createdAt: Date | null;
  name: string;
  description: string;
  url: string;
  type: CollectionType
  projectNum: number;
  mintStartTime: Date;
  walletAddress?: string[];
  nfts?: NFTProps[];
  socialLinks: string[],
  contractAddress?: string | null
}

export type TranscationProps = {
  id?: string;
  createdAt?: Date;
  orderNo?: string;
  type?: TransactionType;
  expedited?: boolean;
  status?: OrderStatusType;
  price?: string;
  nftId: number;
  nft: NFTProps;
}