import { api } from "./service-api";
import { useFetch, useMutate } from "./service-form-methods";
import { IPageParams, RootInterface } from "./service-response";

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
  });
};

const useFetchUsers = (pageParams: IPageParams) => {
  return useFetch<RootInterface<UserResponse>>({
    url: api.users.index,
    queryKey: ["users"],
    pageParams,
  });
};

export { useFetchUsers, useRegisterUser };
