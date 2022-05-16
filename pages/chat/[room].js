import { useEffect, useState, useContext } from "react";
import MenuContext from "../../src/globals/context/MenuContext";
import styled from "styled-components";
import ChatArea from "../../src/pages/chat/components/ChatArea";
import StatusBar from "../../src/pages/chat/components/StatusBar";
import { getSession } from "next-auth/react";
import { MongoClient } from "mongodb";
import Script from "next/script";

export default function Room({ user, messages, symbol }) {
  const ctx = useContext(MenuContext);

  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    connectSocket();
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

  const connectSocket = async () => {
    await fetch(`https://crypto-couch.vercel.app/api/socket`);
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
  const client = await MongoClient.connect(process.env.MONGO_SERVER);
  const db = client.db();
  const messages = JSON.stringify(
    await db.collection("messages").find({}).toArray()
  );

  const session = await getSession({ req });

  return {
    props: {
      symbol: params.room,
      user: session && session.user,
      messages,
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
