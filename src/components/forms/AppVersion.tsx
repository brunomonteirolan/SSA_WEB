import React, { useEffect } from "react";
import * as yup from "yup";
import { format } from "date-fns";
import { Form, Formik, FormikHelpers } from "formik";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Stack,
  useToast,
} from "@chakra-ui/react";
// Components
import CustomInput from "../Formik/CustomInput";
import CustomAutocomplete from "../Formik/CustomAutocomplete";
import CustomDragNDrop from "../Formik/CustomDragNDrop";
// Utils
import { supportedApps, SupportedApps } from "../../utils/supportedApps";
import useAppVersions from "../../hooks/useAppVersions";
import { AppVersion as AppVersionProps } from "../../@types/appVersion";

export interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData, helpers: FormikHelpers<FormData>) => void;
  app: SupportedApps;
  version?: AppVersionProps | null;
}

export interface FormData {
  name: string;
  version: string;
  releaseDate: string;
  versionDependencies: Array<{ value: string; label: string }>;
  appFile?: File;
}

const validationSchema = yup.object({
  name: yup.string().required(),
  version: yup.string().required(),
  releaseDate: yup
    .string()
    .matches(/\d{4}\-\d{2}\-\d{2}/, "Invalid date format")
    .required(),
});

const formatReleaseDate = (releaseDate?: string | null) =>
  format(releaseDate ? new Date(releaseDate) : new Date(), "yyyy-MM-dd");

const AppVersion: React.FC<Props> = ({ isOpen, onClose, app, onSubmit, version }) => {
  // Hooks
  const { data, isLoading, error } = useAppVersions(null);
  const toast = useToast();

  useEffect(() => {
    if (error) {
      toast({ status: "error", description: error });
    }
  }, [error]);

  const initialValues: FormData = {
    name: version?.name ?? "",
    version: version?.version ?? "",
    releaseDate: formatReleaseDate(version?.releaseDate),
    appFile: undefined,
    versionDependencies: version
      ? version.versionDependencies.map(({ _id, name }) => ({ value: _id, label: name }))
      : [],
  };

  return (
    <Drawer isOpen={isOpen} placement="right" size="md" onClose={onClose}>
      <DrawerOverlay>
        <DrawerContent display="flex" flexDir="column">
          <DrawerCloseButton />

          <DrawerHeader borderBottomWidth="1px">Version form</DrawerHeader>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ setFieldValue, handleChange, isSubmitting, errors }) => (
              <Form style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <DrawerBody flex="1">
                  <Stack spacing="5">
                    <CustomInput
                      name="version"
                      label="Version"
                      placeholder="1.0.0"
                      isRequired
                      onChange={(e) => {
                        handleChange(e);
                        setFieldValue(
                          "name",
                          `${supportedApps[app].displayName} v${e.target.value}`
                        );
                      }}
                      isDisabled={isSubmitting}
                    />

                    <CustomInput name="name" label="Name" isRequired isDisabled={isSubmitting} />

                    <CustomInput
                      name="releaseDate"
                      label="Release date"
                      type="date"
                      isRequired
                      isDisabled={isSubmitting}
                    />

                    <CustomDragNDrop
                      name="appFile"
                      label={version ? "New app file" : "App file"}
                      accept="application/zip, application/x-zip-compressed"
                      isDisabled={isSubmitting}
                    />

                    <CustomAutocomplete
                      name="versionDependencies"
                      label="Version dependencies"
                      placeholder="Choose an app version"
                      items={
                        data?.versions.map(({ _id, name }) => ({ value: _id, label: name })) || []
                      }
                      isLoading={isLoading}
                    />
                  </Stack>
                </DrawerBody>

                <DrawerFooter borderTopWidth="1px">
                  <Button variant="outline" mr="3" onClick={onClose}>
                    Cancel
                  </Button>

                  <Button type="submit" colorScheme="blue" isLoading={isSubmitting}>
                    Submit
                  </Button>
                </DrawerFooter>
              </Form>
            )}
          </Formik>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};

export default AppVersion;
