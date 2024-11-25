import { View, Text, Image } from "react-native";
import React from "react";
import { icons } from "@/constants";

interface IChat {
  name: string;
  icon?: string;
}

const Chat: React.FC<IChat> = ({ name, icon }) => {
  return (
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
      <Image source={icons.close} className="w-8 h-8" />
    </View>
  );
};

export default Chat;
