"use client";

import { title } from "@/components/primitives";
import { useCurrentUser, useUserRankList } from "@/hooks/useUser";
import InviteFriendButton from "../ui/InviteFriendButton";
import CopyButton from "../ui/CopyButton";
import UserPointCard from "../ui/UserPointCard";
import { useMemo } from "react";

export default function Leaderboard() {
  const { data: userInfo, isLoading } = useCurrentUser();
  const { data: rankData, isLoading: isRankDataLoading } = useUserRankList();
  const hasFriends = useMemo(() => {
    if (userInfo?.invitationPoints) {
      return true
    }
    return false
  }, [userInfo]);

  return (
    <div className="w-full text-[15px] font-semibold">
      <div className="mb-8 text-center">
        <h1 className={title({ size: "md" })}>Telegram Wall of Fame</h1>
      </div>
      <UserPointCard
        className="my-8"
        userInfo={userInfo as any}
        isLoading={isLoading}
        href={hasFriends ? "/friends" : undefined}
      />
      <div className="my-8 flex items-center gap-2">
        <InviteFriendButton />
        <CopyButton />
      </div>
      <div className="mb-8">
        <h2 className={title({ size: "sm" })}>Your reward points</h2>
      </div>
      {isRankDataLoading && (
        <>
          <UserPointCard
            className="bg-transparent"
            isLoading={isRankDataLoading}
          />
          <UserPointCard
            className="bg-transparent"
            isLoading={isRankDataLoading}
          />
          <UserPointCard
            className="bg-transparent"
            isLoading={isRankDataLoading}
          />
        </>
      )}
      {rankData?.list?.map((item) => (
        <UserPointCard
          className="bg-transparent"
          key={item.id}
          userInfo={item}
          isLoading={false}
        />
      ))}
    </div>
  );
}
