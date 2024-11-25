import { View } from "react-native";
import React from "react";
import Chat from "./Chat";

const ChatsList = () => {
  return (
    <View className="w-full justify-center items-center gap-2 my-4 px-3">
      <Chat name="Zopa kaka" />
      <Chat name="Pisya" />
    </View>
  );
};

export default ChatsList;
