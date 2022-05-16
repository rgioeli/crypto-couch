import styled from "styled-components";
import TextareaAutosize from "react-textarea-autosize";
import { useState, useEffect, useRef } from "react";
import Button from "../../../globals/Button";
import { io } from "socket.io-client";

const ChatBox = ({ user }) => {
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const submitMessage = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/chat-pusher", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      });
    } catch (error) {
      console.error(error);
    }

    setMessage("");
  };

  return (
    <ChatBoxWrapper>
      {user ? (
        <form onSubmit={submitMessage}>
          <p>Logged in as {user.name} </p>
          <Textarea
            placeholder="Type something.."
            minRows={2}
            onKeyDown={(e) => e.code === "Enter" && submitMessage(e)}
            onChange={handleChange}
            value={message}
          />
          <SendMessage type="submit" value="Send" />
        </form>
      ) : (
        <ButtonWrapper>
          <Button href={"/api/auth/signin"} text={"Login to join the chat"} />
        </ButtonWrapper>
      )}
    </ChatBoxWrapper>
  );
};

const ChatBoxWrapper = styled.div`
  color: #fff;
  width: 100%;
  display: flex;
  flex-flow: column;
  align-items: flex-end;
  justify-content: flex-end;

  form {
    width: 100%;

    p {
      padding-left: 0.5rem;
    }
  }
`;

const ButtonWrapper = styled.div`
  width: 100%;
`;

const SendMessage = styled.input`
  padding: 1rem;
  width: 100%;
  background-color: #45dd8a;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  box-shadow: 1px 1px 2.5px 1px #333;
  font-weight: 700;
  &:hover {
    cursor: pointer;
  }
`;

const Textarea = styled(TextareaAutosize)`
  resize: none;
  width: 100%;
  padding: 0.5rem;
  outline: none;
  font-size: 1rem;
  background-color: #131722;
  color: #fff;
`;

export default ChatBox;
