import React from "react";
import { useField } from "formik";
import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Select,
  SelectProps,
} from "@chakra-ui/react";

type Props = { label?: string; name: string; helperText?: string } & SelectProps;

const CustomSelect: React.FC<Props> = ({ label, name, helperText, ...props }) => {
  const [field, meta] = useField(name);
  const errorText = meta.error && meta.touched ? meta.error : "";

  return (
    <FormControl isInvalid={!!errorText} isRequired={props.isRequired}>
      <FormLabel>{label}</FormLabel>

      <Select {...field} {...props} />

      <FormErrorMessage>{errorText}</FormErrorMessage>

      <FormHelperText>{helperText}</FormHelperText>
    </FormControl>
  );
};

export default CustomSelect;
