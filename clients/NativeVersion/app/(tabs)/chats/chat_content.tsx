import { View, Text, FlatList } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Message from "@/components/Message";
import FormField from "@/components/FormField";

export interface IMessage {
  isMyMsg: boolean;
  text: string;
}

const ChatContent = () => {
  const [messages, setMessages] = useState<Array<IMessage>>([]);
  const [value, setValue] = useState("");

  const sendMessage = (msg: string) => {
    if (msg === "") return;
    messages.push({ text: msg, isMyMsg: true });
    setMessages(messages);
    setValue("");
  };

  return (
    <SafeAreaView className="h-full pb-2 px-2 flex-col justify-end">
      <FlatList
        inverted={true}
        contentContainerStyle={{ flexDirection: "column-reverse" }}
        data={messages}
        renderItem={({ item }) => (
          <Message isMyMsg={item.isMyMsg} text={item.text} />
        )}
        ListHeaderComponent={({ item }) => <View></View>}
      />
      <View>
        <FormField
          fieldStyles="bg-white"
          inputStyles="text-black font-semibold text-xl"
          titleStyle=""
          title="Message"
          value={value}
          handleChangeText={(e) => setValue(e)}
          sendMessage={() => sendMessage(value)}
        />
      </View>
    </SafeAreaView>
  );
};

export default ChatContent;
