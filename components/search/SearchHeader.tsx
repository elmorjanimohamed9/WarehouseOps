import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Package } from 'lucide-react-native';

const SearchHeader = () => {
  return (
    <View className="flex-row items-center justify-between mb-6">
      <View>
        <Text className="text-white text-2xl font-bold">Search</Text>
        <Text className="text-yellow-100">Find your products</Text>
      </View>
      <TouchableOpacity className="bg-yellow-400 p-2 rounded-full">
        <Package color="white" size={24} />
      </TouchableOpacity>
    </View>
  );
};

export default SearchHeader;