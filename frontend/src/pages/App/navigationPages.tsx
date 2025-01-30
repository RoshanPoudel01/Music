import { lazy } from "react";

const Dashboard = lazy(() => import("@artist/pages/Dashboard"));
const Login = lazy(() => import("@artist/pages/Auth/Login"));
const Register = lazy(() => import("@artist/pages/Auth/Register"));
const Users = lazy(() => import("@artist/pages/Users"));
const Artist = lazy(() => import("@artist/pages/Artist"));
const Music = lazy(() => import("@artist/pages/Music"));
export const NAVIGATION_PAGES = {
  DASHBOARD: <Dashboard />,
  LOGIN: <Login />,
  REGISTER: <Register />,
  USERS: <Users />,
  ARTIST: <Artist />,
  MUSIC: <Music />,
};
