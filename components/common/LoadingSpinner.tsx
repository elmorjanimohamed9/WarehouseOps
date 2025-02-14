import React from 'react';
import { ActivityIndicator, View } from 'react-native';

export const LoadingSpinner = () => (
  <View className="flex-1 justify-center items-center">
    <ActivityIndicator size="large" color="#eab308" />
  </View>
);