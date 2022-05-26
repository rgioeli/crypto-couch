import { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import { getSession } from "next-auth/react";
import ServerPusher from "pusher";
import Room from "../src/pages/home/Room";
import Spacer from "../src/globals/Spacer";
import { v4 } from "uuid";

export default function Home({ rooms }) {
  const [allRooms] = useState([
    { name: "btcusd", id: 1 },
    { name: "ethusd", id: 2 },
    { name: "dogeusd", id: 3 },
    { name: "apeusd", id: 4 },
    { name: "shibusd", id: 5 },
    { name: "xrpusd", id: 6 },
    { name: "bnbusd", id: 7 },
    { name: "solusd", id: 8 },
    { name: "dotusd", id: 9 },
    { name: "adausd", id: 10 },
  ]);
  return (
    <HomeWrapper>
      <Spacer direction="top" space="0.25rem" />
      <h3>Chat Rooms</h3>
      <Spacer direction="top" space="1rem" />
      <ActiveRoomsWrapper>
        <p>Active Rooms</p>
        {rooms.length > 0 ? (
          rooms.map(({ name, id, user_count }) => {
            return <Room key={id} name={name} user_count={user_count} />;
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
            allRooms.map(({ name, id }) => {
              return <Room key={id} name={name} />;
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
          id: v4(),
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
