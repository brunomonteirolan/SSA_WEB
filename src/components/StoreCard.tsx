import React, { useState } from "react";
import { Socket } from "socket.io-client";
// Chakra ui
import { Box, Heading, Text, useToast } from "@chakra-ui/react";
// Components
import UpdateApp from "./modals/UpdateApp";
// Utils
import { AppVersion } from "../@types/appVersion";
import { Store } from "../@types/store";
import { api } from "../utils/api/externalApi";

interface Props {
  store: Store;
  socket: Socket;
}

const colorPerType = { info: "blue.200", error: "red" };

const AppVersionLabel: React.FC<{ app: string; version: string | number }> = ({ app, version }) => (
  <Text fontSize="sm">
    <strong>{app}</strong>: {version}
  </Text>
);

const StoreCard: React.FC<Props> = ({ store, socket }) => {
  // Hooks
  const toast = useToast();

  // States
  const [updateAppModal, setUpdateAppModal] = useState(false);

  const showSuccessMessage = (message?: string) => {
    toast({ status: "success", description: message ?? "Command successfully sent" });
    setUpdateAppModal(false);
  };

  const handleSubmit = async (formData: { app: string; version: AppVersion }) => {
    try {
      const { data } = await api.post(
        `/stores/${store.storeId}/update-app/${formData.version._id}`
      );

      showSuccessMessage(data.message);
    } catch (err: any) {
      toast({
        status: "error",
        description: err.response?.data?.message || err.message || "Sorry, an error happened",
      });
    }
  };

  const handleRequestClientUpdate = () => {
    socket.emit("update-client", store.socketId);
    showSuccessMessage();
  };

  return (
    <Box
      borderRadius="md"
      borderColor="gray.200"
      borderWidth="thin"
      shadow="md"
      p="3"
      cursor="pointer"
      transition="ease-in-out .2s"
      _hover={{ shadow: "lg" }}
      onClick={() => setUpdateAppModal(true)}
    >
      <Heading fontSize="2xl" mb="3">
        {store.storeId}
      </Heading>

      {store.clientVersion && (
        <AppVersionLabel app="Client version" version={store.clientVersion} />
      )}

      {store.tpiInfo ? (
        <>
          {store.tpiInfo.gmVersion && (
            <AppVersionLabel app="Game Manager" version={store.tpiInfo.gmVersion} />
          )}

          <AppVersionLabel app="POS Server version" version={store.tpiInfo.PosServerVersion} />

          {store.tpiInfo.roamer_Client ? (
            <AppVersionLabel app="Roamer client" version={store.tpiInfo.roamer_Client} />
          ) : null}

          <AppVersionLabel app="TPI version" version={store.tpiInfo.appVersion} />

          <AppVersionLabel app="Zodiac version" version={store.tpiInfo.zodiac} />
        </>
      ) : (
        <Text textAlign="center">No more information available yet</Text>
      )}

      {store.status && (
        <Text
          textAlign="center"
          fontSize="sm"
          color={colorPerType[store.status.type]}
          borderTopWidth="1px"
          marginTop="2"
          paddingTop="2"
        >
          {store.status.message}
        </Text>
      )}

      <UpdateApp
        store={store}
        isOpen={updateAppModal}
        onClose={() => setUpdateAppModal(false)}
        onSubmit={handleSubmit}
        onRequestClientUpdate={handleRequestClientUpdate}
      />
    </Box>
  );
};

export default StoreCard;
