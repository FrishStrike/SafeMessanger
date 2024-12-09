import { View, Text } from "react-native";
import React from "react";
import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";

const Notifications = () => {
  return (
    <View>
      <CustomButton
        title="Sign In"
        handlePress={() => router.push("/sign-in")}
      />
    </View>
  );
};

export default Notifications;
