import { useInitDataStore } from "@artist/store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { api } from "./service-api";
import { artistHttpClient } from "./service-axios";
import TokenService from "./service-token";

export const authTokenKey = "authTokenKey";
export const authTokenDetails = "authTokenDetails";

export interface ILogin {
  email: string;
  password: string;
}

const initLogin = (data: ILogin) => {
  return artistHttpClient.post(api.auth.login, data);
};

const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { setInitData } = useInitDataStore();

  return useMutation({
    mutationKey: [api.auth.login],
    mutationFn: initLogin,
    onSuccess: (response) => {
      const token = {
        token: response?.data?.tokenDetails?.token,
        expiresIn: response?.data?.tokenDetails?.expiresIn,
      };

      TokenService.setToken(token);
      queryClient.setQueryData([authTokenKey], () => true);
      toast.success(response?.data?.message);
      setInitData(response?.data?.data);
      navigate("/", { replace: true });
    },
    onError: (error) => {
      const err = error as AxiosError<{ error: string; message: string }>;
      toast.error(
        err.response?.data.message ?? err.response?.data.error ?? "Login Failed"
      );
    },
  });
};

const initLogout = () => {
  try {
    TokenService.clearToken();
    return Promise.resolve(true);
  } catch (error) {
    console.error(error);
    return Promise.resolve(false);
  }
};

const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: initLogout,
    onSuccess: () => {
      queryClient.clear();
      queryClient.setQueryData([authTokenKey], () => false);
      navigate("/login", { replace: true });
    },
    onError: () => {
      toast.error("Logout Failed");
    },
  });
};

const checkAuthentication = async () => {
  if (TokenService.isAuthenticated()) {
    const tokenInfo = TokenService.getToken();
    if (tokenInfo && tokenInfo.expiresIn > Date.now()) {
      return Promise.resolve(true);
    } else {
      TokenService.clearToken();
      return Promise.resolve(false);
    }
  } else {
    return Promise.resolve(false);
  }
};

/**
 * Check if user is authenticated
 * @returns boolean
 */

const useAuthentication = () => {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: [authTokenKey],
    queryFn: async () => {
      const authStatus = await checkAuthentication();
      const tokenDetails = TokenService.getToken();
      if (tokenDetails) {
        queryClient.setQueryData([authTokenDetails], {
          ...tokenDetails,
        });
      }
      return authStatus;
    },
  });
};

const fetchInitData = () => {
  return artistHttpClient.get(api.auth.initData);
};

const useFetchInitData = (enabled: boolean) => {
  const { setInitData } = useInitDataStore();

  return useQuery({
    queryKey: ["initData"],
    queryFn: async () => {
      const initData = await fetchInitData();
      setInitData(initData?.data?.data);
      return initData?.data;
    },
    enabled,
    retry: 1,
  });
};

export {
  checkAuthentication,
  useAuthentication,
  useFetchInitData,
  useLogin,
  useLogout,
};
