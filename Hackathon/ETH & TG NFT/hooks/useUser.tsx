import { useMutation, useQuery, useQueryClient } from "@repo/react-query";
import {
  addWalletAddress,
  getCurrentUser,
  getCurrentUserFriends,
  getOrCreateUser,
  getUserByTelegramId,
  getUserRankList,
  tgLogin,
  validateTgLogin,
} from "@/actions/user";

export const useUserLoginMutation = () => {
  // todo 优化：函数执行了2次 debounce 100ms
  const mutationFn = async (payload: {
    initData: string;
    inviterCode?: string | null;
  }) => {
    const { initData, inviterCode } = payload;
    const validatedRes = await validateTgLogin(initData);
    // 已登录的用户不执行任何操作
    if ("user" in validatedRes) return;
    const tgUser = await getOrCreateUser(
      validatedRes.initDataSafeUser,
      inviterCode,
    );
    await tgLogin(tgUser);
  };

  return useMutation({
    mutationKey: ["userLogin"],
    mutationFn,
  });
};

export const useCurrentUser = () => {
  const qc = useQueryClient();
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: () => getCurrentUser(),
    enabled: !qc.getQueryData(["currentUser"]),
  });
};

// useless now
export const useUserInfo = (telegramId?: string | number) => {
  return useQuery({
    queryKey: ["userInfo", telegramId],
    queryFn: () => getUserByTelegramId(telegramId!),
    enabled: !!telegramId,
  });
};

export const useUserRankList = () => {
  return useQuery({
    queryKey: ["userRankList"],
    queryFn: () => getUserRankList(),
  });
};


export const useFriends = () => {
  return useQuery({
    queryKey: ["myFriends"],
    queryFn: () => getCurrentUserFriends(),
  });
};

export const useAddWalletAddressMutation = () => {
  const { refetch } = useCurrentUser()
  return useMutation({
    mutationKey: ['addWalletAddress'],
    mutationFn: (address: string) => addWalletAddress(address),
    onSuccess: () => refetch()
  });
}