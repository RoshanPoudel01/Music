export interface IParams {
  id?: number;
  page?: number;
  perPage?: number;
  keyword?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  isActive?: string;
}

const auth = {
  login: "/users/login",
  register: "/users/register",
  me: "/me",
};

const users = {
  index: "/users",
};

export const api = {
  auth,
  users,
};
