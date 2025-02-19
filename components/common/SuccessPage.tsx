import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { Check, ArrowLeft, Plus } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Animated, { 
  FadeIn, 
  FadeInDown, 
  BounceIn 
} from 'react-native-reanimated';

interface SuccessPageProps {
  title?: string;
  message?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryPress?: () => void;
  onSecondaryPress?: () => void;
}

export const SuccessPage: React.FC<SuccessPageProps> = ({
  title = 'Success!',
  message = 'Product added successfully',
  primaryButtonText = 'Add New Product',
  secondaryButtonText = 'View Products',
  onPrimaryPress,
  onSecondaryPress,
}) => {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      
      {/* Content */}
      <View className="flex-1">
        {/* Success Icon and Message - Centered */}
        <View className="flex-1 items-center justify-center px-6">
          <Animated.View 
            entering={BounceIn.delay(200)}
            className="w-24 h-24 bg-green-100 rounded-full items-center justify-center mb-8"
          >
            <View className="w-20 h-20 bg-green-500 rounded-full items-center justify-center">
              <Check size={40} color="white" strokeWidth={3} />
            </View>
          </Animated.View>
  
          <Animated.View 
            entering={FadeInDown.delay(400)}
            className="items-center"
          >
            <Text className="text-2xl font-bold text-gray-800 mb-3 text-center">
              {title}
            </Text>
            <Text className="text-gray-600 text-center text-base">
              {message}
            </Text>
          </Animated.View>
        </View>
  
        {/* Buttons - Fixed at bottom */}
        <Animated.View 
          entering={FadeIn.delay(600)}
          className="px-6 pb-6"
        >
          <TouchableOpacity
            onPress={onPrimaryPress}
            className="w-full bg-yellow-500 py-4 rounded-xl items-center flex-row justify-center"
          >
            <Plus size={20} color="white" />
            <Text className="text-white font-semibold text-lg ml-2">
              {primaryButtonText}
            </Text>
          </TouchableOpacity>
  
          <TouchableOpacity
            onPress={onSecondaryPress}
            className="w-full bg-gray-100 py-4 rounded-xl items-center flex-row justify-center mt-4"
          >
            <ArrowLeft size={20} color="#374151" />
            <Text className="text-gray-700 font-semibold text-lg ml-2">
              {secondaryButtonText}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};