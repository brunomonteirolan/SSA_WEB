import { useState } from "react";
// Chakra ui
import { useDisclosure } from "@chakra-ui/react";

type ReactString = React.ReactElement | string;

export const useConfirmationModal = () => {
  // Hooks
  const disclosure = useDisclosure();

  // States
  const [title, setTitle] = useState<ReactString>(null);
  const [description, setDescription] = useState<ReactString>(null);

  const onOpen = (params?: { title?: ReactString; description?: ReactString }) => {
    if (params?.title) {
      setTitle(params.title);
    }

    if (params?.description) {
      setDescription(params.description);
    }

    disclosure.onOpen();
  };

  return { ...disclosure, onOpen, title, description };
};
