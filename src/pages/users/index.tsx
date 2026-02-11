import React, { useEffect, useState } from "react";
import { FormikHelpers } from "formik";
import axios from "axios";
import copy from "copy-to-clipboard";
import {
  Button,
  Center,
  CircularProgress,
  Link,
  Popover,
  PopoverArrow,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import { SmallAddIcon } from "@chakra-ui/react";

import UserForm, { FormData } from "../../components/forms/UserForm";
import { User } from "../../models/user";
import Container from "../../components/Container";

const Users: React.FC = () => {
  // Hooks
  const toast = useToast();

  // States
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: useSwr
    const fetchUsers = async () => {
      setLoading(true);

      try {
        const { data } = await axios.get("/api/users");
        setUsers(data.users);
      } catch (err) {
        toast({
          status: "error",
          description: err.response?.data?.message || err.message || "Sorry, an error happened",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading)
    return (
      <Center h="100vh">
        <CircularProgress isIndeterminate />

        <Text ml="3" fontSize="lg">
          Loading users
        </Text>
      </Center>
    );

  const handleNewUser = async (
    formData: FormData,
    { setSubmitting, resetForm }: FormikHelpers<FormData>
  ) => {
    try {
      const { data } = await axios.post("/api/auth/signup", formData);

      toast({ status: "success", description: "User created successfully" });
      setUsers((prev) => [...prev, data.user]);
      resetForm();
    } catch (err) {
      toast({
        status: "error",
        description: err.response?.data?.message || err.message || "Sorry, an error happened",
      });

      setSubmitting(false);
    }
  };

  const handleCopy = (index: number) => {
    copy(`${window.location.origin}/first-access/${users[index].confirmationCode}`);
    toast({ status: "success", description: "First access URL copied successfully" });
  };

  return (
    <Container pageTitle="Users" display="flex" flexDir="column">
      <Popover placement="left">
        <PopoverTrigger>
          <Button ml="auto" size="sm" leftIcon={<SmallAddIcon />}>
            Add
          </Button>
        </PopoverTrigger>

        <PopoverContent p="5">
          <PopoverArrow />
          <PopoverCloseButton />

          <UserForm onSubmit={handleNewUser} />
        </PopoverContent>
      </Popover>

      {users.length ? (
        <Table>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>

          <Tbody>
            {users.map(({ name, email, status }, index) => (
              <Tr key={email}>
                <Td>{name}</Td>
                <Td>{email}</Td>
                <Td>
                  {status === "Active" ? (
                    <Text color="green.400">{status}</Text>
                  ) : (
                    <Link id={`status-${index}`} color="blue.200" onClick={() => handleCopy(index)}>
                      {status}
                    </Link>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      ) : (
        <Text fontSize="lg" textAlign="center">
          No users added
        </Text>
      )}
    </Container>
  );
};

export default Users;
