import {
  keepPreviousData,
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { artistHttpClient } from "./service-axios";
import { IPageParams } from "./service-response";

interface IQueryProps {
  url: string;
  invalidates?: QueryKey;
  defaultMessage?: boolean;
  message?: string;
  enabled?: boolean;
  queryKey?: QueryKey;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  pageParams?: IPageParams;
  searchParam?: string;
}

export interface IData<T> {
  id?: string | number | null;
  data?: T;
}

//getMethod

const useFetch = <T>({
  url,
  enabled,
  queryKey,
  pageParams,
  searchParam,
}: IQueryProps) => {
  const fetchData = (): Promise<AxiosResponse<T>> => {
    return artistHttpClient.get(url, {
      params: {
        page: pageParams?.pageIndex,
        limit: pageParams?.pageSize,
        searchParam,
      },
    });
  };
  return useQuery({
    queryKey: queryKey ?? [url],
    queryFn: fetchData,
    select: (response) => response.data,
    placeholderData: keepPreviousData,
    enabled: enabled ?? true,
  });
};

//postMethod
const useMutate = <T>({
  url,
  invalidates,
  defaultMessage,
  message,
  method,
  queryKey,
}: IQueryProps) => {
  const queryClient = useQueryClient();
  const sendData = ({ id, data }: IData<T>): Promise<AxiosResponse<any>> => {
    return method === "PUT"
      ? artistHttpClient.put(url.replace(":id", id as string), data)
      : method === "DELETE"
        ? artistHttpClient.delete(url.replace(":id", id as string))
        : method === "PATCH"
          ? artistHttpClient.patch(url.replace(":id", id as string), data)
          : method === "POST" && id
            ? artistHttpClient.post(url.replace(":id", id as string), data)
            : artistHttpClient.post(url, data);
  };

  return useMutation({
    mutationKey: queryKey ?? [url],
    mutationFn: sendData,
    onSuccess: (response) => {
      if (invalidates) {
        invalidates.forEach((endpoint) => {
          queryClient.invalidateQueries({
            predicate: (query) => {
              // Matches queries starting with the endpoint
              const queryKey = query.queryKey;
              return queryKey[0] === endpoint;
            },
          });
        });
      }
      if (!defaultMessage && message) {
        toast.success(message);
      } else if (defaultMessage && !message) {
        toast.success((response.data as { message: string }).message);
      }
    },
    onError: (error: AxiosError<{ error: string; message: string }>) => {
      toast.error(
        error?.response?.data?.message ??
          "An error occurred. Please try again later"
      );
    },
  });
};

export { useFetch, useMutate };
