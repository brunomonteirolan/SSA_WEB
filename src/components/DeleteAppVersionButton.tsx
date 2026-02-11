import React, { useState } from "react";
// Chakra ui
import { IconButton, useToast } from "@chakra-ui/react";
// Icons
import { DeleteIcon } from "@chakra-ui/icons";
// Components
import { ConfirmationModal } from "./modals/ConfirmationModal";
// Utils
import { useConfirmationModal } from "../hooks/useConfirmationModal";
import { AppVersion } from "../@types/appVersion";
import { api } from "../utils/api/externalApi";
import useAppVersions from "../hooks/useAppVersions";

interface DeleteAppVersionButtonProps {
  version: AppVersion;
}

export const DeleteAppVersionButton: React.FC<DeleteAppVersionButtonProps> = ({ version }) => {
  // Hooks
  const { onOpen, ...confirmationProps } = useConfirmationModal();
  const toast = useToast();
  const { mutate } = useAppVersions(version.app);

  // States
  const [isLoading, setIsLoading] = useState(false);

  if (!version) return null;

  const handleDelete = async () => {
    setIsLoading(true);

    try {
      const { data } = await api.delete(`/appVersions/${version._id}`);

      mutate(data.versions);
      toast({ status: "success", description: data.message ?? "App successfully delete" });
      confirmationProps.onClose();
    } catch (err) {
      toast({
        status: "error",
        description:
          err.response?.data?.message || err.message || "Sorry, an unexpected error happened",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <IconButton
        aria-label="Delete"
        icon={<DeleteIcon />}
        variant="outline"
        colorScheme="red"
        size="sm"
        ml="2"
        onClick={() =>
          onOpen({
            description: (
              <>
                Are you sure you'd like to delete <strong>{version.name}</strong>?
              </>
            ),
          })
        }
      />

      <ConfirmationModal
        {...confirmationProps}
        title="Delete an app version"
        onYes={handleDelete}
        isLoading={isLoading}
      />
    </>
  );
};
