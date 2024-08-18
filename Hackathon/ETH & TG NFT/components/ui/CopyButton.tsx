"use client";

import { useMemo } from "react";
import { toast } from "sonner";
import { IoCopyOutline } from "react-icons/io5";
import { useHapticFeedback } from "@vkruglikov/react-telegram-web-app";
import { Button } from "@nextui-org/react";

import { siteConfig } from "@/config/site";
import { useCurrentUser } from "@/hooks/useUser";

export default function CopyButton() {
  const [impactOccurred] = useHapticFeedback();
  const { data: userInfo, isLoading } = useCurrentUser();

  const textToCopy = useMemo(() => {
    if (userInfo?.inviteCode) {
      const shareLink = siteConfig.shareLink(userInfo.inviteCode);
      return `${shareLink}\n${siteConfig.shareText}`;
    }
    return "";
  }, [userInfo?.inviteCode]);

  const copyToClipboard = () => {
    impactOccurred("light");
    navigator.clipboard.writeText(textToCopy).then(
      () => {
        toast.success("Copied to clipboard !", {
          description: "Copied to clipboard, let’s share now!",
        });
      },
      (err) => {
        console.error("复制失败: ", err);
      },
    );
  };

  return (
    <Button
      isIconOnly
      disabled={isLoading || !textToCopy}
      color="default"
      variant="flat"
      radius="full"
      size="lg"
      aria-label="copy"
      onClick={copyToClipboard}
    >
      <IoCopyOutline size={20} />
    </Button>
  );
}
