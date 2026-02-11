import React, { useEffect, useState } from "react";
import axios from "axios";
import { Form, Formik } from "formik";
import semver from "semver";
import {
  Button,
  Center,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from "@chakra-ui/react";
// Components
import CustomSelect from "../Formik/CustomSelect";
// Utils
import { AppVersion } from "../../@types/appVersion";
import { client, supportedApps } from "../../utils/supportedApps";
import { Store } from "../../@types/store";

interface Props {
  store: Store;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { app: string; version: AppVersion }) => void;
  onRequestClientUpdate: () => void;
}

const initialValues = {
  app: "console",
  version: 0,
};

const UpdateApp: React.FC<Props> = ({
  store,
  isOpen,
  onClose,
  onSubmit,
  onRequestClientUpdate,
}) => {
  // Hooks
  const toast = useToast();

  // States
  const [selectedApp, setSelectedApp] = useState("console");
  const [appVersions, setAppVersions] = useState<AppVersion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const { data } = await axios.get(`/api/appVersions?app=${selectedApp}`);
        setAppVersions(data.versions);
      } catch (err) {
        toast({
          status: "error",
          description: err.response?.data?.message || err.message || "Sorry, an error happened",
        });
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && selectedApp.length) {
      fetchData();
    }
  }, [selectedApp, isOpen]);

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />

      <ModalContent>
        <ModalHeader>Update an app</ModalHeader>
        <ModalCloseButton />

        <Formik
          initialValues={initialValues}
          onSubmit={(data) => onSubmit({ ...data, version: appVersions[data.version] })}
        >
          {({ handleChange, isSubmitting }) => (
            <Form>
              <ModalBody>
                {semver.lt(store.clientVersion, client.version) && (
                  <Center mb="3" pb="3" borderBottomWidth="1px">
                    <Button variant="outline" colorScheme="blue" onClick={onRequestClientUpdate}>
                      Update client
                    </Button>
                  </Center>
                )}

                <CustomSelect
                  name="app"
                  label="App"
                  isDisabled={isSubmitting}
                  onChange={(e) => {
                    handleChange(e);
                    setSelectedApp(e.target.value);
                  }}
                >
                  {Object.values(supportedApps).map(({ name, displayName }, index) =>
                    semver.gte(store.clientVersion, supportedApps[name].minClientVersion) ? (
                      <option key={index} value={name}>
                        {displayName}
                      </option>
                    ) : null
                  )}
                </CustomSelect>

                <CustomSelect
                  name="version"
                  label="Version"
                  isDisabled={loading || !appVersions.length || isSubmitting}
                  helperText={!appVersions.length && "No version found"}
                >
                  {appVersions.map(({ name, version }, index) => (
                    <option key={index} value={index}>
                      {name} ({version})
                    </option>
                  ))}
                </CustomSelect>
              </ModalBody>

              <ModalFooter>
                <Button onClick={onClose} mr="3">
                  Cancel
                </Button>

                <Button
                  type="submit"
                  colorScheme="blue"
                  isDisabled={!appVersions.length}
                  isLoading={isSubmitting}
                >
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

export default UpdateApp;
