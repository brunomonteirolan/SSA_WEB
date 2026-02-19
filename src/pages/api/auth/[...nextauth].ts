import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcryptjs from "bcryptjs"; // IMPORTANTE: bcryptjs, não bcrypt

import UserModel from "../../../models/user";
import connectToMongo from "../../../utils/mongoose";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Validação básica
        if (!credentials?.email || !credentials?.password) {
          console.log("❌ [NextAuth] Missing credentials");
          return null;
        }

        try {
          // Conectar ao MongoDB
          await connectToMongo();
          console.log("✅ [NextAuth] MongoDB connected");

          // Buscar usuário - IMPORTANTE: +password para forçar inclusão
          const user = await UserModel.findOne({
            email: credentials.email.toLowerCase().trim(),
            status: "Active",
          }).select("+password");

          console.log("🔍 [NextAuth] User search:", {
            email: credentials.email,
            found: !!user,
          });

          if (!user) {
            console.log("❌ [NextAuth] User not found or inactive");
            return null;
          }

          // Validar senha - IMPORTANTE: usar compare (async), não compareSync
          const isValid = await bcryptjs.compare(
            credentials.password,
            user.password
          );

          console.log("🔐 [NextAuth] Password validation:", isValid);

          if (!isValid) {
            console.log("❌ [NextAuth] Invalid password");
            return null;
          }

          console.log("✅ [NextAuth] Login successful for:", user.email);

          // Retornar usuário autenticado
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
          };
        } catch (error) {
          console.error("❌ [NextAuth] Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
    error: "/",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Após login, redirecionar para home
      if (url.startsWith(baseUrl)) return url;
      return baseUrl + "/";
    },
  },
  // Ativar debug em desenvolvimento
  debug: process.env.NODE_ENV === "development",
};

export default NextAuth(authOptions);
