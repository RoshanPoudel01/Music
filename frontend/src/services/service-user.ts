import { api } from "./service-api";
import { useFetch, useMutate } from "./service-form-methods";
import { IPageParams, RootInterface, SingleResponse } from "./service-response";

export interface UserResponse {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  address: string;
  phone: string;
  dob: string;
  gender: string;
  createdAt: string;
  updatedAt: string;
}

const useRegisterUser = () => {
  return useMutate({
    url: api.auth.register,
    queryKey: [api.auth.register],
    message: "User registered successfully. Please login to continue.",
    invalidates: ["users"],
  });
};

const useFetchUsers = (pageParams: IPageParams) => {
  return useFetch<RootInterface<UserResponse[]>>({
    url: api.users.index,
    queryKey: ["users"],
    pageParams,
  });
};

const useFetchUser = (id: number, enabled: boolean) => {
  return useFetch<SingleResponse<UserResponse>>({
    url: api.users.byId.replace(":id", id + ""),
    queryKey: ["users", id],
    enabled: !!id && enabled,
  });
};

const useDeleteUser = () => {
  return useMutate({
    url: api.users.delete,
    invalidates: ["users"],
    message: "User deleted successfully",
    method: "DELETE",
  });
};

export { useDeleteUser, useFetchUser, useFetchUsers, useRegisterUser };
