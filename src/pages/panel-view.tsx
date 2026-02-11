import React from "react";
// Chakra ui
import { Box, Center, Flex, Text } from "@chakra-ui/react";
// Components
import { ClientPanelView } from "../components/ClientPanelView";
import Container from "../components/Container";
// Hooks
import useClients from "../hooks/useClients";

const View: React.FC = () => {
  const { clients, isLoading, error } = useClients({ refreshInterval: 10 * 1000 });

  return (
    <Container
      pageTitle="Clients view"
      skipNavbar
      isPageLoading={isLoading ? "Loading clients" : undefined}
      h="full"
    >
      {error && (
        <Center h="full">
          <Box py="2" px="4" bgColor="red.500" borderRadius="sm" textAlign="center">
            <Text fontSize="lg" fontWeight="bold">
              Error
            </Text>

            <Text fontSize="lg" fontWeight="bold">
              {error.message}
            </Text>
          </Box>
        </Center>
      )}
      <Flex wrap="wrap">
        {clients &&
          clients.map((client) => <ClientPanelView key={client.storeId} client={client} />)}
      </Flex>
    </Container>
  );
};

export default View;
