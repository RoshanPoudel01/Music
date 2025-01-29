import { NAVIGATION_ROUTES } from "@artist/pages/App/navigationRoutes";
import { House } from "@phosphor-icons/react";

export const sidebarItems = [
  {
    title: "Dashboard",
    icon: <House />,
    to: NAVIGATION_ROUTES.DASHBOARD,
  },
  {
    title: "Users",
    icon: <House />,
    to: NAVIGATION_ROUTES.USERS,
  },
  {
    title: "Artists",
    icon: <House />,
    to: NAVIGATION_ROUTES.ARTISTS,
  },
];
