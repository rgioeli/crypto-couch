import styled from "styled-components";
import { useContext } from "react";
import MenuContext from "../../../globals/context/MenuContext";

const StatusBarIcon = ({ children, onClick, iconName, id }) => {
  //context
  const ctx = useContext(MenuContext);

  return (
    <StatusBarIconWrapper
      onClick={onClick}
      ctx={ctx}
      iconName={iconName}
      id={id}
    >
      {children}
      <p>{iconName}</p>
    </StatusBarIconWrapper>
  );
};

const StatusBarIconWrapper = styled.div`
  color: #fff;
  font-size: 2rem;
  display: flex;
  flex-flow: column;
  padding: 1rem;
  justify-content: center;
  align-items: center;
  border: 2px solid white;
  background-color: ${(props) => props.iconName == props.id && "#45dd8a"};
  &:hover {
    cursor: pointer;
    background-color: #45dd8a;
    color: #fff;
  }

  p {
    margin: 0;
    padding: 0;
    font-size: 0.85rem;
  }
`;

export default StatusBarIcon;
