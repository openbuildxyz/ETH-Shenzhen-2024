import { Telegram } from "@prisma/client";
import { WebAppUser } from "@vkruglikov/react-telegram-web-app";
import { JWTPayload } from "jose";
import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type PaginationType<T> = {
  list: T[];
  totalCount: number;
  totalPages: number;
  page: number;
  size: number;
};
export type PaginationQueryType = {
  page: number;
  size: number;
};

export type UserWithRankType = Telegram & {
  invitationPoints: bigint;
  totalPoint: bigint;
  rank: bigint;
};

export type SessionUserType =
  | ({ user: Telegram; expires: Date } & JWTPayload)
  | { initDataSafeUser?: WebAppUser };
