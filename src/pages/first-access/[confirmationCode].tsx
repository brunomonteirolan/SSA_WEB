import React from "react";
import * as yup from "yup";
import { Form, Formik, FormikHelpers } from "formik";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth/next";
import { signIn } from "next-auth/react";
import { Box, Button, Center, Heading, Text, useToast } from "@chakra-ui/react";
import axios from "axios";

import { authOptions } from "../api/auth/[...nextauth]";
import UserModel from "../../models/user";
import CustomInput from "../../components/Formik/CustomInput";
import connectToMongo from "../../utils/mongoose";

interface Props {
  user: {
    name: string;
    email: string;
  };
  confirmationCode: string;
}

const initialValues = { password: "", confirmPassword: "" };

const validationSchema = yup.object({
  password: yup.string().min(8).required(),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required(),
});

const FirstAccess: React.FC<Props> = ({ user, confirmationCode }) => {
  const toast = useToast();

  const handleSubmit = async (
    { password }: typeof initialValues,
    { setSubmitting }: FormikHelpers<typeof initialValues>
  ) => {
    try {
      await axios.post(`/api/auth/signup/${confirmationCode}`, { password });
      signIn("credentials", { email: user.email, password });

      toast({ status: "success", description: "Password registered successfully, sign in..." });
    } catch (err: any) {
      setSubmitting(false);
      toast({
        status: "error",
        description: err.response?.data?.message || err.message || "Sorry, an error happened",
      });
    }
  };

  return (
    <Center h="100vh">
      <Box p="8" borderWidth="1px" boxShadow="lg">
        <Heading textAlign="center" mb="2">
          Welcome {user.name}
        </Heading>

        <Text textAlign="center" mb="4">
          Please, create a password before you begin
        </Text>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <CustomInput
                name="password"
                label="Password"
                type="password"
                isRequired
                isDisabled={isSubmitting}
              />

              <CustomInput
                name="confirmPassword"
                label="Confirm password"
                type="password"
                isRequired
                isDisabled={isSubmitting}
                formControl={{ my: 4 }}
              />

              <Button
                type="submit"
                colorScheme="blue"
                w="full"
                variant="outline"
                isLoading={isSubmitting}
              >
                Register password
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </Center>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);

  if (session)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };

  await connectToMongo();

  const { confirmationCode } = ctx.query as { confirmationCode: string };

  const user = await UserModel.findOne({ confirmationCode, status: "Pending" })
    .select(["-_id", "name", "email"])
    .lean();

  if (!user)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };

  return { props: { user, confirmationCode } };
};

export default FirstAccess;
