import { imageAssets } from "@artist/assets/images";
import { Avatar } from "@artist/components/ui/avatar";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@artist/components/ui/menu";
import ChangePassword from "@artist/pages/Password";
import { useLogout } from "@artist/services/service-auth";
import { useInitDataStore } from "@artist/store";
import { Icon, Stack, Text } from "@chakra-ui/react";
import { Gear, SignOut } from "@phosphor-icons/react";

const UserMenu = () => {
  const { initData } = useInitDataStore();
  const { mutateAsync: logout } = useLogout();
  return (
    <MenuRoot
      lazyMount
      positioning={{
        placement: "bottom-end",
      }}
    >
      <MenuTrigger
        outline={"none"}
        cursor={"pointer"}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
        gap={2}
      >
        <Avatar name={initData?.first_name} src={imageAssets.Avatar} />
        <Stack gap={0} alignItems={"flex-start"}>
          <Text>{initData?.first_name + " " + initData?.last_name}</Text>
          <Text>{initData?.email}</Text>
        </Stack>
      </MenuTrigger>
      <MenuContent spaceY={1} minW={"150px"}>
        <ChangePassword
          trigger={
            <MenuItem
              value="change-password"
              cursor={"pointer"}
              borderRadius={5}
            >
              <Gear size={20} />
              Change Password
            </MenuItem>
          }
        />
        <MenuItem
          cursor={"pointer"}
          color="fg.error"
          borderRadius={5}
          _hover={{ bg: "bg.error", color: "fg.error" }}
          onClick={async () => await logout()}
          value="signout"
        >
          <Icon asChild boxSize={5} mr={2}>
            <SignOut />
          </Icon>
          Sign Out
        </MenuItem>
      </MenuContent>
    </MenuRoot>
  );
};

export default UserMenu;
