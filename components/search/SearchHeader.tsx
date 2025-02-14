import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Package, Plus } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const SearchHeader = () => {
  const router = useRouter();

  return (
    <View className="flex-row items-center justify-between mb-6">
      <View>
        <Text className="text-white text-2xl font-bold">Search</Text>
        <Text className="text-yellow-100">Find your products</Text>
      </View>
      <View className="flex-row">
        <TouchableOpacity 
          onPress={() => router.push('/products/add')}
          className="bg-yellow-400 p-2 rounded-full"
        >
          <Plus color="white" size={24} />
        </TouchableOpacity>
        <TouchableOpacity className="bg-yellow-400 p-2 rounded-full ml-2">
          <Package color="white" size={24} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SearchHeader;