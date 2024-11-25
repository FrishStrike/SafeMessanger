import { Text } from "react-native";
import React from "react";
import Modal from "./Modal";
import { IModal } from "./Modal";
import FormField from "./FormField";

interface IAddChatModal extends IModal {}

const AddChatModal: React.FC<IAddChatModal> = ({ active, setActive }) => {
  return (
    <Modal active={active} setActive={setActive}>
      <Text className="text-3xl text-center">Add new chat</Text>
      {/* <FormField title="Name" value="" /> */}
    </Modal>
  );
};

export default AddChatModal;
