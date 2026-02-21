import React, { useState } from "react";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import {
  Box,
  Flex,
  Text,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Avatar,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import Link from "next/link";

interface NavLinkProps {
  href: string;
  label: string;
  isActive: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ href, label, isActive }) => (
  <Link href={href} style={{ textDecoration: "none" }}>
    <Box
      px={4}
      py={2}
      borderRadius="6px"
      fontWeight={600}
      fontSize="sm"
      color={isActive ? "white" : "#888"}
      bg={isActive ? "rgba(227,0,27,0.12)" : "transparent"}
      borderBottom={isActive ? "2px solid #E3001B" : "2px solid transparent"}
      _hover={{ color: "white", bg: "rgba(255,255,255,0.05)" }}
      transition="all 0.15s"
      cursor="pointer"
    >
      {label}
    </Box>
  </Link>
);

const Navbar: React.FC = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box
      as="nav"
      bg="#111111"
      borderBottom="1px solid #1F1F1F"
      px={6}
      position="sticky"
      top={0}
      zIndex={100}
      boxShadow="0 1px 20px rgba(0,0,0,0.4)"
    >
      <Flex h="64px" align="center" justify="space-between">
        {/* Logo */}
        <Flex align="center" gap={3}>
          <Box
            w="32px"
            h="32px"
            bg="#E3001B"
            borderRadius="7px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontWeight={900}
            fontSize="18px"
            color="white"
            flexShrink={0}
          >
            S
          </Box>
          <Box>
            <Text fontWeight={900} fontSize="15px" letterSpacing="3px" color="white" lineHeight={1}>
              SACOA
            </Text>
            <Text fontSize="9px" fontWeight={600} letterSpacing="2px" color="#E3001B" lineHeight={1} mt="2px">
              CASHLESS SYSTEM
            </Text>
          </Box>
        </Flex>

        {/* Desktop Nav Links */}
        <Flex display={{ base: "none", md: "flex" }} align="center" gap={1}>
          <NavLink href="/" label="Stores" isActive={router.pathname === "/"} />
          <NavLink href="/apps" label="Apps" isActive={router.pathname.startsWith("/apps")} />
          <NavLink href="/users" label="Usuários" isActive={router.pathname.startsWith("/users")} />
        </Flex>

        {/* User menu */}
        <Flex align="center" gap={3}>
          <Menu>
            <MenuButton>
              <Flex align="center" gap={2} cursor="pointer" _hover={{ opacity: 0.8 }} transition="opacity 0.15s">
                <Avatar
                  size="sm"
                  name={session?.user?.name || "U"}
                  bg="#E3001B"
                  color="white"
                  fontSize="sm"
                  fontWeight={700}
                />
                <Box display={{ base: "none", md: "block" }}>
                  <Text fontSize="sm" fontWeight={600} color="white" lineHeight={1}>
                    {session?.user?.name || "Usuário"}
                  </Text>
                  <Text fontSize="xs" color="#666" lineHeight={1} mt="1px">
                    {session?.user?.email}
                  </Text>
                </Box>
              </Flex>
            </MenuButton>
            <MenuList minW="200px">
              <Box px={3} py={2}>
                <Text fontSize="xs" color="#666" fontWeight={500}>Conectado como</Text>
                <Text fontSize="sm" color="white" fontWeight={600} noOfLines={1}>
                  {session?.user?.email}
                </Text>
              </Box>
              <MenuDivider borderColor="#2D2D2D" />
              <MenuItem
                color="#ff6b6b"
                fontWeight={500}
                onClick={() => signOut({ callbackUrl: "/auth/signin" })}
              >
                Sair
              </MenuItem>
            </MenuList>
          </Menu>

          <IconButton
            display={{ base: "flex", md: "none" }}
            aria-label="Menu"
            icon={mobileOpen ? <CloseIcon /> : <HamburgerIcon />}
            variant="ghost"
            colorScheme="whiteAlpha"
            onClick={() => setMobileOpen((p) => !p)}
            size="sm"
          />
        </Flex>
      </Flex>

      {/* Mobile menu */}
      {mobileOpen && (
        <Box display={{ base: "flex", md: "none" }} flexDir="column" pb={4} gap={1} borderTop="1px solid #1F1F1F" pt={3}>
          <NavLink href="/" label="Stores" isActive={router.pathname === "/"} />
          <NavLink href="/apps" label="Apps" isActive={router.pathname.startsWith("/apps")} />
          <NavLink href="/users" label="Usuários" isActive={router.pathname.startsWith("/users")} />
        </Box>
      )}
    </Box>
  );
};

export default Navbar;
