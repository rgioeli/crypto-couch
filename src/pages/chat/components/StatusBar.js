import { useRouter } from "next/router";
import { useContext, useState } from "react";
import styled from "styled-components";
import MenuContext from "../../../globals/context/MenuContext";
import { BsChatLeftDots, BsNewspaper, BsFillPeopleFill } from "react-icons/bs";
import StatusBarIcon from "./StatusBarIcon";

const StatusBar = () => {
  const router = useRouter();
  const { room } = router.query;
  const [clickIcon, setClickIcon] = useState("");
  const ctx = useContext(MenuContext);

  return (
    <StatusBarWrapper>
      <StatusBarIcon
        onClick={() => {
          ctx.toggleChatDiv();
          setClickIcon("Chat");
        }}
        iconName={"Chat"}
        id={clickIcon}
      >
        <BsChatLeftDots />
      </StatusBarIcon>
      <StatusBarIcon
        onClick={() => {
          ctx.toggleRoomsDiv();
          setClickIcon("Rooms");
        }}
        iconName={"Rooms"}
        id={clickIcon}
      >
        <BsNewspaper />
      </StatusBarIcon>
      <StatusBarIcon
        onClick={() => {
          ctx.toggleNewsDiv();
          setClickIcon("News");
        }}
        iconName={"News"}
        id={clickIcon}
      >
        <BsFillPeopleFill />
      </StatusBarIcon>
    </StatusBarWrapper>
  );
};

const StatusBarWrapper = styled.div`
  display: flex;
  flex-flow: column;
  width: 100px;
  background-color: #131722;
`;
export default StatusBar;
