import { View, Text, Image } from "react-native";
import React from "react";
import { IMessage } from "@/app/(tabs)/chats/chat_content";
import { icons } from "@/constants";

const Message: React.FC<IMessage> = ({ isMyMsg, message, name, time }) => {
  return (
    <View
      className={`p-4 border-2 rounded-3xl flex-row gap-4 mb-3 justify-between ${
        isMyMsg ? "bg-blue-400 flex-row-reverse" : "bg-slate-200"
      }`}
    >
      <View className="flex-row gap-2 items-center h-12">
        <Image source={icons.user} style={{ width: 26, height: 26 }} />
        <Text className="text-black font-extrabold text-2xl">{name}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-black font-semibold text-lg text-left">
          {message}
        </Text>
      </View>
      <Text className="">{time}</Text>
    </View>
  );
};

export default Message;
