import styled from "styled-components";
import ChatBox from "./ChatBox";
import { uppercase } from "../functions/uppercase";
import { useEffect, useState, useRef } from "react";

const ChatArea = ({ messages, symbol = "DOGEUSD", user }) => {
  const [mouseDown, setMouseDown] = useState(false);
  //ref
  const messageContainerRef = useRef();

  useEffect(() => {
    messageContainerRef.current.scrollIntoView();
  }, [messages]);

  return (
    <ChatWrapper>
      <ChatTitle>{uppercase(symbol)}</ChatTitle>
      <MiddleContent
        onMouseDown={() => setMouseDown(true)}
        onMouseUp={() => setMouseDown(false)}
      >
        {messages.map((message, index) => {
          return (
            <MessageContainer
              key={index}
              user={user}
              message={message}
              ref={messageContainerRef}
            >
              <h3>{message.user}</h3>
              <p>{message.message}</p>
            </MessageContainer>
          );
        })}
      </MiddleContent>
      <ChatBox user={user} />
    </ChatWrapper>
  );
};

const ChatWrapper = styled.div`
  height: calc(100vh - 75px - 2rem);
  flex-flow: column;
  flex: 1;
  min-width: 300px;
  max-width: 350px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const MessageContainer = styled.div`
  border-top: 1px solid silver;
  padding: 1rem 0;
  background-color: ${(props) =>
    props.message.user === props.user.name && "#1b2030"};
  padding: 0 1rem;
`;

const ChatTitle = styled.div`
  font-size: 1.5rem;
  padding: 1rem;
  color: #fff;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid white;
`;

const MiddleContent = styled.div`
  color: #fff;
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  overflow-y: auto;
  scroll-behavior: none;
`;

export default ChatArea;
