import { Stack, SplashScreen } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import "../global.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    "Popping-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Popping-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Popping-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Popping-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Popping-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Popping-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Popping-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Popping-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Popping-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
  });

  useEffect(() => {
    if (error) throw error;

    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) return null;

  return <Stack screenOptions={{ headerShown: false }}></Stack>;
}
