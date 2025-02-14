import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Lock, Package } from "lucide-react-native";
import { router } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "@/store/slices/authSlice";
import { storeAuthData, getAuthData } from "@/utils/auth";
import { RootState } from "@/store/store";

const LoginScreen = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const [secretKey, setSecretKey] = useState("");

  useEffect(() => {
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    const { user } = await getAuthData();
    if (user) {
      dispatch(loginSuccess(user));
      router.replace("/home");
    }
  };

  const handleLogin = async () => {
    if (!secretKey.trim()) return;

    dispatch(loginStart());
    try {
      const response = await fetch("http://172.16.11.195:3000/warehousemans");
      const warehousemans = await response.json();
      const user = warehousemans.find(
        (user: { secretKey: string }) => user.secretKey === secretKey
      );

      if (user) {
        // Store auth data in AsyncStorage
        const success = await storeAuthData(user.secretKey, user);
        if (success) {
          dispatch(loginSuccess(user));
          router.replace("/home");
        } else {
          throw new Error("Failed to store authentication data");
        }
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      dispatch(
        loginFailure(error instanceof Error ? error.message : "Login failed")
      );
      Alert.alert(
        "Login Failed",
        error instanceof Error ? error.message : "Please try again"
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          className="flex-1 bg-gray-50"
          bounces={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top Section with Logo and Illustration */}
          <View className="h-2/5 bg-yellow-500 rounded-b-[48px] justify-end items-center p-8">
            <Package color="white" size={64} className="mb-4" />
            <Text className="text-white text-2xl font-bold mb-2">
              WarehouseOps
            </Text>
            <Text className="text-blue-100 text-center">
              Inventory Management System
            </Text>
          </View>

          {/* Login Form Section */}
          <View className="flex-1 px-8 pt-12 pb-8">
            <View className="space-y-4">
              <View>
                <Text className="text-3xl font-bold text-gray-900">
                  Welcome Back
                </Text>
                <Text className="text-gray-600 mt-2">
                  Enter your credentials to access your workspace
                </Text>
              </View>

              {/* Input Field */}
              <View className="mt-8">
                <Text className="text-gray-700 mb-2 font-medium">
                  Secret Key
                </Text>
                <View className="relative">
                  <View className="absolute top-3 left-4 z-10">
                    <Lock color="#6B7280" size={20} />
                  </View>
                  <TextInput
                    className="bg-white h-12 px-12 rounded-xl text-gray-900 border border-gray-200"
                    placeholder="Enter your secret key"
                    placeholderTextColor="#9CA3AF"
                    value={secretKey}
                    onChangeText={setSecretKey}
                    secureTextEntry
                    autoCapitalize="none"
                  />
                </View>
              </View>

              {/* Login Button */}
              <TouchableOpacity
                className={`h-12 mt-2 rounded-xl items-center justify-center ${
                  loading ? "bg-yellow-400" : "bg-yellow-500"
                }`}
                onPress={handleLogin}
                disabled={loading || !secretKey}
              >
                <Text className="text-white font-bold text-lg">
                  {loading ? "Logging in..." : "Login"}
                </Text>
              </TouchableOpacity>

              {/* Help Text */}
              <Text className="text-center text-gray-600 mt-4 mb-24">
                Contact your administrator if you've forgotten your secret key
              </Text>
            </View>

            {/* Footer */}
            <View className="mt-8">
              <Text className="text-center text-gray-500 text-sm">
                © 2025 WarehouseOps. All rights reserved.
              </Text>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
