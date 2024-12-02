import { View, Text } from "react-native";
import React from "react";
import { IMessage } from "@/app/(tabs)/chats/chat_content";

const Message: React.FC<IMessage> = ({ isMyMsg, text }) => {
  return (
    <View
      className={`p-4 border-2 rounded-3xl mb-3 ${
        isMyMsg ? "bg-blue-400" : "bg-slate-200"
      }`}
    >
      <Text className="text-black font-semibold text-lg">{text}</Text>
    </View>
  );
};

export default Message;
