"use client";

import { Logo } from "@/components/icons";

export default function Loading() {
  return (
    <div className="w-full h-screen flex flex-col overflow-hidden">
      <div className="flex-grow flex">
        <Logo className="m-auto" size={72} />
      </div>
    </div>
  );
}
