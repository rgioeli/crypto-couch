import styled from "styled-components";

const StatusBarIcon = ({ children, onClick, iconName }) => {
  return (
    <StatusBarIconWrapper onClick={onClick}>
      {children}
      <p>{iconName}</p>
    </StatusBarIconWrapper>
  );
};

const StatusBarIconWrapper = styled.div`
  color: #fff;
  font-size: 3rem;
  display: flex;
  flex-flow: column;
  padding: 1rem;
  justify-content: center;
  align-items: center;
  border: 2px solid white;
  &:hover {
    cursor: pointer;
  }

  p {
    margin: 0;
    padding: 0;
    font-size: 1rem;
  }
`;

export default StatusBarIcon;
