import { View, TouchableOpacity } from "react-native";
import React from "react";

export interface IModal {
  active: boolean;
  setActive: (item: any) => void;
  children?: React.ReactNode;
}

const Modal: React.FC<IModal> = ({ active, setActive, children }) => {
  return (
    <TouchableOpacity
      onPress={() => setActive(false)}
      className={`
        ${active ? "fixed" : "hidden"}
        absolute
        z-10
        h-full
        w-full
        top-0
        left-0
        flex
        items-center
        justify-center
        bg-[rgba(0,0,0,0.18)]
    `}
    >
      <TouchableOpacity
        onPress={(e) => e.stopPropagation()}
        className="
        p-5
        rounded-2xl
        bg-white
        min-h-[50%]
        w-[90%]
      "
      >
        {children}
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default Modal;
