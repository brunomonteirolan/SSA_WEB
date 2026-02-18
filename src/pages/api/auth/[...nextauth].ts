import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

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
  if (!credentials?.email || !credentials?.password) return null;

  try {
    console.log("🌍 NODE_ENV:", process.env.NODE_ENV);
    console.log("🗄️  MONGO_URL definida?", !!process.env.MONGO_URL);
    console.log("🔐 NEXTAUTH_SECRET definida?", !!process.env.NEXTAUTH_SECRET);
    console.log("📧 Email recebido:", credentials.email);

    await connectToMongo();

    const user = await UserModel.findOne({
      email: credentials.email,
      status: "Active", // ver observação abaixo
    }).select(["name", "email", "password", "status"]);

    console.log("🔍 User found:", user ? "YES" : "NO");
    if (user) console.log("📝 Status no banco:", user.status);

    if (!user) return null;

    console.log("🔐 Password from DB:", user.password.substring(0, 20) + "...");
    console.log("🔑 Password typed:", credentials.password);

    const isValid = bcrypt.compareSync(credentials.password, user.password);
    console.log("✅ Password valid:", isValid);

    return isValid
      ? { id: user._id.toString(), name: user.name, email: user.email }
      : null;
  } catch (err: any) {
    console.error("❌ Error in authorize:", err.message);
    console.error(err.stack);
    throw err; // deixa estourar pra aparecer na Vercel
  }
}
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async redirect({ url, baseUrl }) {
      return `${baseUrl}/`;
    },
  },
};

export default NextAuth(authOptions);
