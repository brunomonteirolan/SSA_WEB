import React from "react";
import * as yup from "yup";
import { Form, Formik, FormikHelpers } from "formik";
import { Button } from "@chakra-ui/react";

import CustomInput from "../Formik/CustomInput";

export interface FormData {
  name: string;
  email: string;
}

interface Props {
  onSubmit: (data: FormData, helpers: FormikHelpers<FormData>) => void;
}

const validationSchema = yup.object({
  name: yup.string().required(),
  email: yup.string().email().required(),
});

const UserForm: React.FC<Props> = ({ onSubmit }) => {
  const initialValues = { name: "", email: "" };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {({ isSubmitting }) => (
        <Form>
          <CustomInput
            name="name"
            label="Name"
            isRequired
            formControl={{ mb: 2 }}
            isDisabled={isSubmitting}
          />

          <CustomInput
            name="email"
            label="Email"
            type="email"
            isRequired
            formControl={{ mb: 4 }}
            isDisabled={isSubmitting}
          />

          <Button
            type="submit"
            variant="outline"
            colorScheme="blue"
            w="full"
            isLoading={isSubmitting}
          >
            Submit
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default UserForm;
