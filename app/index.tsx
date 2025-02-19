import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { RootState } from '@/store/store';
import { router } from 'expo-router';
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ArrowRight, Package, Warehouse } from 'lucide-react-native';
import { getAuthData } from '@/utils/auth';
import { loginSuccess } from '@/store/slices/authSlice';
const SplashScreen = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated, shallowEqual);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkAuthStatus = async () => {
      try {
        const { user } = await getAuthData();
        if (isMounted && user) {
          dispatch(loginSuccess(user));
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    checkAuthStatus();
    return () => { isMounted = false; };
  }, [dispatch]);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/(tabs)/home');
    }
  }, [isAuthenticated, isLoading]);

  const handleGetStarted = useCallback(() => {
    router.push('/login');
  }, []);

  if (isLoading) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#eab308" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View className="absolute top-0 right-0 left-0 h-2/5 bg-yellow-500 rounded-b-[48px]" />

      <View className="flex-1 px-6 pt-10">
        {/* Header */}
        <View className="flex items-center justify-center space-x-2 mb-4">
          <Package color="#FFF" size={32} />
          <Text className="text-white text-xl font-bold">WarehouseOps</Text>
        </View>

        {/* Illustration Container */}
        <View className="items-center justify-center mb-8">
          <View className="bg-white p-6 rounded-3xl">
            <Image
              source={require('../assets/images/Illustration01.png')}
              className="w-72 h-72"
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Content Section */}
        <View className="flex-1 justify-center pb-12">
          {/* Feature Points */}
          <View className="bg-white p-6 rounded-3xl shadow-sm mb-8">
            <View className="flex-row items-center space-x-6">
              <View className="bg-yellow-100 p-2 rounded-full">
                <Warehouse color="#eab308" size={24} />
              </View>
              <View className="ml-2">
                <Text className="text-lg font-bold text-gray-900">
                  Smart Warehouse Management
                </Text>
                <Text className="text-gray-500">
                  Efficient inventory tracking & control
                </Text>
              </View>
            </View>
          </View>

          {/* Main Title */}
          <Text className="text-3xl font-bold text-gray-900 text-center mb-4">
            Streamline Your{' '}
            <Text className="text-yellow-500">Warehouse Operations</Text>
          </Text>

          <Text className="text-gray-600 text-base text-center mb-8">
            Access your workspace and manage inventory with ease. Authorized warehouse operators only.
          </Text>

          {/* Get Started Button */}
          <TouchableOpacity
            onPress={handleGetStarted}
            className="bg-yellow-500 h-12 rounded-2xl flex-row items-center justify-center space-x-2 mb-10"
          >
            <Text className="text-white font-bold text-lg">Get Started</Text>
            <ArrowRight color="#FFF" size={20} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SplashScreen;