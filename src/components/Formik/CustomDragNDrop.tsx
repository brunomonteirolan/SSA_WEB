import React from "react";
import { useField } from "formik";
import { useDropzone } from "react-dropzone";
// Chakra UI
import Icon from "@chakra-ui/react";
import { Box, Flex, Text } from "@chakra-ui/react";
// Icons
import { FiFile } from "react-icons/fi";

interface CustomDragNDropProps {
  name: string;
  label?: string;
  accept: string;
  isDisabled?: boolean;
}

const colors = {
  success: "green.500",
  error: "red.400",
  default: "gray.500",
};

const renderDragMessage = (
  value: File,
  isDragActive: boolean,
  isDragReject: boolean,
  err?: any
) => {
  if (isDragActive) return <Text color={colors.success}>Drop your file here to load it</Text>;

  if (err) return <Text color={colors.error}>{err}</Text>;

  if (isDragReject) return <Text color={colors.error}>Invalid file (only .zip are allowed)</Text>;

  if (value)
    return (
      <>
        <Icon as={FiFile} />

        <Text ml="2">{value.name} </Text>
      </>
    );

  return <Text color={colors.default}>Drag 'n' drop the file, or click to choose one</Text>;
};

const CustomDragNDrop: React.FC<CustomDragNDropProps> = ({ name, label, accept, isDisabled }) => {
  // Hooks
  const [field, meta, helpers] = useField<File>(name);

  const { getRootProps, getInputProps, isDragAccept, isDragReject, fileRejections } = useDropzone({
    accept,
    disabled: isDisabled,
    maxFiles: 1,
    onDrop: ([file]) => helpers.setValue(file),
  });

  const errorMessage = fileRejections[0]?.errors[0]?.message;

  return (
    <Box>
      <Text mb="2">{label}</Text>

      <Flex
        {...getRootProps()}
        border="2px"
        borderRadius="md"
        borderColor={
          isDragReject || errorMessage
            ? colors.error
            : meta.value || isDragAccept
            ? colors.success
            : colors.default
        }
        borderStyle="dashed"
        p="1"
        justify="center"
        align="center"
      >
        <input onBlur={field.onBlur} {...getInputProps()} />

        {renderDragMessage(meta.value, isDragAccept, isDragReject, errorMessage)}
      </Flex>
    </Box>
  );
};

export default CustomDragNDrop;
