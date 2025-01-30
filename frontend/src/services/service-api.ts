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
  byId: "/users/:id",
  delete: "/users/delete/:id",
};

const artists = {
  index: "/artist",
  byId: "/artist/:id",
  create: "/artist/create-artist",
  delete: "/artist/delete/:id",
  update: "/artist/update/:id",
};
const music = {
  index: "music/allMusic",
  byId: "/music/:id",
  create: "/music/create-music",
  delete: "/music/delete/:id",
};

export const api = {
  auth,
  users,
  artists,
  music,
};
