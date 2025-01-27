import { Container, Flex } from "@chakra-ui/react";

import { Suspense } from "react";
import { Outlet } from "react-router-dom";

import Loader from "@artist/utils/Loader";
import ErrorBoundary from "../components/ErrorBoundary";
import Header from "./Header";
import Sidebar from "./Sidebar";

const sidebarAnimate = "all .25s ease";

const LayoutWrapper: React.FC = () => {
  const sidebarWidth = "250px";
  return (
    <ErrorBoundary>
      <Flex minH={"100dvh"}>
        <Sidebar
          bg={"gray.50"}
          maxW={sidebarWidth}
          w={sidebarWidth}
          hideBelow={"md"}
        />
        <Container
          flexGrow={1}
          ml={{ md: sidebarWidth }}
          transition={sidebarAnimate}
          zIndex={0}
          overflowX="hidden"
          maxW={{ base: "100%", md: "calc(100% - 250px)" }}
        >
          <Suspense fallback={<Loader />}>
            <Flex
              flexDir={"column"}
              gap={12}
              minHeight={"80vh"}
              px={2}
              py={4}
              borderRadius={"30px"}
            >
              <Header />
              <Outlet />
            </Flex>
          </Suspense>
        </Container>
      </Flex>
    </ErrorBoundary>
  );
};

export default LayoutWrapper;
