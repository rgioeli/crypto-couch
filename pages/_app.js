import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import Navigation from "../src/globals/Navigation";
import { MenuContextProvider } from "../src/globals/context/MenuContext";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <MenuContextProvider>
        <Navigation />
        <Component {...pageProps} />
      </MenuContextProvider>
    </SessionProvider>
  );
}

export default MyApp;
