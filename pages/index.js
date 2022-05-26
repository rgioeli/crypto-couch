import { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import Pusher from "pusher-js";
import ServerPusher from "pusher";
import Room from "../src/pages/home/Room";
import Spacer from "../src/globals/Spacer";

export default function Home({ rooms }) {
  const [allRooms] = useState([
    { name: "BTCUSD" },
    { name: "ETHUSD" },
    { name: "DOGEUSD" },
    { name: "APEUSD" },
    { name: "SHIBUSD" },
    { name: "XRPUSD" },
    { name: "BUSD" },
    { name: "SOLUSD" },
    { name: "DOTUSD" },
    { name: "ADAUSD" },
  ]);
  useEffect(() => {}, []);
  return (
    <HomeWrapper>
      <Spacer direction="top" space="0.25rem" />
      <h3>Chat Rooms</h3>
      <Spacer direction="top" space="1rem" />
      <ActiveRoomsWrapper>
        <p>Active Rooms</p>
        {rooms.length ? (
          rooms.map(({ name, user_count }) => {
            return <Room key={name} name={name} user_count={user_count} />;
          })
        ) : (
          <NoActiveRooms>There are currently no active rooms.</NoActiveRooms>
        )}
      </ActiveRoomsWrapper>
      <Spacer direction="top" space="1rem" />
      <RoomsWrapper>
        <p>Popular Rooms</p>
        <section>
          {allRooms &&
            allRooms.map(({ name, user_count }) => {
              return <Room name={name} user_count={user_count} />;
            })}
        </section>
      </RoomsWrapper>
    </HomeWrapper>
  );
}

const HomeWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-flow: column wrap;
  color: white;
  padding: 1rem;
  max-width: 1024px;
  margin: auto;
`;

const ActiveRoomsWrapper = styled.div`
  border: 2px solid #fff;
  padding: 1rem;
`;

const RoomsWrapper = styled.div`
  display: flex;
  flex-flow: column;
  padding: 1rem;

  section {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
  }
`;
const NoActiveRooms = styled.p`
  font-style: italic;
`;

//GET SERVER SIDE PROPS
export async function getServerSideProps(ctx) {
  const session = await getSession({ req: ctx.req });

  //if a session is in order, and the user doesn't have the properties they need, send them to update them
  if (
    session &&
    !session?.user?.name?.username &&
    !session?.user?.name?.handle
  ) {
    return {
      redirect: {
        destination: "/update-profile",
      },
    };
  } else {
    const pusher = new ServerPusher({
      appId: process.env.PUSHER_APP_ID,
      key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
      secret: process.env.PUSHER_APP_SECRET,
      cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
      useTLS: true,
    });
    const res = await pusher.get({
      path: "/channels",
      params: {
        filter_by_prefix: "presence-",
        info: "user_count",
      },
    });
    if (res.status == 200) {
      const data = await res.json();
      //create empty room data array to put how many users are in each channel
      let rooms = [];
      for (const key in data.channels) {
        const pos = key.indexOf("-");
        rooms.push({
          name: key.substring(pos + 1, key.length),
          user_count: data.channels[key].user_count,
        });
      }
      return {
        props: {
          rooms,
        },
      };
    }
  }

  return {
    props: {},
  };
}
