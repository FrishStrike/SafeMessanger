import { Text } from "react-native";
import React, { useState } from "react";
import Modal from "./Modal";
import { IModal } from "./Modal";
import FormField from "./FormField";
import CustomButton from "./CustomButton";
import interactionWithServer from "@/scripts/client";
import { IChat } from "@/app/(tabs)/chats";

interface IAddChatModal extends IModal {
  chats: Array<IChat>;
  setChats: (chats: Array<IChat>) => void;
}

const AddChatModal: React.FC<IAddChatModal> = ({
  active,
  chats,
  setActive,
  setChats,
}) => {
  const [form, setForm] = useState({
    name: "",
    code: "",
  });

  const addNewChat = () => {
    if (form.code === "" || form.name === "") return;
    chats.push({ name: form.name, code: form.code });
    setChats(chats);
    // interactionWithServer(form.name, form.code);
    setForm({ name: "", code: "" });
    setActive(false);
  };

  return (
    <Modal active={active} setActive={setActive}>
      <Text className="text-3xl text-center">Add new chat</Text>
      <FormField
        fieldStyles="bg-white"
        inputStyles="text-black font-semibold text-xl"
        titleStyle=""
        title="Name"
        value={form.name}
        handleChangeText={(e) => setForm({ ...form, name: e })}
      />
      <FormField
        fieldStyles="bg-white"
        inputStyles="text-black font-semibold text-xl"
        titleStyle="text-black"
        title="Code"
        value={form.code}
        handleChangeText={(e) => setForm({ ...form, code: e })}
      />
      <CustomButton
        title="Add"
        handlePress={addNewChat}
        containerStyles="my-4"
      />
    </Modal>
  );
};

export default AddChatModal;
