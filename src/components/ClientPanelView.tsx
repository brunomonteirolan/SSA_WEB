import { Center, Text } from "@chakra-ui/react";
import React from "react";
import { Client } from "../models/clientModel";

interface ClientPanelViewProps {
  client: Client;
}

export const ClientPanelView: React.FC<ClientPanelViewProps> = ({ client }) => {
  return (
    <Center
      m="2"
      px="6"
      py="2"
      w="75px"
      bgColor={client.connected ? "#00E517" : "#E50000"}
      borderRadius="sm"
    >
      <Text fontSize="xl" fontWeight="bold">
        {client.storeId}
      </Text>
    </Center>
  );
};
