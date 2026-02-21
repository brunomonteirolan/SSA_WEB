import React from "react";
import * as yup from "yup";
import { Form, Formik, FormikHelpers } from "formik";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth/next";
import { signIn } from "next-auth/react";
import axios from "axios";

import { authOptions } from "../api/auth/[...nextauth]";
import UserModel from "../../models/user";
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
    .oneOf([yup.ref("password")], "As senhas devem ser iguais")
    .required(),
});

const FirstAccess: React.FC<Props> = ({ user, confirmationCode }) => {
  const [toastMsg, setToastMsg] = React.useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (
    { password }: typeof initialValues,
    { setSubmitting }: FormikHelpers<typeof initialValues>
  ) => {
    try {
      await axios.post(`/api/auth/signup/${confirmationCode}`, { password });
      setToastMsg({ type: "success", text: "Senha cadastrada com sucesso! Entrando..." });
      signIn("credentials", { email: user.email, password });
    } catch (err: any) {
      setSubmitting(false);
      setToastMsg({
        type: "error",
        text: err.response?.data?.message || err.message || "Ocorreu um erro inesperado",
      });
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#0A0A0A",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      padding: "24px",
    }}>
      {/* Grid overlay */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        backgroundImage: "linear-gradient(rgba(227,0,27,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(227,0,27,0.04) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
        pointerEvents: "none",
      }} />

      {/* Red glow */}
      <div style={{
        position: "fixed", top: "-120px", left: "50%", transform: "translateX(-50%)",
        width: "600px", height: "300px", zIndex: 0,
        background: "radial-gradient(ellipse at center, rgba(227,0,27,0.12) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{
        position: "relative", zIndex: 1,
        width: "100%", maxWidth: "440px",
        background: "rgba(20,20,20,0.92)",
        border: "1px solid rgba(227,0,27,0.2)",
        borderRadius: "16px",
        padding: "40px",
        backdropFilter: "blur(12px)",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" }}>
          <div style={{
            width: "40px", height: "40px", borderRadius: "8px",
            backgroundColor: "#E3001B", display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 900, fontSize: "20px", color: "white", letterSpacing: "-1px",
          }}>S</div>
          <div>
            <div style={{ fontSize: "16px", fontWeight: 700, color: "white", letterSpacing: "3px" }}>SACOA</div>
            <div style={{ fontSize: "9px", color: "#E3001B", letterSpacing: "2px", fontWeight: 600 }}>CASHLESS SYSTEM</div>
          </div>
        </div>

        <h1 style={{ fontSize: "22px", fontWeight: 700, color: "white", margin: "0 0 4px 0" }}>
          Bem-vindo, {user.name}
        </h1>
        <p style={{ fontSize: "14px", color: "#888", margin: "0 0 28px 0" }}>
          Crie sua senha para acessar o sistema
        </p>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, values, errors, touched, handleChange, handleBlur }) => (
            <Form>
              {/* Password field */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "13px", color: "#AAA", marginBottom: "6px", fontWeight: 500 }}>
                  Senha <span style={{ color: "#E3001B" }}>*</span>
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type="password"
                    name="password"
                    placeholder="Mínimo 8 caracteres"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={isSubmitting}
                    style={{
                      width: "100%", boxSizing: "border-box",
                      background: "#1A1A1A",
                      border: `1px solid ${touched.password && errors.password ? "#E3001B" : "#2D2D2D"}`,
                      borderRadius: "8px", padding: "11px 16px",
                      color: "white", fontSize: "14px", outline: "none",
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "#E3001B"; }}
                    onBlur={(e) => { if (!errors.password) e.currentTarget.style.borderColor = "#2D2D2D"; handleBlur(e); }}
                  />
                </div>
                {touched.password && errors.password && (
                  <p style={{ color: "#E3001B", fontSize: "12px", marginTop: "4px" }}>{errors.password}</p>
                )}
              </div>

              {/* Confirm Password field */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "13px", color: "#AAA", marginBottom: "6px", fontWeight: 500 }}>
                  Confirmar senha <span style={{ color: "#E3001B" }}>*</span>
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Repita a senha"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isSubmitting}
                  style={{
                    width: "100%", boxSizing: "border-box",
                    background: "#1A1A1A",
                    border: `1px solid ${touched.confirmPassword && errors.confirmPassword ? "#E3001B" : "#2D2D2D"}`,
                    borderRadius: "8px", padding: "11px 16px",
                    color: "white", fontSize: "14px", outline: "none",
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "#E3001B"; }}
                />
                {touched.confirmPassword && errors.confirmPassword && (
                  <p style={{ color: "#E3001B", fontSize: "12px", marginTop: "4px" }}>{errors.confirmPassword}</p>
                )}
              </div>

              {/* Toast message */}
              {toastMsg && (
                <div style={{
                  padding: "10px 14px", borderRadius: "8px", marginBottom: "16px", fontSize: "13px",
                  background: toastMsg.type === "success" ? "rgba(0,200,100,0.1)" : "rgba(227,0,27,0.1)",
                  border: `1px solid ${toastMsg.type === "success" ? "rgba(0,200,100,0.3)" : "rgba(227,0,27,0.3)"}`,
                  color: toastMsg.type === "success" ? "#4ade80" : "#ff6b6b",
                }}>
                  {toastMsg.text}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: "100%", padding: "12px",
                  background: isSubmitting ? "#991115" : "#E3001B",
                  border: "none", borderRadius: "8px",
                  color: "white", fontSize: "15px", fontWeight: 700,
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  transition: "background 0.2s",
                  letterSpacing: "0.5px",
                }}
                onMouseEnter={(e) => { if (!isSubmitting) e.currentTarget.style.background = "#cc0018"; }}
                onMouseLeave={(e) => { if (!isSubmitting) e.currentTarget.style.background = "#E3001B"; }}
              >
                {isSubmitting ? "Cadastrando..." : "Cadastrar Senha"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);

  if (session)
    return { redirect: { destination: "/", permanent: false } };

  await connectToMongo();

  const { confirmationCode } = ctx.query as { confirmationCode: string };

  const user = await UserModel.findOne({ confirmationCode, status: "Pending" })
    .select(["-_id", "name", "email"])
    .lean();

  if (!user)
    return { redirect: { destination: "/", permanent: false } };

  return { props: { user, confirmationCode } };
};

export default FirstAccess;
