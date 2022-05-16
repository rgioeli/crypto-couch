import { useEffect, useState } from "react";
import styled from "styled-components";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Home() {
  return <HomeWrapper></HomeWrapper>;
}

export async function getServerSideProps(ctx) {
  const session = await getSession({ req: ctx.req });
  if (session && session.user) {
    return {
      redirect: {
        destination: "/chat/btcusd",
        permanant: "false",
      },
    };
  }

  return {
    props: {},
  };
}

const HomeWrapper = styled.div`
  max-width: 1920px;
`;
