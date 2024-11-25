import { Text } from "react-native";
import React, { useState } from "react";
import Modal from "./Modal";
import { IModal } from "./Modal";
import FormField from "./FormField";
import CustomButton from "./CustomButton";
import interactionWithServer from "@/scripts/client";

interface IAddChatModal extends IModal {}

const AddChatModal: React.FC<IAddChatModal> = ({ active, setActive }) => {
  const [form, setForm] = useState({
    name: "",
    code: "",
  });

  const addNewChat = () => {
    // interactionWithServer(form.name, form.code);
    setForm({ name: "", code: "" });
    setActive(false);
  };

  return (
    <Modal active={active} setActive={setActive}>
      <Text className="text-3xl text-center">Add new chat</Text>
      <FormField
        fieldStyles="bg-white"
        inputStyles="text-black-200 font-semibold text-xl"
        titleStyle="text-black-200"
        title="Name"
        value={form.name}
        handleChangeText={(e) => setForm({ ...form, name: e })}
      />
      <FormField
        fieldStyles="bg-white"
        inputStyles="text-black-200 font-semibold text-xl"
        titleStyle="text-black-200"
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
