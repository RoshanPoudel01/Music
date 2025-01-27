import { lazy } from "react";

const Dashboard = lazy(() => import("@artist/pages/Dashboard"));
const Login = lazy(() => import("@artist/pages/Auth/Login"));
const Register = lazy(() => import("@artist/pages/Auth/Register"));

export const NAVIGATION_PAGES = {
  DASHBOARD: <Dashboard />,
  LOGIN: <Login />,
  REGISTER: <Register />,
};
