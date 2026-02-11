import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
// Chakra ui
import { Box, BoxProps } from "@chakra-ui/react";
import { Center, CircularProgress, Text } from "@chakra-ui/react";
// Components
import Navbar from "./navbar";

interface Props extends BoxProps {
  pageTitle?: string;
  skipNavbar?: boolean;
  isPageLoading?: boolean | string;
}

const Container: React.FC<Props> = ({
  pageTitle = "",
  skipNavbar,
  isPageLoading,
  children,
  ...props
}) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "unauthenticated") {
    router.push("/api/auth/signin");
    return null;
  }

  if (status === "loading")
    return (
      <Center h="100vh">
        <CircularProgress isIndeterminate />
      </Center>
    );

  return (
    <Box h="100vh">
      <Head>
        <title>{pageTitle.length ? `${pageTitle} - ` : ""}Super Sacoa app</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {!skipNavbar && <Navbar />}

      {isPageLoading ? (
        <Center h="full">
          <CircularProgress isIndeterminate />
          {typeof isPageLoading === "string" && (
            <Text ml="4" fontSize="2xl">
              {isPageLoading}
            </Text>
          )}
        </Center>
      ) : (
        <Box px={6} py={4} {...props}>
          {children}
        </Box>
      )}
    </Box>
  );
};

export default Container;
