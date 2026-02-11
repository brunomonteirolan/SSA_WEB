import React, { useState } from "react";
import { parseISO, parse, formatISO } from "date-fns";
import {
  Box,
  Button,
  Center,
  CircularProgress,
  IconButton,
  Select,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import { EditIcon, SmallAddIcon } from "@chakra-ui/react";

// Components
import Container from "../../components/Container";
import AppVersion, { Props as AppVersionProps } from "../../components/forms/AppVersion";
import { DeleteAppVersionButton } from "../../components/DeleteAppVersionButton";
// Utils
import { AppVersion as AppVersionType } from "../../@types/appVersion";
import { SupportedApps, supportedApps } from "../../utils/supportedApps";
import { api } from "../../utils/api/externalApi";
import useAppVersions from "../../hooks/useAppVersions";

const Apps: React.FC = () => {
  // Hooks
  const toast = useToast();

  // States
  const [selectedApp, setSelectedApp] = useState("");
  const [versionForm, setVersionForm] = useState<{ open: boolean; version: AppVersionType | null }>(
    { open: false, version: null }
  );

  const { data, isLoading, mutate } = useAppVersions(
    selectedApp.length ? (selectedApp as SupportedApps) : null
  );

  const appVersions = data?.versions ?? [];

  const versionFormControl = {
    open: (version?: AppVersionType) => setVersionForm({ open: true, version: version ?? null }),
    close: () => setVersionForm({ open: false, version: null }),
  };

  const handleNewVersion: AppVersionProps["onSubmit"] = async (formData, { setSubmitting }) => {
    try {
      setSubmitting(true);

      const reqData = new FormData();
      reqData.append("app", selectedApp);
      reqData.append("name", formData.name);
      reqData.append("version", formData.version);
      reqData.append(
        "releaseDate",
        formatISO(parse(formData.releaseDate, "yyyy-MM-dd", new Date()))
      );
      reqData.append(
        "versionDependencies",
        JSON.stringify(formData.versionDependencies.map(({ value }) => value))
      );

      if (formData.appFile) {
        reqData.append("appFile", formData.appFile);

        toast({
          status: "info",
          description: "Sending app to the server may take a few minutes...",
        });
      }

      const { data } = await api.request({
        url: "/appVersions/" + (versionForm.version?._id ?? ""),
        method: !versionForm.version ? "post" : "put",
        data: reqData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      mutate(data.versions);
      versionFormControl.close();
      toast({ status: "success", description: data.message ?? "Version successfully updated" });
    } catch (err) {
      setSubmitting(false);
      toast({
        status: "error",
        description: err.response?.data?.message || err.message || "Error creating version",
      });
    }
  };

  return (
    <Container pageTitle="Apps">
      <Select
        placeholder="Select an app"
        value={selectedApp}
        onChange={(app) => setSelectedApp(app.target.value)}
        isDisabled={isLoading && selectedApp.length > 0}
      >
        {Object.values(supportedApps).map(({ name, displayName }) => (
          <option key={name} value={name}>
            {displayName}
          </option>
        ))}
      </Select>

      {selectedApp && (
        <>
          <Box mt="2" display="flex" flexDir="column">
            <Button
              ml="auto"
              size="sm"
              leftIcon={<SmallAddIcon />}
              onClick={() => versionFormControl.open()}
              isDisabled={isLoading}
            >
              Add
            </Button>

            {isLoading ? (
              <Center>
                <CircularProgress isIndeterminate />
              </Center>
            ) : !appVersions.length ? (
              <Text textAlign="center" fontSize="lg">
                Versions not found, please add one
              </Text>
            ) : (
              <Table>
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Version</Th>
                    <Th>Release date</Th>
                    <Th>Version dependencies</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>

                <Tbody>
                  {appVersions
                    .sort((a, b) => (a.releaseDate < b.releaseDate ? 1 : -1))
                    .map((version) => (
                      <Tr key={version.version}>
                        <Td color="blue" textDecor="underline">
                          <a href={version.url} target="_blank">
                            {version.name}
                          </a>
                        </Td>

                        <Td>{version.version}</Td>

                        <Td>{parseISO(version.releaseDate.split("T")[0]).toLocaleDateString()}</Td>

                        <Td>
                          {version.versionDependencies?.map((version) => version.name).join(", ") ||
                            "None"}
                        </Td>

                        <Td>
                          <IconButton
                            aria-label="Edit"
                            icon={<EditIcon />}
                            variant="outline"
                            colorScheme="green"
                            size="sm"
                            mr="2"
                            onClick={() => versionFormControl.open(version)}
                          />

                          <DeleteAppVersionButton version={version} />
                        </Td>
                      </Tr>
                    ))}
                </Tbody>
              </Table>
            )}
          </Box>

          <AppVersion
            isOpen={versionForm.open}
            onClose={() => versionFormControl.close()}
            onSubmit={handleNewVersion}
            app={selectedApp as SupportedApps}
            version={versionForm.version}
          />
        </>
      )}
    </Container>
  );
};

export default Apps;
