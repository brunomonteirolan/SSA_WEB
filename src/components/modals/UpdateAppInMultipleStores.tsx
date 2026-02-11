import React, { useState } from "react";
import { Form, Formik } from "formik";
import * as yup from "yup";
// Chakra ui
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
  ModalFooter,
  useToast,
} from "@chakra-ui/react";
// Components
import CustomSelect from "../Formik/CustomSelect";
import CustomAutocomplete from "../Formik/CustomAutocomplete";
// Hooks
import useAppVersions from "../../hooks/useAppVersions";
// Utils
import { Store } from "../../@types/store";
import { SupportedApps, supportedApps } from "../../utils/supportedApps";
import { AppVersion } from "../../@types/appVersion";
import { api } from "../../utils/api/externalApi";

interface UpdateAppInMultipleStoresProps {
  isOpen: boolean;
  onClose: () => void;
  stores: Store[];
}

interface FormData {
  app: SupportedApps | "";
  version: string;
  stores: Array<{ value: string; label: string }>;
}

const getVersionHelperText = (isLoading: boolean, versions?: AppVersion[]) => {
  if (isLoading) return "Loading versions";

  return !versions || !versions?.length ? "No version found" : undefined;
};

const initialValues: FormData = {
  app: "",
  version: "",
  stores: [],
};

const validationSchema = yup.object({
  app: yup.string().required(),
  version: yup.string().required(),
  stores: yup
    .array()
    .of(yup.object({ value: yup.string(), label: yup.string() }))
    .min(1)
    .required(),
});

const UpdateAppInMultipleStores: React.FC<UpdateAppInMultipleStoresProps> = ({
  isOpen,
  onClose,
  stores,
}) => {
  // Hooks
  const toast = useToast();

  // States
  const [selectedApp, setSelectedApp] = useState("");
  const { data, isLoading } = useAppVersions(
    selectedApp.length ? (selectedApp as SupportedApps) : null
  );

  if (!isOpen) return null;

  const handleSubmit = async (formData: FormData) => {
    formData.stores.forEach((store) => {
      let result: { status: "success" | "error"; message: string } = {
        status: "success",
        message: "",
      };

      api
        .post(`/stores/${store.value}/update-app/${formData.version}`)
        .then(({ data }) => {
          result.message = `${store.value}: ${data?.message || "Command successfully sent"}`;
        })
        .catch((err) => {
          result = {
            status: "error",
            message:
              `${store.value}: ` +
              (err.response?.data?.message || err.message || "Sorry, something went wrong"),
          };
        })
        .finally(() => toast({ status: result.status, description: result.message }));
    });

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />

      <ModalContent>
        <ModalHeader>Update app in multiple stores</ModalHeader>
        <ModalCloseButton />

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, handleChange }) => (
            <Form>
              <ModalBody>
                <CustomSelect
                  name="app"
                  label="App"
                  placeholder="Select an app"
                  mb="2"
                  isDisabled={isSubmitting}
                  onChange={(e) => {
                    handleChange(e);
                    setSelectedApp(e.target.value);
                  }}
                >
                  {Object.values(supportedApps).map(({ name, displayName }) => (
                    <option key={name} value={name}>
                      {displayName}
                    </option>
                  ))}
                </CustomSelect>

                <CustomSelect
                  name="version"
                  label="Version"
                  placeholder="Select a version"
                  mb="2"
                  isDisabled={
                    !selectedApp.length || isLoading || !data?.versions.length || isSubmitting
                  }
                  helperText={
                    selectedApp.length ? getVersionHelperText(isLoading, data?.versions) : undefined
                  }
                >
                  {data?.versions.map(({ _id, name, version }) => (
                    <option key={_id} value={_id}>
                      {name} ({version})
                    </option>
                  ))}
                </CustomSelect>

                <CustomAutocomplete
                  name="stores"
                  label="Stores"
                  placeholder="Choose the stores"
                  items={stores.map(({ storeId }) => ({ value: storeId, label: storeId }))}
                />
              </ModalBody>

              <ModalFooter>
                <Button onClick={onClose} mr="3">
                  Cancel
                </Button>

                <Button type="submit" colorScheme="blue" isLoading={isSubmitting}>
                  Send command
                </Button>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  );
};

export default UpdateAppInMultipleStores;
