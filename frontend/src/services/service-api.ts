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
  changePassword: "/users/change-password",
};

const artists = {
  index: "/artist",
  byId: "/artist/:id",
  create: "/artist/create-artist",
  delete: "/artist/delete/:id",
  update: "/artist/update/:id",
  bulkUpload: "/artist/upload",
};
const music = {
  index: "music/allMusic?artist_id=:id",
  byId: "/music/:id",
  create: "/music/create-music",
  delete: "/music/delete/:id",
};
const dashboard = {
  index: "/dashboard",
};

export const api = {
  auth,
  users,
  artists,
  music,
  dashboard,
};
