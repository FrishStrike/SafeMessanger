import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { icons } from "@/constants";
import { Link } from "expo-router";

export interface IChat {
  name: string;
  code: string;
  icon?: string;
  chats?: Array<IChat>;
  setChats?: (chats: Array<IChat>) => void;
}

const Chat: React.FC<IChat> = ({ name, icon, code, chats, setChats }) => {
  const removeChat = () => {
    if (chats && setChats) {
      setChats(chats.filter((chat) => chat.code != code));
    }
  };

  return (
    <Link href="/chats/chat_content" className="mb-3">
      <View
        className="
      w-full
      h-22
      px-4
      py-8
      justify-between
      items-center
      text-center
      border-2
      rounded-xl  
      flex-row
      "
      >
        <View className="flex-row gap-4 items-center h-[26px]">
          <Image source={icon ? icon : icons.user} className="w-10 h-10" />
          <Text className="font-psemibold text-xl">{name}</Text>
        </View>
        <TouchableOpacity onPress={removeChat}>
          <Image source={icons.close} className="w-8 h-8" />
        </TouchableOpacity>
      </View>
    </Link>
  );
};

export default Chat;
