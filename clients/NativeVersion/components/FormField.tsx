import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";

import { icons } from "../constants";

interface IFormField {
  title: string;
  value: string;
  handleChangeText: (e: any) => void;
  placeholder?: string;
  otherStyles?: string;
  fieldStyles?: string;
  inputStyles?: string;
  titleStyle?: string;
  [key: string]: any;
}

const FormField: React.FC<IFormField> = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  titleStyle,
  fieldStyles,
  inputStyles,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className={`text-base text-gray-100 font-pmedium ${titleStyle}`}>
        {title}
      </Text>

      <View
        className={`
          ${fieldStyles}
          w-full
          h-16
          px-4
        bg-black-100
          rounded-2xl
          border-2
        border-black-200
        focus:border-secondary
          flex
          flex-row
          items-center
        `}
      >
        <TextInput
          className={`flex-1 text-white font-psemibold text-base ${inputStyles}`}
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7B7B8B"
          onChangeText={handleChangeText}
          secureTextEntry={title === "Password" && !showPassword}
          {...props}
        />

        {title === "Password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
