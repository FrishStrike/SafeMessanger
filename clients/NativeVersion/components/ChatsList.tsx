import { FlatList, SafeAreaView, Text, View } from "react-native";
import React from "react";
import Chat, { IChat } from "./Chat";
import CustomButton from "./CustomButton";

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
  return (
    <SafeAreaView>
      <FlatList
        className="p-2"
        data={chats}
        keyExtractor={(item) => item.code}
        renderItem={({ item }) => (
          <Chat
            code={item.code}
            name={item.name}
            icon={item.icon}
            chats={item.chats}
            setChats={item.setChats}
          />
        )}
        ListEmptyComponent={() => (
          <View>
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
      {/* // chats &&
    // chats.map((chat, key) => (
    //   <Chat
    //     key={key}
    //     name={chat.name}
    //     code={chat.code}
    //     icon={chat.icon}
    //     chats={chats}
    //     setChats={setChats}
    //   />
    // )) */}
    </SafeAreaView>
  );
};

export default ChatsList;
