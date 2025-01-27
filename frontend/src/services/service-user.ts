import { api } from "./service-api";
import { useFetch, useMutate } from "./service-form-methods";
import { RootInterface } from "./service-response";

export interface UserResponse {
  id: number;
  firstName: string;
  lastName: string;
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

const useFetchUsers = () => {
  return useFetch<RootInterface<UserResponse>>({
    url: api.users.index,
    queryKey: ["users"],
  });
};

export { useFetchUsers, useRegisterUser };
