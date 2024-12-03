import { View, FlatList, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Message from "@/components/Message";
import FormField from "@/components/FormField";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { IChatView } from "@/components/Chat";

export interface IMessage {
  isMyMsg: boolean;
  text: string;
}

const WS_URL = "ws://192.168.0.104:12345";
// const messages: Array<IMessage> = [];

const ChatContent = () => {
  const data = useLocalSearchParams()["data"];
  const chatView: IChatView = JSON.parse(decodeURIComponent(data as string));

  const [messages, setMessages] = useState<Array<IMessage>>([]);

  const [value, setValue] = useState("");

  // gpt
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const sendMessage = (msg: string) => {
    if (ws && ws.readyState === WebSocket.OPEN && msg !== "") {
      ws.send(msg);
      messages.push({ text: msg, isMyMsg: true });
      setMessages(messages);
      setValue("");
    }
  };

  // gpt
  useEffect(() => {
    const socket = new WebSocket(WS_URL);
    socket.binaryType = "blob";

    socket.onopen = () => {
      console.log("Соединение установлено");
      setIsConnected(true);
      setWs(socket);
    };

    socket.onmessage = async (event) => {
      const blob = event.data;

      console.log("Получено сообщение:", event);

      messages.push({ text: blob, isMyMsg: false });
      console.log("messages after push", messages);

      setMessages([...messages]);
    };

    socket.onclose = () => {
      console.log("Соединение закрыто");
      setIsConnected(false);
    };

    socket.onerror = (error) => {
      console.error("Ошибка соединения:", error);
    };

    return () => {
      socket.close();
    };
  }, []);
  console.log("component messages", messages);

  return (
    <SafeAreaView className="h-full pb-2 px-2 flex-col justify-end">
      <View
        className="
        absolute
        w-[100vw]
        right-[-50%] 
        translate-x-[-4%]
        overflow-hidden
        top-1
        h-10
        z-10
      "
      >
        <Text className="font-semibold text-xl">{chatView.name}</Text>
      </View>
      <FlatList
        inverted={true}
        contentContainerStyle={{ flexDirection: "column-reverse" }}
        data={messages}
        renderItem={({ item }) => (
          <Message isMyMsg={item.isMyMsg} text={item.text} />
        )}
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
