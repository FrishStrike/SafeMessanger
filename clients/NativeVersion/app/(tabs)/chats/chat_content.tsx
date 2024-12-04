import { View, FlatList, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Message from "@/components/Message";
import FormField from "@/components/FormField";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { IChatView } from "@/components/Chat";

export interface IMessage {
  isMyMsg: boolean;
  name: string;
  time: string;
  message: string;
}

export interface messageJson extends IMessage {}

const HOST = process.env.EXPO_PUBLIC_API_URL;
const PORT = process.env.EXPO_PUBLIC_API_PORT;

const WS_URL = `${HOST}:${PORT}`;

const name = "Hui";

console.log(WS_URL);

const ChatContent = () => {
  const data = useLocalSearchParams()["data"];
  const chatView: IChatView = JSON.parse(decodeURIComponent(data as string));

  const [messages, setMessages] = useState<Array<IMessage>>([]);

  const [value, setValue] = useState("");

  // gpt
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const getTime = () => {
    const date = new Date();
    return `${date.getHours()}:${date.getMinutes()}`;
  };

  const sendMessage = (msg: string) => {
    if (ws && ws.readyState === WebSocket.OPEN && msg !== "") {
      const time = getTime();
      const data = JSON.stringify({ message: msg, name: name, time: time });
      ws.send(data);
      messages.push({ message: msg, isMyMsg: true, name: name, time: time });
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
      const data: messageJson = JSON.parse(event.data);
      const time = getTime();
      console.log("Получено сообщение:", event.data);

      messages.push({
        message: data.message,
        isMyMsg: false,
        name: data.name,
        time: time,
      });
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
          <Message
            isMyMsg={item.isMyMsg}
            message={item.message}
            name={item.name}
            time={item.time}
          />
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
