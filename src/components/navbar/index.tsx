import React, { useState } from "react";
import { Flex, Heading } from "@chakra-ui/react";
import MenuToggle from "./MenuToggle";
import LinkNavbar from "./LinkNavbar";
import ProfileItemNavbar from "./ProfileItemNavbar";
import { useRouter } from "next/router";

const Navbar: React.FC = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-around"
      wrap="wrap"
      w="100%"
      px={6}
      py={4}
      borderBottomWidth="1px"
    >
      <Heading textAlign="center">Super Sacoa app</Heading>

      <MenuToggle isOpen={isOpen} toggle={() => setIsOpen((prev) => !prev)} />

      <Flex
        display={{ base: isOpen ? "flex" : "none", md: "flex" }}
        flexBasis={{ base: "100%", md: "auto" }}
        align="center"
        justify="center"
        direction={["column", "row", "row", "row"]}
      >
        <LinkNavbar to="/" isActive={router.route === "/"}>
          Stores
        </LinkNavbar>

        <LinkNavbar to="/apps" isActive={router.route.includes("/apps")}>
          Apps
        </LinkNavbar>

        <LinkNavbar to="/users" isActive={router.route.includes("/users")} isLast>
          Users
        </LinkNavbar>

        <ProfileItemNavbar />
      </Flex>
    </Flex>
  );
};

export default Navbar;
