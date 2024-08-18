"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useInitData } from "@vkruglikov/react-telegram-web-app";
import { useUserLoginMutation } from "@/hooks/useUser";
import Loading from "./view/Loading";

// mock data
// const initData =
//   "user=%7B%22id%22%3A5546272954%2C%22first_name%22%3A%22Finch%22%2C%22last_name%22%3A%22R%22%2C%22username%22%3A%22DaaaVichiii%22%2C%22language_code%22%3A%22zh-hans%22%2C%22allows_write_to_pm%22%3Atrue%7D&chat_instance=-1750154677616399650&chat_type=private&auth_date=1722031552&hash=a846a74899ef7970ba699812b338c5033746e4b8a455ed145232920615c7e5a7";

const initData =
  "user=%7B%22id%22%3A7275460694%2C%22first_name%22%3A%22xiang%22%2C%22last_name%22%3A%22nuan%22%2C%22language_code%22%3A%22zh-hans%22%2C%22allows_write_to_pm%22%3Atrue%7D&chat_instance=-1666728323671637137&chat_type=private&auth_date=1722695618&hash=d634658cc7b0b55141986c4e2fc6ea9532cf9ed354283194bce25e7183733bb5";
const Login = ({ children }: { children: React.ReactNode }) => {
  // const [, initData] = useInitData();
  const searchParams = useSearchParams();
  const inviterCode = searchParams?.get("tgWebAppStartParam");

  const {
    mutateAsync: login,
    isIdle,
    isPending,
    isError,
    error,
  } = useUserLoginMutation();

  useEffect(() => {
    if (initData) {
      login({ initData, inviterCode });
    }
  }, [initData, inviterCode]);

  if (isError) {
    return (
      <div className="h-screen flex">
        <span className="m-auto text-xl">{error.message}</span>
      </div>
    );
  }

  return (
    <>
      {isIdle || isPending ? (
        <div className="h-screen">
          <Loading />
        </div>
      ) : (
        children
      )}
    </>
  );
};

export const LoginProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense>
      <Login>{children}</Login>
    </Suspense>
  );
};
