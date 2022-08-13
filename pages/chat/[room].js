import { useEffect, useState, useContext, useRef } from "react";
import MenuContext from "../../src/globals/context/MenuContext";
import styled from "styled-components";
import ChatArea from "../../src/pages/chat/components/ChatArea";
import StatusBar from "../../src/pages/chat/components/StatusBar";
import { getSession } from "next-auth/react";
import Script from "next/script";
import Pusher from "pusher-js";
import { uppercase } from "../../src/pages/chat/functions/uppercase";
import { useRouter } from "next/router";

export default function Room({ user, symbol }) {
  //globals
  const MESSAGES_LENGTH_MAXIMUM = 50;
  //context
  const menuContext = useContext(MenuContext);
  //state
  const [loadScript, setLoadScript] = useState(false);
  const [messages, setMessages] = useState([
    {
      user: `Welcome to the ${uppercase(symbol)} chat.`,
      message:
        "Please be respectful to each other within the community. We're all in this together.",
      image: "/images/default-chat-image.jpg",
    },
  ]);

  useEffect(() => {
    configPusher();
    checkForScriptId();
    console.log(user);
  }, []);

  useEffect(() => {
    if (loadScript) {
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

      //when the script first gets loaded we need to set the id on the script so we can check for it in case
      //the user gets "go back" on the browser and then comes back
      // if we don't set this ID, the browser will never know the script has already loaded after the 1st time it is loaded
      if (!document.getElementById("trading-view")) {
        const scriptsArray = Array.from(
          document.getElementsByTagName("script")
        );
        scriptsArray.map((script) => {
          if (
            script.getAttribute("src") == "https://s3.tradingview.com/tv.js"
          ) {
            script.setAttribute("id", "trading-view");
          }
        });
      }
    }
  }, [loadScript]);

  const checkForScriptId = () => {
    if (document.getElementById("trading-view")) {
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
    }
  };

  useEffect(() => {
    if (messages.length > MESSAGES_LENGTH_MAXIMUM) {
      setMessages((prevState) => {
        const message = prevState[0];
        return prevState.filter((msg) => msg !== message);
      });
    }
  }, [messages]);

  const configPusher = async () => {
    const options = {
      cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
      channelAuthorization: {
        endpoint: "/api/pusher/channel-auth",
      },
      userAuthentication: {
        endpoint: "/api/pusher/user-auth",
      },
    };

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY, options);

    pusher.connection.bind("state_change", (data) => {
      if (data.current === "connected") {
        pusher.signin();

        const channel = pusher.subscribe(`presence-${symbol}`);

        if (channel.bind("chat-event")) {
          channel.unbind("chat-event");
        }

        channel.bind("chat-event", (message) => {
          setMessages((prevState) => [...prevState, message]);
        });
      }
    });
  };

  return (
    <>
      <HomeWrapper>
        {/* <NewsArea /> */}
        <Chart id="chart"></Chart>
        {menuContext.toggleChat && (
          <ChatArea messages={messages} user={user && user} symbol={symbol} />
        )}
        {menuContext.toggleNews && <div>Toggle News</div>}
        {menuContext.toggleRooms && <div>Toggle Rooms</div>}
        <StatusBar />
        <Script
          src="https://s3.tradingview.com/tv.js"
          onLoad={() => setLoadScript(true)}
        />
      </HomeWrapper>
    </>
  );
}

export async function getServerSideProps({ req, params }) {
  const session = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        destination: "api/auth/signin",
        permanent: false,
      },
    };
  }

  return {
    props: {
      symbol: params.room,
      user: session && session.user,
    },
  };
}

const HomeWrapper = styled.div`
  display: flex;
  height: calc(100vh - 100px);
  justify-content: center;
  max-width: 1920px;
  margin: auto;
  overflow: hidden;
  padding: 1rem;
`;

const Chart = styled.div`
  flex: 1;
`;
