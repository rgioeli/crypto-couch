import styled from "styled-components";
import Button from "./Button";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Spacer from "./Spacer";
import { useRouter } from "next/router";

const Navigation = () => {
  //get session
  const session = useSession();
  //router
  const router = useRouter();

  return (
    <NavigationWrapper>
      <ImageWrapper>
        <Image
          src="/images/couch.png"
          objectFit="contain"
          height={25}
          width={100}
        />
        <p>Crypto Couch</p>
      </ImageWrapper>
      {session.status == "unauthenticated" ? (
        <Button text={"Login to Crypto Couch"} href={"/api/auth/signin"} />
      ) : (
        session.data && (
          <UserNav onClick={() => router.push("/api/auth/signout")}>
            <header>
              <Spacer direction={"left"} space={"0.5rem"} />
              <p>{session.data.user.name.handle}</p>
            </header>
            <Spacer direction={"left"} space={"0.5rem"} />
            <UserImageWrapper>
              <Image
                style={{ borderRadius: "100%" }}
                src={session.data.user.image}
                objectFit="cover"
                height={100}
                width={100}
              />
            </UserImageWrapper>
          </UserNav>
        )
      )}
    </NavigationWrapper>
  );
};

const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const NavigationWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: auto;
  flex: 1;
  max-width: 1920px;
  height: 100px;
  padding: 1rem;

  p {
    font-weight: bold;
    color: #fff;
  }
`;

const UserNav = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  border: 2px solid #fff;
  background-color: #45dd8a;
  border-radius: 1rem;
  &:hover {
    cursor: pointer;
  }
  header {
    display: flex;
    text-align: right;
    justify-content: center;
    align-items: center;

    h5 {
      text-transform: uppercase;
    }
    p {
      font-size: 1rem;
    }
  }
`;

const UserImageWrapper = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 100%;
  padding: 0.5rem;
`;

export default Navigation;
