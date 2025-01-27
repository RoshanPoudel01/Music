import { useStoreHeaderData } from "@artist/store";
import { Flex, Stack, Text } from "@chakra-ui/react";
import MobileNav from "./MobileNav";
import UserMenu from "./UserMenu";

const Header = () => {
  const { headerData } = useStoreHeaderData();

  return (
    <Flex align={"center"} w={"full"} justify={"space-between"}>
      <MobileNav />
      <Stack gap={0} textAlign={{ base: "center", md: "start" }}>
        <Text
          fontSize={{ base: "xl", sm: "2xl", lg: "4xl" }}
          fontWeight={"bold"}
        >
          {headerData?.title}
        </Text>
        <Text color={"gray.500"} fontSize={{ base: "sm", md: "md" }}>
          {headerData?.description}
        </Text>
      </Stack>
      <UserMenu />
    </Flex>
  );
};

export default Header;
