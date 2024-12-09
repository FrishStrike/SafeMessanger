import { View, Text, Image } from "react-native";
import React, { useEffect, useState } from "react";
import CustomButton from "@/components/CustomButton";
import { router, useLocalSearchParams } from "expo-router";
import { icons } from "@/constants";
import axios from "axios";
import Modal from "@/components/Modal";
import FormField from "@/components/FormField";

interface IResponseMessage {
  name: string;
  nickname: string;
  _id: string;
}

const Notifications = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [isActiveEditName, setIsActiveEditName] = useState(false);
  const [isActiveDeleteAccount, setIsActiveDeleteAccount] = useState(false);
  const [formValue, setFormValue] = useState("");
  const [user, setUser] = useState<IResponseMessage>();

  const deleteAccount = async () => {
    setIsAuth(false);
    try {
      if (!user) {
        console.log("User is undefined for update user client");
        return;
      }
      const response = await axios.delete(
        `http://${process.env.EXPO_PUBLIC_API_URL}:3000/users/${user._id}`
      );
      console.log(response.data.message);
    } catch (error) {
      console.log("Client error delete", error);
    }
  };

  const updateUser = async () => {
    try {
      if (!user) {
        console.log("User is undefined for update user client");
        return;
      }
      const updateUser = await axios.put(
        `http://${process.env.EXPO_PUBLIC_API_URL}:3000/users/${user._id}`,
        { name: formValue }
      );
      console.log("User is updated!");
      setFormValue("");
      setIsActiveEditName(false);
      setUser({ ...updateUser.data });
    } catch (error) {
      console.log("Client update error", error);
      setFormValue("");
    }
  };

  const data = useLocalSearchParams()["data"] as unknown;

  console.log("Data from auth", data);

  useEffect(() => {
    if (data) {
      setIsAuth(true);
      setUser(JSON.parse(decodeURIComponent(data as string)));
    }
  }, [data]);

  if (!isAuth) {
    return (
      <View className="w-full h-full flex items-center justify-center p-4 gap-10">
        <Text className="text-3xl font-semi-bold">
          Sign In to get notifications
        </Text>
        <CustomButton
          containerStyles="w-full"
          title="Sign In"
          handlePress={() => router.push("/sign-in")}
        />
      </View>
    );
  }

  if (user)
    return (
      <View className="w-full h-full">
        <View
          className="
            h-40
            rounded-3xl
          bg-gray-200
            flex-col
            p-4
            items-center
            justify-between
            gap-4
            mb-4"
        >
          <Text className="font-bold text-xl">
            It's your account! What Do you want?
          </Text>
          <View className="flex-row gap-2">
            <CustomButton
              bgColor="bg-red-500"
              title="Sign Out"
              handlePress={() => {
                setIsAuth(false);
              }}
            />
            <CustomButton
              bgColor="bg-red-700"
              title="Delete account"
              handlePress={() => setIsActiveDeleteAccount(true)}
            />
          </View>
        </View>
        <View className="h-28 rounded-3xl bg-gray-50 flex-row p-4 justify-between items-center">
          <View className="flex-row gap-4 items-center">
            <Image source={icons.user} style={{ width: 30, height: 30 }} />
            <View>
              <Text className="text-lg">{user.name}</Text>
              <Text className="font-light text-sm">{user.nickname}</Text>
            </View>
          </View>
          <CustomButton
            title="Change name"
            bgColor="bg-blue-100"
            handlePress={() => setIsActiveEditName(true)}
          />
        </View>
        <Modal active={isActiveEditName} setActive={setIsActiveEditName}>
          <Text className="text-3xl font-bold text-center pb-10">
            Enter a new name
          </Text>
          <FormField
            title="New Name"
            value={formValue}
            handleChangeText={setFormValue}
            fieldStyles="bg-white"
            inputStyles="text-black"
            otherStyles="pb-6"
          />
          <CustomButton title="Edit" handlePress={updateUser} />
        </Modal>
        <Modal
          active={isActiveDeleteAccount}
          setActive={setIsActiveDeleteAccount}
        >
          <Text className="text-3xl font-bold text-center pt-14 pb-10">
            Are you sure?
          </Text>
          <View className="flex-row w-full items-center justify-center gap-4">
            <CustomButton
              title="No!"
              containerStyles="w-40"
              bgColor="bg-blue-200"
              handlePress={() => setIsActiveDeleteAccount(false)}
            />
            <CustomButton
              title="Yes!"
              containerStyles="w-40"
              bgColor="bg-red-500"
              handlePress={deleteAccount}
            />
          </View>
        </Modal>
      </View>
    );
};

export default Notifications;
