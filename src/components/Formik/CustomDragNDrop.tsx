import React from "react";
import { useField } from "formik";
import { useDropzone, type Accept } from "react-dropzone";
import { Box, Flex, Icon, Text } from "@chakra-ui/react";
import { FiFile } from "react-icons/fi";

interface CustomDragNDropProps {
  name: string;
  label?: string;
  accept?: string | Accept; // ✅ agora aceita string ou Accept (novo tipo)
  isDisabled?: boolean;
}

const colors = {
  success: "green.500",
  error: "red.400",
  default: "gray.500",
};

const normalizeAccept = (a?: string | Accept): Accept | undefined => {
  if (!a) return undefined;
  if (typeof a !== "string") return a;

  const s = a.trim();
  if (!s) return undefined;

  // Se for MIME (ex: "image/*", "application/pdf")
  if (s.includes("/")) {
    return { [s]: [] };
  }

  // Se for extensão (ex: ".zip" ou ".zip,.rar")
  const exts = s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean)
    .map((x) => (x.startsWith(".") ? x : `.${x}`));

  return { "application/octet-stream": exts };
};

const renderDragMessage = (value: File, isDragActive: boolean, isDragReject: boolean, err?: any) => {
  if (isDragActive) return <Text color={colors.success}>Drop your file here to load it</Text>;

  if (err) return <Text color={colors.error}>{err}</Text>;

  if (isDragReject) return <Text color={colors.error}>Invalid file (only .zip are allowed)</Text>;

  if (value)
    return (
      <>
        <Icon as={FiFile} />
        <Text ml="2">{value.name}</Text>
      </>
    );

  return <Text color={colors.default}>Drag 'n' drop the file, or click to choose one</Text>;
};

const CustomDragNDrop: React.FC<CustomDragNDropProps> = ({ name, label, accept, isDisabled }) => {
  // Hooks
  const [field, meta, helpers] = useField<File>(name);

  const { getRootProps, getInputProps, isDragAccept, isDragReject, fileRejections } = useDropzone({
    accept: normalizeAccept(accept), // ✅ aqui é o fix do erro
    disabled: isDisabled,
    maxFiles: 1,
    onDrop: ([file]) => helpers.setValue(file),
  });

  const errorMessage = fileRejections[0]?.errors[0]?.message;

  return (
    <Box>
      {label ? <Text mb="2">{label}</Text> : null}

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
