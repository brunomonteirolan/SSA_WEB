import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Button, Flex, Text, Wrap, WrapItem } from "@chakra-ui/react";
import { DownloadIcon } from "@chakra-ui/icons";
import Container from "../components/Container";
import StoreCard from "../components/StoreCard";
import UpdateAppInMultipleStores from "../components/modals/UpdateAppInMultipleStores";
import { Store } from "../@types/store";
import { backend } from "../configs";

export default function Home() {
  const socket = useRef<Socket | null>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [updateStoresModal, setUpdateStoresModal] = useState(false);

  useEffect(() => {
    if (!socket.current?.connected) {
      socket.current = io(backend.url ?? "");
    }

    socket.current.on("update-connections", (data: { stores: Record<string, Store> }) => {
      setStores(Object.values(data.stores));
    });

    return () => {
      socket.current?.off("update-connections");
    };
  }, []);

  return (
    <Container>
      <Flex justify="flex-end" mb="4">
        <Button
          variant="outline"
          leftIcon={<DownloadIcon />}
          size="md"
          mr="2"
          isDisabled={!stores.length}
          onClick={() => setUpdateStoresModal(true)}
        >
          Update multiple stores
        </Button>

        <Button
          variant="outline"
          as="a"
          href={`${backend.api}/client/latest`}
          leftIcon={<DownloadIcon />}
          size="md"
        >
          Download client
        </Button>
      </Flex>

      {stores.length ? (
        <Wrap spacing="4">
          {stores
            .sort((a, b) => (a.storeId > b.storeId ? 1 : -1))
            .map((store) => (
              <WrapItem key={store.storeId}>
                <StoreCard store={store} socket={socket.current!} />
              </WrapItem>
            ))}
        </Wrap>
      ) : (
        <Text fontSize="xl" textAlign="center">
          No stores connected
        </Text>
      )}

      <UpdateAppInMultipleStores
        isOpen={updateStoresModal}
        onClose={() => setUpdateStoresModal(false)}
        stores={stores}
      />
    </Container>
  );
}
