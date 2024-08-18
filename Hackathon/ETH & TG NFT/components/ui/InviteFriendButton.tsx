"use client";

import { useMemo } from "react";
import { FaTelegramPlane } from "react-icons/fa";
import { Button, Link } from "@nextui-org/react";
import { useHapticFeedback } from "@vkruglikov/react-telegram-web-app";

import { useCurrentUser } from "@/hooks/useUser";
import { siteConfig } from "@/config/site";
export default function InviteFriendButton() {
  const [impactOccurred] = useHapticFeedback();
  const { data: userInfo, isLoading } = useCurrentUser();

  const href = useMemo(() => {
    if (userInfo?.inviteCode) {
      const shareLink = siteConfig.shareLink(userInfo.inviteCode);
      return `https://t.me/share/url?url=${encodeURIComponent(shareLink)}&text=${encodeURIComponent(siteConfig.shareText!)}`;
    }
    return undefined;
  }, [userInfo?.inviteCode]);
  const onPress = () => impactOccurred("light");

  return (
    <Button
      as={Link}
      fullWidth
      color="default"
      variant="flat"
      radius="full"
      size="lg"
      startContent={<FaTelegramPlane size={20} />}
      href={href}
      disabled={isLoading || !href}
      onPress={onPress}
    >
      Invite friends and get more Points
    </Button>
  );
}
