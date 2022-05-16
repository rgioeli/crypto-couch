import { createContext, useState } from "react";

const MenuContext = createContext();

export const MenuContextProvider = ({ children }) => {
  const [toggleChat, setToggleChat] = useState(false);
  const [toggleNews, setToggleNews] = useState(false);

  const toggleChatDiv = () => {
    console.log("Hitting it...");
    setToggleChat(!toggleChat);
  };

  const toggleNewsDiv = () => {
    setToggleNews(!toggleNews);
  };

  return (
    <MenuContext.Provider
      value={{ toggleChat, toggleNews, toggleChatDiv, toggleNewsDiv }}
    >
      {children}
    </MenuContext.Provider>
  );
};

export default MenuContext;
