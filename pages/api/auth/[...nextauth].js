import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { mongoConnect } from "../../../src/lib/mongodbConnect";

export default NextAuth({
  // Configure one or more authentication providers
  // adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      name: "Google",
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    signIn: async ({ user }) => {
      console.log("When does this run?");
      const client = await mongoConnect();
      const foundUser = await client
        .db()
        .collection("users")
        .findOne({ email: user.email });
      if (!foundUser)
        await client.db().collection("users").insertOne({ email: user.email });
      return user;
    },
    session: async ({ session, token, user }) => {
      const client = await mongoConnect();
      const foundUser = await client
        .db()
        .collection("users")
        .findOne({ email: session.user.email });

      session.user = {
        ...foundUser,
      };

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  theme: {
    logo: "/images/logo.png",
    colorScheme: "dark",
    brandColor: "#45dd8a",
  },
});
