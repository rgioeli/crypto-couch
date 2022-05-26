import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (session) {
    const response = await fetch(
      `http://api-${process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER}.pusher.com/apps/${process.env.PUSHER_APP_ID}/channels`,
      {
        method: "GET",
      }
    );

    console.log(response);
  }

  res.end();
}
