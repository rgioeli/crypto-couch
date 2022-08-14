import { useEffect, useState } from "react";
import styled from "styled-components";
import Room from "../../../../pages/chat/[room]";

const RoomsArea = () => {
  //STATE
  const [rooms, setRooms] = useState([]);
  // default room data
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

  useEffect(() => {
    handleGetRoomsData();
  }, []);

  const handleGetRoomsData = async () => {
    try {
      const response = await fetch("/api/pusher/get-rooms", { method: "GET" });
      const { rooms } = await response.json();
      setRooms(rooms);
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <RoomsAreaWrapper>
      {<p>{JSON.stringify(rooms, null, 2)}</p>}
      {/* <ActiveRoomsWrapper>
        <p>Active Rooms</p>
        {rooms.length > 0 ? (
          rooms.map(({ name, id, user_count }) => {
            return <Room key={id} name={name} user_count={user_count} />;
          })
        ) : (
          <NoActiveRooms>There are currently no active rooms.</NoActiveRooms>
        )}
      </ActiveRoomsWrapper> */}
    </RoomsAreaWrapper>
  );
};

const RoomsAreaWrapper = styled.div`
  flex: 1;
  max-width: 300px;
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

export default RoomsArea;
