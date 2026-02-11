import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import Head from "next/head";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      toast({ status: "error", description: "Invalid email or password" });
    } else {
      router.push("/");
    }

    setIsLoading(false);
  };

  return (
    <>
      <Head>
        <title>Sign In - Super Sacoa App</title>
      </Head>
      <Center h="100vh" bg="gray.50">
        <Box
          bg="white"
          p={8}
          borderRadius="lg"
          shadow="md"
          w={{ base: "90%", sm: "400px" }}
        >
          <Heading textAlign="center" mb={6} size="lg">
            Super Sacoa App
          </Heading>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                w="full"
                isLoading={isLoading}
              >
                Sign In
              </Button>
            </VStack>
          </form>
        </Box>
      </Center>
    </>
  );
}
