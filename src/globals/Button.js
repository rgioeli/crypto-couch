import { useRouter } from "next/router";
import styled from "styled-components";

const Button = ({ text = "Button", href = "https://google.com" }) => {
  const router = useRouter();
  return (
    <ButtonWrapper onClick={() => router.push(href)}>{text}</ButtonWrapper>
  );
};

const ButtonWrapper = styled.div`
  padding: 1rem;
  border-radius: 0.25rem;
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

export default Button;
