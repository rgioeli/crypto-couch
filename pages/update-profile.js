import { getSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { v4 } from "uuid";
import styled from "styled-components";
import Profile from "../src/globals/Profile";

const UpdateProfile = ({ genName, genHandle }) => {
  return (
    <UpdateProfileWrapper>
      <header>
        <h3>Welcome to Crypto Couch!</h3>
        <p>
          We have provided default profile information others can identify you
          with if you would like to quickly get started. However, you probably
          want to personalize it! Edit your profile below before getting
          started.
        </p>
      </header>
      <Profile genName={genName} genHandle={genHandle} />
    </UpdateProfileWrapper>
  );
};

export async function getServerSideProps(ctx) {
  const session = await getSession({ req: ctx.req });

  // if there's not a session, redirect them - or if there is a session and the user has the required properties - redirect them

  if (
    !session ||
    (session?.user?.name?.username && session?.user?.name?.handle)
  ) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  } else {
    // We can send some default username and handle
    // to make our client code smaller
    const names = ["crypto", "couch", "nft", "satoshi", "digital"];
    const number = v4().slice(0, 12).replace("-", "");
    const ranNum = Math.floor(Math.random() * 5);
    const chosenName = names[ranNum];
    const genName = chosenName + "_" + number;
    const genHandle = chosenName + "_" + number.slice(0, 7);
    return {
      props: {
        genName,
        genHandle: genHandle,
      },
    };
  }
}

const UpdateProfileWrapper = styled.div`
  flex: 1;
  max-width: 1024px;
  margin: auto;
  padding: 1rem;
  color: #fff;

  header {
    border: 2px solid #fff;
    padding: 1rem;
    margin-bottom: 1rem;
  }
`;

export default UpdateProfile;
