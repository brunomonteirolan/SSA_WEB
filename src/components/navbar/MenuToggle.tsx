import React from "react";
import { IconButton, CloseIcon, HamburgerIcon } from "@chakra-ui/react";


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
