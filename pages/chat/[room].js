import { useEffect, useState, useContext } from "react";
import MenuContext from "../../src/globals/context/MenuContext";
import styled from "styled-components";
import ChatArea from "../../src/pages/chat/components/ChatArea";
import StatusBar from "../../src/pages/chat/components/StatusBar";
import { getSession } from "next-auth/react";
import Script from "next/script";
import Pusher from "pusher-js";
import { uppercase } from "../../src/pages/chat/functions/uppercase";

export default function Room({ user, symbol }) {
  const ctx = useContext(MenuContext);

  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [messages, setMessages] = useState([
    {
      user: `Welcome to the ${uppercase(symbol)} chat.`,
      message:
        "Please be respectful of other users. We're all in this together.",
    },
  ]);

  useEffect(() => {
    configPusher();
    console.log(process.env);
    console.log(process.env.NEXT_PUBLIC_PUSHER_APP_KEY);
  }, []);

  useEffect(() => {
    scriptLoaded &&
      new TradingView.widget({
        container_id: "chart",
        symbol,
        hide_side_toolbar: false,
        allow_symbol_change: true,
        theme: "dark",
        autosize: true,
        height: "100vh",
        interval: "1H",
      });
  }, [scriptLoaded]);

  const configPusher = async () => {
    const options = {
      cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
    };
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY, options);

    const channel = pusher.subscribe(`${symbol}`);

    channel.bind("chat-event", (message) => {
      console.log(message);
      setMessages((prevState) => [...prevState, message]);
    });
  };

  return (
    <>
      <HomeWrapper>
        {/* <NewsArea /> */}
        <Chart id="chart"></Chart>
        {ctx.toggleChat && (
          <ChatArea messages={messages} user={user && user} symbol={symbol} />
        )}
        <StatusBar />
        <Script
          onLoad={() => setScriptLoaded(true)}
          src="https://s3.tradingview.com/tv.js"
          type="text/javascript"
        ></Script>
        ;
      </HomeWrapper>
    </>
  );
}

export async function getServerSideProps({ req, params }) {
  const session = await getSession({ req });

  return {
    props: {
      symbol: params.room,
      user: session && session.user,
    },
  };
}

const HomeWrapper = styled.div`
  display: flex;
  height: calc(100vh - 75px);
  justify-content: center;
  max-width: 1920px;
  margin: auto;
  overflow: hidden;
  padding: 1rem;
`;

const Chart = styled.div`
  flex: 1;
`;
