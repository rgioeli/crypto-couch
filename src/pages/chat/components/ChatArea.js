import styled from "styled-components";
import ChatBox from "./ChatBox";
import { uppercase } from "../functions/uppercase";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { v4 } from "uuid";

const ChatArea = ({ messages, symbol = "DOGEUSD", user }) => {
  //state
  const [replyMessage, setReplyMessage] = useState(null);
  const [autoScrolled, setAutoScrolled] = useState(true);

  //ref
  const messageContainerRef = useRef();
  const middleContentRef = useRef();

  //useEffect
  useEffect(() => {
    if (autoScrolled) {
      messageContainerRef.current.scrollIntoView();
    }
  }, [messages]);

  const handleReply = (message) => {
    const id = v4();
    setReplyMessage({ ...message, replyId: id });
  };

  const handleScrollFunctionality = (e) => {
    const heightOfScroll = e.target.scrollHeight - e.target.offsetHeight;
    if (e.target.scrollTop > heightOfScroll - 20) {
      setAutoScrolled(true);
    } else {
      setAutoScrolled(false);
    }
  };

  return (
    <ChatWrapper ref={middleContentRef}>
      <ChatTitle>{uppercase(symbol)}</ChatTitle>
      <MiddleContent onScroll={handleScrollFunctionality}>
        {messages.map((message, index) => {
          return (
            <MessageContainer
              key={index}
              user={user}
              message={message}
              ref={messageContainerRef}
            >
              <MessageHeader>
                <div>
                  <h3>{message.user}</h3>
                  {/* <p>{message.handle}</p> */}
                </div>
                <MessageImageWrapper>
                  <Image
                    src={message.image && message.image}
                    width={50}
                    height={50}
                    objectFit={"contain"}
                    style={{ borderRadius: "100%" }}
                  />
                </MessageImageWrapper>
              </MessageHeader>
              {message.replyTo &&
                message.replyTo.username &&
                message.replyTo.message && (
                  <ReplyMessage>
                    <h5>{message.replyTo.username}</h5>
                    <p>{message.replyTo.message}</p>
                  </ReplyMessage>
                )}
              <MessageText>{message.message}</MessageText>
              {message.type !== "display" && (
                <MessageFooter>
                  <p onClick={() => handleReply(message)}>reply</p>
                </MessageFooter>
              )}
            </MessageContainer>
          );
        })}
      </MiddleContent>
      <ChatBox
        setReplyMessage={setReplyMessage}
        replyMessage={replyMessage}
        user={user}
      />
    </ChatWrapper>
  );
};

const MessageText = styled.p`
  font-size: 0.9rem;
`;

const ChatWrapper = styled.div`
  height: calc(100vh - 100px - 1rem);
  flex-flow: column;
  min-width: 300px;
  max-width: 350px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const MessageImageWrapper = styled.div`
  height: 40px;
  width: 40px;
`;

const MessageContainer = styled.div`
  border-top: 1px solid silver;
  background-color: ${(props) =>
    props.message?.handle === props.user?.name?.handle
      ? "#1b2030"
      : props.message.replyTo &&
        props.message.replyTo.username === props.user.name.username &&
        "#404c72"};
  display: flex;
  flex-flow: column;
  overflow-wrap: break-word;
  width: 100%;
  padding: 1rem;
  p {
    margin: 0;
  }
`;

const MessageHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  flex-flow: row-reverse;
  justify-content: space-between;
  div {
    display: flex;
    flex-flow: column;
    align-items: center;
    justify-content: flex-end;
  }
  h3 {
    font-size: 0.85rem;
    margin: 0;
  }
  p {
    font-size: 0.75rem;
  }
`;

const ReplyMessage = styled.div`
  background-color: #2e3652;
  border-radius: 5px;
  padding: 0.5rem;
  margin-bottom: 0.5rem;

  h5 {
    color: #fff;
    font-size: 0.75rem;
  }

  p {
    color: #fff;
    font-size: 0.85rem;
  }
`;

const MessageFooter = styled.div`
  font-weight: bold;
  font-size: 0.9rem;

  p {
    padding: 0.5rem 0;
    font-size: 0.75rem;
    &:hover {
      cursor: pointer;
    }
  }
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
  min-width: 350px;
  height: 100%;
  display: flex;
  flex-flow: column;
  overflow-y: auto;
  scroll-behavior: none;
  position: relative;
`;

export default ChatArea;
