import { imageAssets } from "@artist/assets/images";
import { Avatar } from "@artist/components/ui/avatar";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@artist/components/ui/menu";
import { useLogout } from "@artist/services/service-auth";
import { Icon } from "@chakra-ui/react";
import { Gear, SignOut } from "@phosphor-icons/react";
import { Link } from "react-router-dom";

const UserMenu = () => {
  const { mutateAsync: logout } = useLogout();
  return (
    <MenuRoot
      lazyMount
      positioning={{
        placement: "bottom-end",
      }}
    >
      <MenuTrigger outline={"none"} cursor={"pointer"}>
        <Avatar name="Admin" src={imageAssets.Avatar} />
      </MenuTrigger>
      <MenuContent spaceY={1} minW={"150px"}>
        <MenuItem
          asChild
          cursor={"pointer"}
          _hover={{ bg: "bg.emphasized" }}
          value="profile"
          borderRadius={5}
          p={2}
          alignContent={"center"}
        >
          <Link to="/admin/settings">
            <Icon asChild boxSize={5} mr={2}>
              <Gear />
            </Icon>
            Settings
          </Link>
        </MenuItem>
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
