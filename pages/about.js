import { useEffect } from "react";
import Pusher from "pusher-js";
import { useRouter } from "next/router";

const About = () => {
  const router = useRouter();
  useEffect(() => {
    const options = {
      cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
    };
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY, options);

    console.log(pusher);
  }, []);
  return <div onClick={() => router.push("/api/auth/signin")}>Click here!</div>;
};

export default About;
