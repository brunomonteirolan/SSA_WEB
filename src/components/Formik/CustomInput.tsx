import React from "react";
import { useField } from "formik";
import {
  FormControl,
  FormControlProps,
  FormErrorMessage,
  FormLabel,
  Input,
  InputProps,
} from "@chakra-ui/react";

type Props = { name: string; label?: string; formControl?: FormControlProps } & InputProps;

const CustomInput: React.FC<Props> = ({ name, label, formControl, ...props }) => {
  const [field, meta] = useField(name);
  const errorText = meta.error && meta.touched ? meta.error : "";

  return (
    <FormControl {...formControl} isInvalid={!!errorText} isRequired={props.isRequired}>
      <FormLabel>{label}</FormLabel>

      <Input {...field} {...props} />

      <FormErrorMessage>{errorText}</FormErrorMessage>
    </FormControl>
  );
};

export default CustomInput;
