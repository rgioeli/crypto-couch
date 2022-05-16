import { useEffect } from "react";
import Pusher from "pusher-js";

const About = () => {
  useEffect(() => {
    const options = {
      cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
    };
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY, options);

    console.log(pusher);
  }, []);
  return <div>Enter</div>;
};

export default About;
