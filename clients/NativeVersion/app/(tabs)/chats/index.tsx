import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import CustomButton from "@/components/CustomButton";
import ChatsList from "@/components/ChatsList";
import AddChatModal from "@/components/AddChatModal";

export interface IChat {
  name: string;
  code: string;
  icon?: string;
}

const Chats = () => {
  const [isEmpty, setIsEmpty] = useState(false);
  const [modalActive, setModalActive] = useState(false);
  const [chats, setChats] = useState<Array<IChat>>([]);

  useEffect(() => {
    if (!chats.length) setIsEmpty(true);
    else setIsEmpty(false);
  }, [chats.length]);

  return (
    <View className={`${isEmpty ? "items-center justify-center" : ""} h-full`}>
      <AddChatModal
        active={modalActive}
        chats={chats}
        setActive={setModalActive}
        setChats={setChats}
      />
      <ChatsList
        chats={chats}
        setChats={setChats}
        setModalActive={setModalActive}
      />
    </View>
  );
};

export default Chats;
