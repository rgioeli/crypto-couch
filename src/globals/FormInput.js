import styled from "styled-components";
import Spacer from "./Spacer";
import { useEffect } from "react";

const FormInput = ({
  type,
  value,
  placeholder,
  onChange,
  name,
  label = "Email",
  required,
  maxLength,
  minLength,
  limit,
  limiter = true,
  onBlur,
  highlightBox,
}) => {
  return (
    <>
      <FormHeading>
        {label && <label htmlFor={name}>{label}</label>}
        <Spacer direction={"left"} space={"1rem"} />
        {limiter && (
          <Limit>
            Limit:{" "}
            <CharsLeft maxLength={maxLength} limit={limit}>
              {limit}
            </CharsLeft>
            /{maxLength}
          </Limit>
        )}
      </FormHeading>
      <CustomFormInput
        highlightBox={highlightBox}
        id={name}
        value={value}
        placeholder={placeholder}
        type={type}
        onChange={onChange}
        name={name}
        required={required}
        maxLength={maxLength}
        minLength={minLength}
        onBlur={onBlur}
      />
    </>
  );
};

const FormHeading = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const CustomFormInput = styled.input`
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
  border-radius: 0.25rem;
  border: ${(props) => (props.highlightBox ? "3px solid #45dd8a" : null)};
`;

const Limit = styled.p`
  font-size: 0.75rem;
`;

const CharsLeft = styled.span`
  color: ${(props) =>
    props.limit && props.maxLength && props.limit == props.maxLength && "red"};
`;

export default FormInput;
