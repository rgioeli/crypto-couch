import styled from "styled-components";
import Button from "./Button";
import { useSession } from "next-auth/react";

const Navigation = () => {
  const session = useSession();

  return (
    <NavigationWrapper>
      <p>Crypto Couch</p>
      {session.status !== "authenticated" ? (
        <Button text={"Login to Crypto Couch"} href={"/api/auth/signin"} />
      ) : (
        <Button text={"Logout"} href={"/api/auth/signout"} />
      )}
    </NavigationWrapper>
  );
};

const NavigationWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: auto;
  flex: 1;
  max-width: 1920px;
  height: 75px;
  padding: 1rem;

  p {
    font-weight: bold;
    color: #fff;
  }
`;

export default Navigation;
