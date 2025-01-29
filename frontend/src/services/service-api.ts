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
  initData: "/users/init",
};

const users = {
  index: "/users",
};

const artists = {
  index: "/artist",
};

export const api = {
  auth,
  users,
  artists,
};
