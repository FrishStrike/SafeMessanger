import React from "react";
import { Stack } from "expo-router";

const ChatsLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
};

export default ChatsLayout;
