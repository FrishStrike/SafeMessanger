import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { icons } from "@/constants";
import { Link } from "expo-router";
import { IChat } from "@/app/(tabs)/chats";

export interface IChatView extends IChat {
  removeChat: (code: string) => void;
}

const Chat: React.FC<IChatView> = (props) => {
  const serializedData = encodeURIComponent(JSON.stringify(props));

  return (
    <Link href={`/chats/chat_content?data=${serializedData}`} className="mb-3">
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
          <Image
            source={props.icon ? props.icon : icons.user}
            className="w-10 h-10"
          />
          <Text className="font-psemibold text-xl">{props.name}</Text>
        </View>
        <TouchableOpacity onPress={() => props.removeChat(props.code)}>
          <Image source={icons.close} className="w-8 h-8" />
        </TouchableOpacity>
      </View>
    </Link>
  );
};

export default Chat;
