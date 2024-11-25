import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import CustomButton from "@/components/CustomButton";
import ChatsList from "@/components/ChatsList";
import AddChatModal from "@/components/AddChatModal";
import { IChat } from "@/components/Chat";

const Chats = () => {
  const [isEmpty, setIsEmpty] = useState(false);
  const [modalActive, setModalActive] = useState(false);
  const [chats, setChats] = useState<Array<IChat>>([]);

  useEffect(() => {
    if (!chats.length) setIsEmpty(true);
    else setIsEmpty(false);
  }, [chats.length]);

  return (
    <View>
      <View
        className={`${isEmpty ? "items-center justify-center" : ""} h-full`}
      >
        <AddChatModal
          active={modalActive}
          chats={chats}
          setActive={setModalActive}
          setChats={setChats}
        />
        <ChatsList chats={chats} setChats={setChats} />
        <Text
          className={`${isEmpty ? "" : "hidden"} mb-10 text-4xl font-psemibold`}
        >
          Oh, You don't have chats
        </Text>
        <CustomButton
          containerStyles="my-2 mx-4"
          title="Add Chat"
          handlePress={() => setModalActive(true)}
        />
      </View>
    </View>
  );
};

export default Chats;
