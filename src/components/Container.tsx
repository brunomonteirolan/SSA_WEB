import React, { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { Box, BoxProps, Center, CircularProgress } from "@chakra-ui/react";
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
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading" || status === "unauthenticated")
    return (
      <Center h="100vh" bg="#0A0A0A">
        <CircularProgress isIndeterminate color="#E3001B" />
      </Center>
    );

  return (
    <Box minH="100vh" bg="#0A0A0A">
      <Head>
        <title>{pageTitle.length ? `${pageTitle} — ` : ""}Sacoa Super App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {!skipNavbar && <Navbar />}

      {isPageLoading ? (
        <Center h="calc(100vh - 64px)">
          <CircularProgress isIndeterminate color="#E3001B" />
        </Center>
      ) : (
        <Box px={6} py={5} {...props}>
          {children}
        </Box>
      )}
    </Box>
  );
};

export default Container;
