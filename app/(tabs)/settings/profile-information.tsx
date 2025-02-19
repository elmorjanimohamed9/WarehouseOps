import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import {
  ArrowLeft,
  Camera,
  User,
  MapPin,
  Calendar,
  Key,
  Save,
} from "lucide-react-native";
import { router } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Alert } from "@/components/common/Alert";
import * as ImagePicker from "expo-image-picker";
import { loginSuccess } from "@/store/slices/authSlice";
import { storeAuthData } from "@/utils/auth";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const ProfileInformationScreen = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [isLoading, setIsLoading] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    type: "success" as const,
    title: "",
    message: "",
    isVisible: false,
  });

  const [formData, setFormData] = useState({
    id: user?.id || "",
    name: user?.name || "",
    city: user?.city || "",
    dob: user?.dob || "",
    secretKey: user?.secretKey || "",
    image: user?.image || "",
    warehouseId: user?.warehouseId || "",
  });

  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        setFormData((prev) => ({ ...prev, image: result.assets[0].uri }));
      }
    } catch (error) {
      setAlertConfig({
        type: "error",
        title: "Error",
        message: "Failed to pick image",
        isVisible: true,
      });
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.city.trim() || !formData.secretKey.trim()) {
      setAlertConfig({
        type: "error",
        title: "Validation Error",
        message: "Please fill in all required fields",
        isVisible: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/warehousemans/${user?.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const updatedUser = await response.json();
      await storeAuthData(updatedUser.secretKey, updatedUser);
      dispatch(loginSuccess(updatedUser));

      setAlertConfig({
        type: "success",
        title: "Profile Updated",
        message: "Your profile information has been successfully updated",
        isVisible: true,
      });
    } catch (error) {
      setAlertConfig({
        type: "error",
        title: "Update Failed",
        message: error instanceof Error ? error.message : "Failed to update profile",
        isVisible: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const InputField = ({
    icon: Icon,
    label,
    value,
    onChangeText,
    placeholder,
    secureTextEntry,
  }: {
    icon: any;
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    secureTextEntry?: boolean;
  }) => (
    <View className="mb-4">
      <Text className="text-gray-700 font-medium mb-2">{label}</Text>
      <View className="flex-row items-center bg-white rounded-xl px-2 py-1 border border-gray-100">
        <View className="bg-yellow-50 p-2 rounded-xl">
          <Icon size={18} color="#eab308" />
        </View>
        <TextInput
          className="flex-1 ml-3 text-gray-700 font-medium"
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          secureTextEntry={secureTextEntry}
          autoCapitalize="none"
        />
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-yellow-500 pt-12 pb-6 px-6 rounded-b-[32px]">
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
          >
            <ArrowLeft color="white" size={24} />
          </TouchableOpacity>
          <Text className="text-white text-lg font-bold">
            Profile Information
          </Text>
          <View className="w-10" />
        </View>

        {/* Profile Image */}
        <View className="items-center -mb-16 z-50">
          <TouchableOpacity onPress={handleImagePick} className="relative">
            {formData.image ? (
              <Image
                source={{ uri: formData.image }}
                className="w-32 h-32 rounded-full border-4 border-white"
              />
            ) : (
              <View className="w-32 h-32 bg-white rounded-full items-center justify-center">
                <User size={48} color="#eab308" />
              </View>
            )}
            <View className="absolute bottom-0 right-0 bg-yellow-400 p-2 rounded-full border-2 border-white">
              <Camera size={16} color="white" />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1 px-6 pt-12"
          showsVerticalScrollIndicator={false}
        >
          {/* Form Card */}
          <View className="bg-white rounded-3xl p-6 shadow-sm">
            <InputField
              icon={User}
              label="Full Name"
              value={formData.name}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, name: text }))
              }
              placeholder="Enter your full name"
            />

            <InputField
              icon={MapPin}
              label="City"
              value={formData.city}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, city: text }))
              }
              placeholder="Enter your city"
            />

            <InputField
              icon={Calendar}
              label="Date of Birth"
              value={formData.dob}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, dob: text }))
              }
              placeholder="YYYY-MM-DD"
            />

            <InputField
              icon={Key}
              label="Secret Key"
              value={formData.secretKey}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, secretKey: text }))
              }
              placeholder="Enter your secret key"
              secureTextEntry
            />

            {/* Save Button */}
            <TouchableOpacity
              onPress={handleSave}
              disabled={isLoading}
              className="bg-yellow-500 py-4 px-6 rounded-xl flex-row items-center justify-center mt-4"
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="white" className="mr-2" />
              ) : (
                <Save size={20} color="white" />
              )}
              <Text className="text-white font-semibold ml-2">
                {isLoading ? "Updating..." : "Save Changes"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Alert
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        isVisible={alertConfig.isVisible}
        onClose={() => setAlertConfig((prev) => ({ ...prev, isVisible: false }))}
      />
    </View>
  );
};

export default ProfileInformationScreen;