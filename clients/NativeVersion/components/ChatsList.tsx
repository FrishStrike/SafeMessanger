import { View } from "react-native";
import React from "react";
import Chat, { IChat } from "./Chat";

interface IChatsLists {
  chats: Array<IChat>;
  setChats: (chats: Array<IChat>) => void;
}

const ChatsList: React.FC<IChatsLists> = ({ chats, setChats }) => {
  return (
    <View className="w-full justify-center items-center gap-2 my-4 px-3">
      {chats &&
        chats.map((chat, key) => (
          <Chat
            key={key}
            name={chat.name}
            code={chat.code}
            icon={chat.icon}
            chats={chats}
            setChats={setChats}
          />
        ))}
    </View>
  );
};

export default ChatsList;
