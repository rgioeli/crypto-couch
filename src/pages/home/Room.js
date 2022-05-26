import { useRouter } from "next/router";
import styled from "styled-components";

const Room = ({ name, user_count }) => {
  const router = useRouter();

  const handleRoute = () => {
    router.replace(`/chat/${name}`);
  };

  return (
    <RoomsWrapper onClick={handleRoute}>
      <h2>{name}</h2>
      <p>{user_count && `Users in room: ${user_count}`}</p>
    </RoomsWrapper>
  );
};

const RoomsWrapper = styled.div`
  background-color: #45dd8a;
  margin-right: 1rem;
  margin-top: 1rem;
  border-radius: 15px;
  padding: 1rem;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: 0.1s;
  &:hover {
    transform: scale(1.025);
  }
  p {
    font-size: 1.2rem;
  }
`;

export default Room;
