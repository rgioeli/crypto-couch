import { createContext, useState } from "react";

const MenuContext = createContext();

export const MenuContextProvider = ({ children }) => {
  const [toggleChat, setToggleChat] = useState(false);
  const [toggleNews, setToggleNews] = useState(false);
  const [toggleRooms, setToggleRooms] = useState(false);

  const toggleChatDiv = () => {
    setToggleRooms(false);
    setToggleNews(false);
    setToggleChat(true);
  };

  const toggleNewsDiv = () => {
    setToggleRooms(false);
    setToggleNews(true);
    setToggleChat(false);
  };

  const toggleRoomsDiv = () => {
    setToggleRooms(true);
    setToggleNews(false);
    setToggleChat(false);
  };

  return (
    <MenuContext.Provider
      value={{
        toggleChat,
        toggleNews,
        toggleRooms,
        toggleChatDiv,
        toggleNewsDiv,
        toggleRoomsDiv,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};

export default MenuContext;
