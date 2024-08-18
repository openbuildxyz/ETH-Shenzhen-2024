"use client";

import { useRouter } from "next/navigation";
import { BackButton } from "@vkruglikov/react-telegram-web-app";
import { title } from "@/components/primitives";
import { useFriends } from "@/hooks/useUser";
import { FriendPointCard } from "@/components/ui/UserPointCard";

export default function FriendsPage() {
  const router = useRouter()
  const { data, isLoading } = useFriends()
  const goBack = () => {
    router.back()
  }
  return (
    <div>
      <BackButton onClick={goBack} />
      <div className="text-center mb-8">
        <h1 className={title()}>My Friends</h1>
      </div>
      <div className="flex flex-col gap-2">
        {isLoading && (
          <>
            <FriendPointCard isLoading={true} />
            <FriendPointCard isLoading={true} />
            <FriendPointCard isLoading={true} />
          </>
        )}
        {data?.map((item) => (
          <FriendPointCard
            key={item.id}
            userInfo={item}
            isLoading={false}
          />
        ))}
      </div>
    </div>
  );
}
