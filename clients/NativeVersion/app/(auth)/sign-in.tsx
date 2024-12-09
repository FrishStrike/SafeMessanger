import { View, Text, ScrollView, Image, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import { Link, RelativePathString, router } from "expo-router";
import axios, { isAxiosError } from "axios";

const SignIn = () => {
  const [form, setForm] = useState({
    login: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const submit = async () => {
    if (!form.login || !form.password) {
      Alert.alert("Error", "Please fill all the fields");
      return;
    }

    setIsLoading(true);
    try {
      const host = `http://${process.env.EXPO_PUBLIC_API_URL}:3000/users/login`;
      console.log(host);

      const user = await axios.post(host, {
        nickname: form.login,
        password: form.password,
      });
      console.log(user.data);
      const serializedData = encodeURIComponent(
        JSON.stringify({
          nickname: user.data.nickname,
          name: user.data.name,
          _id: user.data._id,
        })
      );
      router.push(`/(tabs)/notifications/notifications?data=${serializedData}`);
    } catch (error) {
      if (isAxiosError(error)) {
        console.log("Axios error", error);
        Alert.alert("User is not defined!");
      } else Alert.alert("Ups something went wrong(");
      setForm({ login: "", password: "" });

      setIsLoading(false);
      return;
    }
    setIsLoading(false);
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center h-full px-4 my-6">
          <Image
            source={images.logo}
            resizeMode="contain"
            className="w-[115px] h-[35px]"
          />
          <Text className="text-2xl text-white text-semibold mt-10 font-psemibold">
            Log in to Chat Me
          </Text>

          <FormField
            title="Login"
            value={form.login}
            handleChangeText={(e) => setForm({ ...form, login: e })}
            otherStyles="mt-7"
            titleStyle="text-white"
            inputStyles="text-white"
            placeholder="login"
          />
          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
            titleStyle="text-white"
            inputStyles="text-white"
            placeholder="********"
          />

          <CustomButton
            title="Sign In"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isLoading}
          />
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Don't have an account?
            </Text>
            <Link
              href={"/sign-up" as RelativePathString}
              className="text-lg font-psemibold text-secondary-200"
            >
              Sign Up
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
