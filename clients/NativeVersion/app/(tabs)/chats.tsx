import { View, Text } from "react-native";
import React, { useState } from "react";
import CustomButton from "@/components/CustomButton";
import ChatsList from "@/components/ChatsList";
import FormField from "@/components/FormField";
import AddChatModal from "@/components/AddChatModal";

const Chats = () => {
  const [isEmpty, setIsEmpty] = useState(false);
  const [modalActive, setModalActive] = useState(false);

  return (
    <View>
      <View
        className={`${isEmpty ? "items-center justify-center" : ""} h-full`}
      >
        <AddChatModal active={modalActive} setActive={setModalActive} />
        <ChatsList />
        <Text
          className={`${isEmpty ? "" : "hidden"} mb-10 text-4xl font-psemibold`}
        >
          Oh, You don't have any chats
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
