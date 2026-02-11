import React from "react";
import { useSession, signOut } from "next-auth/react";
// Chakra ui
import {
  Menu,
  MenuButton,
  IconButton,
  Icon,
  MenuList,
  MenuGroup,
  MenuItem,
} from "@chakra-ui/react";
// Icons
import { AiOutlineUser } from "react-icons/ai";

const ProfileItemNavbar: React.FC = () => {
  const { data: session, status } = useSession();

  return (
    <Menu>
      <MenuButton as={IconButton} aria-label="User" icon={<Icon as={AiOutlineUser} />} />

      <MenuList>
        <MenuGroup title={status === "loading" ? "Loading..." : session?.user?.name || "User account"}>
          <MenuItem onClick={() => signOut()}>Sign out</MenuItem>
        </MenuGroup>
      </MenuList>
    </Menu>
  );
};

export default ProfileItemNavbar;
