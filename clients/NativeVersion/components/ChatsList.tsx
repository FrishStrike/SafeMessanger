import { FlatList, SafeAreaView, Text, View } from "react-native";
import React from "react";
import Chat from "./Chat";
import CustomButton from "./CustomButton";
import { IChat } from "@/app/(tabs)/chats";

interface IChatsLists {
  chats: Array<IChat>;
  setChats: (chats: Array<IChat>) => void;
  setModalActive: (state: boolean) => void;
}

const ChatsList: React.FC<IChatsLists> = ({
  chats,
  setChats,
  setModalActive,
}) => {
  const removeChat = (code: string) => {
    const newChats = chats.filter((chat) => chat.code != code);
    console.log(newChats);
    setChats(newChats);
  };

  return (
    <SafeAreaView>
      <FlatList
        className="p-2"
        data={chats}
        keyExtractor={(item) => item.code}
        renderItem={({ item }) => {
          return (
            <Chat
              code={item.code}
              name={item.name}
              icon={item.icon}
              removeChat={removeChat}
            />
          );
        }}
        ListEmptyComponent={() => (
          <View className="mt-[50%]">
            <Text className="mb-10 text-4xl font-psemibold">
              Oh, You don't have chats
            </Text>
          </View>
        )}
        ListFooterComponent={() => (
          <CustomButton
            containerStyles="my-2 mx-4"
            title="Add Chat"
            handlePress={() => setModalActive(true)}
          />
        )}
      />
    </SafeAreaView>
  );
};

export default ChatsList;
