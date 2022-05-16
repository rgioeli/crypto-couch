import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { MongoClient } from "mongodb";
import { signOut } from "next-auth/react";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    Credentials({
      name: "Crypto Couch",
      credentials: {
        username: {
          label: "Username",
          type: "email",
          placeholder: "johndoe@gmail.com",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials, req) {
        if (credentials.username == "matt@test.com") {
          return {
            id: 2,
            email: "matt@test.com",
            name: "matt",
          };
        }
        if (credentials.username == "admin@aol.com") {
          return {
            id: 1,
            email: "rgioeli@icloud.com",
            name: "rgioeli",
          };
        }
      },
    }),
    GoogleProvider({
      name: "Google",
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account }) {
      const client = await MongoClient.connect(
        "mongodb+srv://rgioeli:Plokijuhygtfrdeswa0!@cluster0.wwyx4.mongodb.net/crypto-couch?retryWrites=true&w=majority"
      );
      const db = client.db("crypto-couch");
      if (account.provider == "google") {
        db.collection("users").insertOne({
          username: user.email,
        });
      }

      return true;
    },
    async session({ session }) {
      if (session) {
        return session;
      }

      console.log("Okay????");
    },
  },
});
