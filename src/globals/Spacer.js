import styled from "styled-components";

const SpacerTemplate = styled.div`
  ${(props) => `margin-${props.direction}: ${props.space}`}
`;

export const Spacer = ({ direction, space }) => {
  return <SpacerTemplate direction={direction} space={space} />;
};

export default Spacer;
