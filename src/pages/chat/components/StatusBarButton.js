import styled from "styled-components";
import { uppercase } from "../functions/uppercase";

const StatusBarButton = ({ text, onClick }) => {
  return (
    <StatusBarButtonWrapper onClick={onClick}>
      {uppercase(text)}
    </StatusBarButtonWrapper>
  );
};

const StatusBarButtonWrapper = styled.div`
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

export default StatusBarButton;
