import { TouchableOpacity, Text, GestureResponderEvent } from "react-native";
import React from "react";

const CustomButton = ({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
  bgColor,
}: {
  title: string;
  handlePress: (event: GestureResponderEvent) => void;
  bgColor?: string;
  containerStyles?: string;
  textStyles?: string;
  isLoading?: boolean;
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={1}
      className={`
        ${bgColor ? bgColor : "bg-secondary"}
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
