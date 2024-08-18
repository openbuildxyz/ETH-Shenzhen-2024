"use client";

import dynamic from "next/dynamic";
const Leaderboard = dynamic(() => import("@/components/view/Leaderboard"), {
  ssr: false,
});

export default function LeaderboardPage() {
  return <Leaderboard />;
}
