import { HStack, Text } from "@chakra-ui/react";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ErrorBoundary } from "react-error-boundary";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter, useNavigate } from "react-router-dom";
import { Slide, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "./components/ui/button";
import { Provider } from "./components/ui/provider";
import { authTokenKey } from "./services/service-auth";
import TokenService from "./services/service-token";
import { globalStyles } from "./theme/global";
import ScrollToTop from "./utils/ScrollToTop";

const ErrorFallback = () => {
  return (
    <HStack justify={"center"}>
      <Text>Something went wrong:</Text>
      <Button onClick={() => window.location.reload()}>Retry</Button>
    </HStack>
  );
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      staleTime: 60 * 60 * 1000,
    },
  },
  queryCache: new QueryCache({
    onError: async (error) => {
      const isAuthenticated = TokenService.isAuthenticated();
      const navigate = useNavigate();
      const err = error as AxiosError;
      if (err.request?.status === 401) {
        const expiryTime = TokenService.getToken()?.expiresIn;
        if (Date.now() > (expiryTime ?? 0) && isAuthenticated) {
          queryClient.setQueryData([authTokenKey], () => false);
          setTimeout(() => {
            TokenService.clearToken();
            queryClient.clear();
            navigate("/login");
            toast.error("Session Expired! Please login again!");
          }, 500);
        }
        if (!isAuthenticated) {
          toast.error("You are not authorized to access this page!");
          navigate("/");
        }
      }
    },
  }),
});

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <BrowserRouter>
        <ScrollToTop />
        <Provider>
          <QueryClientProvider client={queryClient}>
            <ToastContainer
              position="bottom-right"
              newestOnTop
              autoClose={3000}
              pauseOnFocusLoss={false}
              transition={Slide}
              theme="colored"
            />
            <HelmetProvider>{children}</HelmetProvider>
            {globalStyles()}
          </QueryClientProvider>
        </Provider>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default Providers;
