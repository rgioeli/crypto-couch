import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { MongoClient } from "mongodb";
import { signOut } from "next-auth/react";
import bcryptjs from "bcryptjs";
import nodemailer from "nodemailer";
import EmailProvider from "next-auth/providers/email";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../src/lib/mongodb";

export default NextAuth({
  // Configure one or more authentication providers
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    EmailProvider({
      server:
        "smtp://crypto-couch@outlook.com:Plokijuhyg0!@smtp.office365.com:587",
      from: "crypto-couch@outlook.com",
    }),
    GoogleProvider({
      name: "Google",
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  theme: {
    logo: "/images/logo.png",
    colorScheme: "dark",
    brandColor: "#45dd8a",
  },
});
