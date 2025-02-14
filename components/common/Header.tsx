import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Package, Bell } from "lucide-react-native";

interface User {
  image?: string;
  name?: string;
  city?: string;
  secretKey?: string;
  warehouseId?: string;
}

interface HeaderProps {
  user?: User;
  onRefresh: () => void;
}

const Header = ({ user, onRefresh }: HeaderProps) => {
  return (
    <View className="bg-yellow-500 pt-12 pb-6 px-6 rounded-b-[32px]">
      {/* Top Row with Profile and Actions */}
      <View className="flex-row items-center justify-between mb-6">
        <View className="flex-row items-center">
          <Image
            source={{ uri: user?.image }}
            className="w-12 h-12 rounded-full border-2 border-white"
          />
          <View className="ml-3">
            <Text className="text-white text-2xl font-bold">
              {user?.name}
            </Text>
            <View className="flex-row items-center">
              <View className="w-2 h-2 bg-green-400 rounded-full mr-2" />
              <Text className="text-yellow-100">
                {user?.city} Branch
              </Text>
            </View>
          </View>
        </View>
        
        {/* Action Buttons */}
        <View className="flex-row items-center">
          <TouchableOpacity 
            className="bg-yellow-400 p-2 rounded-full mr-3"
          >
            <Bell color="white" size={24} />
          </TouchableOpacity>
          <TouchableOpacity 
            className="bg-yellow-400 p-2 rounded-full"
            onPress={onRefresh}
          >
            <Package color="white" size={24} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Stats Row */}
      <View className="flex-row justify-between mt-4 bg-yellow-400 rounded-xl p-4">
        <View className="items-center">
          <Text className="text-yellow-100 text-sm">Secret Key</Text>
          <Text className="text-white font-bold">{user?.secretKey}</Text>
        </View>
        <View className="items-center border-l border-yellow-300 px-4">
          <Text className="text-yellow-100 text-sm">Warehouse ID</Text>
          <Text className="text-white font-bold">#{user?.warehouseId}</Text>
        </View>
        <View className="items-center">
          <Text className="text-yellow-100 text-sm">Status</Text>
          <Text className="text-white font-bold">Active</Text>
        </View>
      </View>
    </View>
  );
};

export default Header;