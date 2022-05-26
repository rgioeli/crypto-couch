import { useRouter } from "next/router";
import styled from "styled-components";
import { Bars } from "react-loader-spinner";

const Button = ({
  text = "Button",
  href = null,
  type,
  width,
  disabled,
  loading = false,
}) => {
  const router = useRouter();
  const handleClick = () => {
    if (href) {
      router.push(href);
    }
  };
  return (
    <ButtonWrapper
      disabled={disabled}
      width={width}
      type={type}
      onClick={handleClick}
    >
      {loading ? <Bars width={"2rem"} height={"2rem"} color={"#fff"} /> : text}
    </ButtonWrapper>
  );
};

const ButtonWrapper = styled.button`
  padding: 1rem;
  border-radius: 0.25rem;
  background-color: ${(props) => (props.disabled ? "#555" : "#45dd8a")};
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  box-shadow: 1px 1px 2.5px 1px #333;
  font-weight: 700;
  width: ${(props) => props.width && `${props.width}%`};
  border: none;

  &:hover {
    cursor: pointer;
  }
`;

export default Button;
