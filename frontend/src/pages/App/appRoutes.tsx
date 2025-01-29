import LayoutWrapper from "@artist/layouts";
import Error404 from "../Error404";
import { NAVIGATION_PAGES } from "./navigationPages";
import { NAVIGATION_ROUTES } from "./navigationRoutes";

export const appRoutes = [
  {
    path: "/",
    element: <LayoutWrapper />,
    children: [
      {
        index: true,
        element: NAVIGATION_PAGES.DASHBOARD,
      },
      {
        path: NAVIGATION_ROUTES.USERS,
        element: NAVIGATION_PAGES.USERS,
      },
      {
        path: NAVIGATION_ROUTES.ARTISTS,
        element: NAVIGATION_PAGES.ARTIST,
      },
    ],
  },
  {
    path: "*",
    element: <Error404 />,
  },
];
