import { TouchableOpacity, Text, GestureResponderEvent } from "react-native";
import React from "react";

const CustomButton = ({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
}: {
  title: string;
  handlePress: (event: GestureResponderEvent) => void;
  containerStyles?: string;
  textStyles?: string;
  isLoading?: boolean;
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={1}
      className={`
        bg-secondary
        rounded-xl
        min-h-[62px]
        justify-center 
        items-center
        ${containerStyles}
        ${isLoading ? "opacity-50" : ""}`}
      disabled={isLoading}
    >
      <Text
        className={`text-[#161622] font-bold text-lg px-10 py-0 ${textStyles}`}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
