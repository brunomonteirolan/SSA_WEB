import React from "react";
// Chakra ui
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";

type ReactString = React.ReactElement | string;

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: ReactString;
  description?: ReactString;
  onYes: () => void;
  onNo?: () => void;
  isLoading?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  onYes,
  onNo,
  isLoading,
}) =>
  !isOpen ? null : (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />

      <ModalContent>
        <ModalHeader>{title}</ModalHeader>

        <ModalCloseButton />

        <ModalBody>{description}</ModalBody>

        <ModalFooter>
          <Button colorScheme="red" mr={3} onClick={onNo ?? onClose}>
            No
          </Button>

          <Button colorScheme="green" onClick={onYes} isLoading={isLoading}>
            Yes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
