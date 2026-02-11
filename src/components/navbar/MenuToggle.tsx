import React from "react";
import { IconButton } from "@chakra-ui/react";
import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";


interface Props {
  isOpen: boolean;
  toggle: () => void;
}

const MenuToggle: React.FC<Props> = ({ isOpen, toggle }) => {
  return (
    <IconButton
      aria-label="Menu button"
      display={{ base: "block", md: "none" }}
      onClick={toggle}
      icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
    />
  );
};

export default MenuToggle;
