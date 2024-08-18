import { HiOutlineHome } from "react-icons/hi";
import { FaRankingStar } from "react-icons/fa6";
import { BsShopWindow } from "react-icons/bs";
import { GiGearHammer } from "react-icons/gi";
import dotenv from "dotenv";
dotenv.config();

export type SiteConfig = typeof siteConfig;
export const siteConfig = {
  name: "Ton NFT",
  description: "Ton NFT",
  navItems: [
    {
      label: "Home",
      href: "/",
      icon: <HiOutlineHome size={22} />,
    },
    {
      label: "Leaderboard",
      href: "/leaderboard",
      icon: <FaRankingStar size={22} />,
    },
    {
      label: "Mint",
      href: "/mint",
      icon: <GiGearHammer size={22} />,
    },
    {
      label: "Market",
      href: "/market",
      icon: <BsShopWindow size={22} />,
    },
  ],
  shareLink: (inviteCode: string) =>
    `${process.env.NEXT_PUBLIC_SHARE_BOT_LINK}?startapp=${inviteCode}`,
  shareText: process.env.NEXT_PUBLIC_SHARE_TEXT,
};
