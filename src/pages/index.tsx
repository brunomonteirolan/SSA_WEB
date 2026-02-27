import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import {
  Button, Flex, Text, Wrap, WrapItem, useToast,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody,
  ModalFooter, ModalCloseButton, Textarea,
} from "@chakra-ui/react";
import { DownloadIcon, BellIcon } from "@chakra-ui/icons";
import axios from "axios";
import Container from "../components/Container";
import StoreCard from "../components/StoreCard";
import UpdateAppInMultipleStores from "../components/modals/UpdateAppInMultipleStores";
import { Store } from "../@types/store";
import { backend } from "../configs";

export default function Home() {
  const socket = useRef<Socket | null>(null);
  const toast = useToast();

  const [stores, setStores] = useState<Store[]>([]);
  const [updateStoresModal, setUpdateStoresModal] = useState(false);

  // Notification modal state
  const [notifyModal, setNotifyModal] = useState(false);
  const [notifyStoreId, setNotifyStoreId] = useState<string | null>(null);
  const [notifyMessage, setNotifyMessage] = useState("Loja atualizada com sucesso.");
  const [notifying, setNotifying] = useState(false);

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

  const openNotify = (storeId: string) => {
    setNotifyStoreId(storeId);
    setNotifyMessage("Loja atualizada com sucesso.");
    setNotifyModal(true);
  };

  const handleNotify = async () => {
    if (!notifyStoreId) return;
    setNotifying(true);
    try {
      await axios.post("/api/notify-store", {
        storeId: notifyStoreId,
        message: notifyMessage,
      });
      toast({ status: "success", description: `Notificação enviada para loja ${notifyStoreId}` });
      setNotifyModal(false);
    } catch (err: any) {
      toast({ status: "error", description: err.response?.data?.message || "Erro ao enviar notificação" });
    } finally {
      setNotifying(false);
    }
  };

  return (
    <Container>
      <Flex justify="flex-end" mb="4" gap={2} flexWrap="wrap">
        <Button
          colorScheme="brand"
          variant="outline"
          leftIcon={<DownloadIcon />}
          size="md"
          isDisabled={!stores.length}
          onClick={() => setUpdateStoresModal(true)}
        >
          Atualizar múltiplas lojas
        </Button>

        <Button
          colorScheme="brand"
          variant="outline"
          as="a"
          href="/api/client/latest"
          leftIcon={<DownloadIcon />}
          size="md"
        >
          Baixar cliente
        </Button>
      </Flex>

      {stores.length ? (
        <Wrap spacing="4">
          {stores
            .sort((a, b) => (a.storeId > b.storeId ? 1 : -1))
            .map((store) => (
              <WrapItem key={store.storeId}>
                <Flex direction="column" gap={2}>
                  <StoreCard store={store} socket={socket.current!} />
                  <Button
                    size="xs"
                    variant="outline"
                    colorScheme="yellow"
                    leftIcon={<BellIcon />}
                    onClick={() => openNotify(store.storeId)}
                  >
                    Notificar loja
                  </Button>
                </Flex>
              </WrapItem>
            ))}
        </Wrap>
      ) : (
        <Text fontSize="xl" textAlign="center" color="#555">
          Nenhuma loja conectada
        </Text>
      )}

      <UpdateAppInMultipleStores
        isOpen={updateStoresModal}
        onClose={() => setUpdateStoresModal(false)}
        stores={stores}
      />

      {/* Notification modal */}
      <Modal isOpen={notifyModal} onClose={() => setNotifyModal(false)} size="sm">
        <ModalOverlay />
        <ModalContent bg="#141414" border="1px solid #2D2D2D">
          <ModalHeader color="white">Notificar loja {notifyStoreId}</ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody>
            <Text fontSize="sm" color="#AAA" mb={2}>
              Mensagem a enviar para o cliente SSA nesta loja:
            </Text>
            <Textarea
              value={notifyMessage}
              onChange={(e) => setNotifyMessage(e.target.value)}
              placeholder="Mensagem de notificação..."
              rows={3}
              resize="vertical"
              bg="#1A1A1A"
              border="1px solid #2D2D2D"
              color="white"
              _focus={{ borderColor: "#E3001B" }}
            />
          </ModalBody>
          <ModalFooter gap={3}>
            <Button variant="ghost" colorScheme="whiteAlpha" onClick={() => setNotifyModal(false)}>
              Cancelar
            </Button>
            <Button colorScheme="yellow" onClick={handleNotify} isLoading={notifying} leftIcon={<BellIcon />}>
              Enviar notificação
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
}
