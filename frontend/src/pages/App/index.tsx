import {
  useAuthentication,
  useFetchInitData,
  useLogout,
} from "@artist/services/service-auth";
import Loader from "@artist/utils/Loader";
import { Flex } from "@chakra-ui/react";
import { ReactNode, Suspense, useEffect } from "react";
import { Navigate, Outlet, Route, RouteObject, Routes } from "react-router-dom";
import { appRoutes } from "./appRoutes";
import { NAVIGATION_PAGES } from "./navigationPages";
import { NAVIGATION_ROUTES } from "./navigationRoutes";

// Define the shape of your route objects for better type safety
type AppRoute = RouteObject & {
  path?: string;
  accessor?: string[];
  element: ReactNode;
  index?: boolean;
  children?: AppRoute[];
};

const renderRoutes = (
  children: AppRoute[] | undefined,
  role: string | null
): ReactNode => {
  return children
    ?.filter((childRoute) => {
      // Include routes if they have no accessor or if the role is included in the accessor
      return (
        !childRoute.accessor || (role && childRoute.accessor.includes(role))
      );
    })
    .map((childRoute, childIndex) => {
      // Check if the route is an index route
      if (childRoute.index) {
        return <Route key={childIndex} index element={childRoute.element} />;
      } else {
        return (
          <Route
            key={childIndex}
            path={childRoute.path}
            element={childRoute.element}
          >
            {/* Recursively render child routes if they exist */}
            {childRoute.children && renderRoutes(childRoute.children, role)}
          </Route>
        );
      }
    });
};

const App = () => {
  const {
    data: isAuthenticated,
    isPending: isAuthLoading,
    isError,
  } = useAuthentication();
  const { mutateAsync: logout } = useLogout();
  // Fetching initial data in the app
  const { isLoading: isInitDataLoading, isError: isInitDataError } =
    useFetchInitData(!!isAuthenticated);

  useEffect(() => {
    if (typeof isAuthenticated === "boolean" && !isAuthenticated) {
      localStorage.getItem("token") ? logout() : null;
    }
  }, [isAuthenticated, logout]);

  if ((isAuthLoading || isInitDataLoading) && !isError && !isInitDataError) {
    return (
      <Flex h={"100dvh"} w={"100dvw"} justify={"center"} align={"center"}>
        <Loader />
      </Flex>
    );
  }

  function MissingRoute() {
    return <Navigate to={{ pathname: "/" }} />;
  }

  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {isAuthenticated ? (
          <>
            {appRoutes.map((route, index) => (
              <Route key={index} path={route.path} element={route.element}>
                {route.children && renderRoutes(route.children, null)}
              </Route>
            ))}
          </>
        ) : (
          <Route element={<Outlet />}>
            <Route
              path={NAVIGATION_ROUTES.LOGIN}
              element={NAVIGATION_PAGES.LOGIN}
            />
            <Route
              path={NAVIGATION_ROUTES.REGISTER}
              element={NAVIGATION_PAGES.REGISTER}
            />
            <Route
              path="*"
              element={<Navigate to={NAVIGATION_ROUTES.LOGIN} />}
            />
          </Route>
        )}
        <Route path="*" element={<MissingRoute />} />
      </Routes>
    </Suspense>
  );
};

export default App;
