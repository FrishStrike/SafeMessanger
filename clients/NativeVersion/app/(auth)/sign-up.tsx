import { View, Text, ScrollView, Image, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import { Link, RelativePathString, router } from "expo-router";
import axios, { isAxiosError } from "axios";

const SignUp = () => {
  const [form, setForm] = useState({
    name: "",
    login: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    if (!form.name || !form.login || !form.password) {
      Alert.alert("Error", "Please fill all the fields");
      return;
    }
    try {
      const newUser = await axios.post(
        `http://192.168.0.105:3000/users/registrations`,
        {
          name: form.name,
          nickname: form.login,
          password: form.password,
        }
      );
      console.log(newUser.data);
      router.push("/(tabs)/notifications/notifications");
    } catch (error) {
      if (isAxiosError(error)) {
        console.log("Axios error", error.response?.data);
        Alert.alert(error.message);
      } else Alert.alert("Ups something went wrong");
      setForm({ login: "", name: "", password: "" });
      return;
    }
    setIsSubmitting(true);
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
            Sugn up to Aora
          </Text>

          <FormField
            title="Name"
            value={form.name}
            handleChangeText={(e) => setForm({ ...form, name: e })}
            otherStyles="mt-10"
            titleStyle="text-white"
            placeholder="name"
          />
          <FormField
            title="Login"
            value={form.login}
            handleChangeText={(e) => setForm({ ...form, login: e })}
            otherStyles="mt-7"
            titleStyle="text-white"
            keyboardType="email-address"
            placeholder="login"
          />
          <FormField
            title="Password"
            titleStyle="text-white"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
            placeholder="********"
          />

          <CustomButton
            title="Sign Up"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Have an account already?
            </Text>
            <Link
              href={"/sign-in" as RelativePathString}
              className="text-lg font-psemibold text-secondary-200"
            >
              Sign In
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
