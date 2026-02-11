import React from "react";
import Link from "next/link";
import { Button } from "@chakra-ui/react";

interface Props {
  to: string;
  isLast?: boolean;
  isActive?: boolean;
  children?: React.ReactNode;
}

const LinkNavbar: React.FC<Props> = ({ to, isLast = false, isActive = false, children }) => (
  <Link href={to} style={{ width: "100%" }}>
    <Button
      w={{ base: "100%", md: "auto" }}
      variant={isActive ? "outline" : "ghost"}
      m={1}
      mb={{ base: isLast ? 2 : 1, md: 1 }}
      mr={{ base: 1, md: isLast ? 2 : 1 }}
    >
      {children}
    </Button>
  </Link>
);

export default LinkNavbar;
