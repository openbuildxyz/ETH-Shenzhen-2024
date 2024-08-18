"use client"

import { UserWithRankType } from "@/types";
import thousandsSeparator from "@/utils/thousandsSeparator";
import { Avatar, Card, CardBody, CardProps, Skeleton } from "@nextui-org/react";
import { IoIosArrowForward } from "react-icons/io";
import { useRouter } from "next/navigation";
import { useHapticFeedback } from "@vkruglikov/react-telegram-web-app";
import { Invitation, Telegram } from "@repo/database";


export type UserPointCardProps = CardProps & {
  userInfo?: UserWithRankType | null;
  isLoading: boolean;
  href?: string;
};
export type FriendPointCardProps = CardProps & {
  userInfo?: Invitation & {
    invitee: Telegram;
  } | null;
  isLoading: boolean;
};
export default function UserPointCard(props: UserPointCardProps) {
  const router = useRouter()
  const [impactOccurred] = useHapticFeedback();
  const { userInfo, isLoading, href, ...res } = props;
  const userName = userInfo?.username ?? userInfo?.first_name;
  const onPress = () => {
    if (!href) return;
    impactOccurred("medium");
    router.push(href)
  }
  return (
    <Card fullWidth isPressable={!!href} onPress={onPress}  {...res}>
      <CardBody className="flex flex-row justify-between items-center overflow-hidden">
        <div className="flex gap-3 items-center">
          <Skeleton className="rounded-full" isLoaded={!isLoading}>
            <Avatar size="md" name={userName} />
          </Skeleton>
          <div className="flex flex-col gap-2">
            <Skeleton
              className="rounded-lg min-w-[70px] min-h-4"
              isLoaded={!isLoading}
            >
              <p className="leading-none text-nowrap">{userName}</p>
            </Skeleton>
            <Skeleton className="rounded-lg min-h-4" isLoaded={!isLoading}>
              <p className="text-default-500 min-w-[100px] leading-none">
                {thousandsSeparator(Number(userInfo?.totalPoint) ?? 0)} Points
              </p>
            </Skeleton>
          </div>
        </div>
        <Skeleton className="rounded-lg" isLoaded={!isLoading}>
          <div className="leading-none flex items-center gap-2">
            #{Number(userInfo?.rank ?? 0)}
            {!!href && <div><IoIosArrowForward size={24} /></div>}
          </div>
        </Skeleton>
      </CardBody>
    </Card>
  );
}

export function FriendPointCard(props: FriendPointCardProps) {
  const { userInfo, isLoading, ...res } = props;
  const userName = userInfo?.invitee?.username ?? userInfo?.invitee?.first_name;
  return (
    <Card fullWidth {...res}>
      <CardBody className="flex flex-row justify-between items-center">
        <div className="flex gap-3 items-center w-full">
          <Skeleton className="rounded-full" isLoaded={!isLoading}>
            <Avatar size="md" name={userName} />
          </Skeleton>
          <Skeleton
            className="rounded-lg min-w-[70px] min-h-4"
            isLoaded={!isLoading}
          >
            <p className="leading-none text-nowrap">{userName}</p>
          </Skeleton>
        </div>
        <Skeleton className="rounded-lg min-h-4" isLoaded={!isLoading}>
          <p className="text-default-500 min-w-[100px] leading-none whitespace-nowrap">
            +{thousandsSeparator(Number(userInfo?.points) ?? 0)} Points
          </p>
        </Skeleton>
      </CardBody>
    </Card>
  );
}