"use client";

import * as React from "react";
import { NextUIProvider } from "@nextui-org/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import { ReactQueryProvider } from "@repo/react-query";
import { WebAppProvider, useExpand } from "@vkruglikov/react-telegram-web-app";
import { LoginProvider } from "@/components/login-provider";
import { Toaster } from "sonner";
import { FaCircleCheck } from "react-icons/fa6";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { SERVER_DOMAIN } from "@/utils/constant";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();
  const mainfestUrl = `${SERVER_DOMAIN}/tonconnect-manifest.json`;
  const [isExpand, expand] = useExpand();
  React.useEffect(() => {
    if (!isExpand) {
      expand();
    }
  }, [isExpand]);

  return (
    <ReactQueryProvider>
      <NextUIProvider navigate={router.push}>
        <NextThemesProvider {...themeProps}>
          <WebAppProvider>
            <TonConnectUIProvider manifestUrl={mainfestUrl}>
              <LoginProvider>{children}</LoginProvider>
              <Toaster
                position="top-center"
                icons={{
                  success: <FaCircleCheck size={20} />,
                }}
                toastOptions={{
                  classNames: {
                    success: "mr-3",
                    toast:
                      "h-[56px] bg-[#1b1b1b] text-md text-[#fff] border-none rounded-[14px]",
                    title: "font-semibold ml-2",
                    description: "ml-2",
                  },
                }}
              />
            </TonConnectUIProvider>
          </WebAppProvider>
        </NextThemesProvider>
      </NextUIProvider>
    </ReactQueryProvider>
  );
}
