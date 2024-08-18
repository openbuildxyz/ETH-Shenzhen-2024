"use client";

import { toast } from "sonner";
import { IoCopyOutline } from "react-icons/io5";
import {
  useHapticFeedback,
  useInitData,
} from "@vkruglikov/react-telegram-web-app";
import { Button } from "@nextui-org/react";

export default function DisplayAppData() {
  const [initDataUnsafe, initData] = useInitData();
  const [impactOccurred] = useHapticFeedback();

  const copyToClipboard = () => {
    impactOccurred("heavy");
    const textToCopy = JSON.stringify(
      {
        initDataUnsafe,
        initData,
      },
      null,
      2,
    );
    navigator.clipboard.writeText(textToCopy).then(
      () => {
        toast.success("📰复制用户数据", {
          description: "复制用户数据成功",
        });
      },
      (err) => {
        console.error("复制失败: ", err);
      },
    );
  };

  return (
    <div className="flex items-center">
      <div className="text-pretty p-4 overflow-auto">{initData}</div>
      <Button
        isIconOnly
        color="default"
        variant="flat"
        radius="full"
        size="lg"
        aria-label="copy"
        onClick={copyToClipboard}
      >
        <IoCopyOutline size={20} />
      </Button>
    </div>
  );
}
