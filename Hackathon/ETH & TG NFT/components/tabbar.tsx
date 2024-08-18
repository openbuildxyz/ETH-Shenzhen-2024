"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Tab, Tabs } from "@nextui-org/react";
import { siteConfig } from "@/config/site";
export const TabBar = () => {
  const pathname = usePathname();
  const navPaths = siteConfig.navItems.map((item) => item.href);

  const isHidden = useMemo(() => !navPaths.includes(pathname!), [pathname]);
  if (isHidden) return null;
  return (
    <div className="sticky w-[100vw] px-[10px] left-0 bottom-5 flex justify-center z-[40]">
      <Tabs
        aria-label="Tabs"
        color="default"
        fullWidth
        classNames={{
          tabList:
            "w-full h-[70px] rounded-[20px] bg-[rgb(27 27 27 / 80%)] bg-[#1b1b1bc7] backdrop-blur-md",
          tab: "h-full",
          tabContent: "pointer-events-none",
          cursor: "rounded-[20px]",
        }}
        items={siteConfig.navItems}
        selectedKey={pathname}
      >
        {(item) => (
          <Tab
            key={item.href}
            as={Link}
            title={
              <div className="flex flex-col align-center gap-1 text-center justify-center">
                <div className="flex justify-center">{item.icon}</div>
                <div>{item.label}</div>
              </div>
            }
            href={item.href}
          />
        )}
      </Tabs>
    </div>
  );
};
