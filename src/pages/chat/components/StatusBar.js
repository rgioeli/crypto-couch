import { useRouter } from "next/router";
import { useContext } from "react";
import styled from "styled-components";
import MenuContext from "../../../globals/context/MenuContext";
import { BsChatLeftDots, BsNewspaper } from "react-icons/bs";
import StatusBarIcon from "./StatusBarIcon";

const StatusBar = () => {
  const router = useRouter();
  const { room } = router.query;
  const ctx = useContext(MenuContext);

  return (
    <StatusBarWrapper>
      <StatusBarIcon onClick={ctx.toggleChatDiv} iconName={"Chat"}>
        <BsChatLeftDots />
      </StatusBarIcon>
      <StatusBarIcon onClick={ctx.toggleChatDiv} iconName={"News"}>
        <BsNewspaper />
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
