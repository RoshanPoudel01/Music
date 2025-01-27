import LayoutWrapper from "@artist/layouts";
import Error404 from "../Error404";
import { NAVIGATION_PAGES } from "./navigationPages";

export const appRoutes = [
  {
    path: "/",
    element: <LayoutWrapper />,
    children: [
      {
        index: true,
        element: NAVIGATION_PAGES.DASHBOARD,
      },
    ],
  },
  {
    path: "*",
    element: <Error404 />,
  },
];
