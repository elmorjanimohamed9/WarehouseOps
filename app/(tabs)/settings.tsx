import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { 
  User, 
  Building2, 
  FileText, 
  Bell, 
  HelpCircle,
  LogOut,
  ChevronRight
} from 'lucide-react-native';
import { router } from 'expo-router';

const SettingsScreen = () => {
  const handleLogout = () => {
    router.replace('/login');
  };

  const SettingItem = ({ icon: Icon, title, subtitle, action }: { icon: React.ComponentType<{ size: number, color: string }>, title: string, subtitle?: string, action: () => void }) => (
    <TouchableOpacity 
      onPress={action}
      className="flex-row items-center bg-white p-4 rounded-2xl mb-4"
    >
      <View className="bg-gray-100 p-2 rounded-full">
        <Icon size={24} color="#4B5563" />
      </View>
      <View className="flex-1 ml-4">
        <Text className="text-gray-900 font-semibold">{title}</Text>
        {subtitle && <Text className="text-gray-500 text-sm">{subtitle}</Text>}
      </View>
      <ChevronRight size={20} color="#9CA3AF" />
    </TouchableOpacity>
  );

  return (
    <ScrollView className="flex-1 bg-gray-50 pt-12 px-6" contentContainerStyle={{ paddingBottom: 100 }}>
      <Text className="text-2xl font-bold text-gray-900 mb-6">Settings</Text>
  
      {/* Profile Card */}
      <View className="bg-white p-6 rounded-2xl mb-6 shadow-sm">
        <View className="flex-row items-center">
          <View className="h-16 w-16 bg-yellow-100 rounded-full items-center justify-center">
            <User size={32} color="#eab308" />
          </View>
          <View className="ml-4 flex-1">
            <Text className="text-lg font-bold text-gray-900">John Doe</Text>
            <Text className="text-gray-500">Warehouse Manager</Text>
          </View>
          <ChevronRight size={20} color="#9CA3AF" />
        </View>
      </View>
  
      {/* Account Settings Section */}
      <Text className="text-base font-semibold text-gray-700 mb-3">Account Settings</Text>
      <SettingItem
        icon={User as React.ComponentType<{ size: number, color: string }>}
        title="Profile Information"
        subtitle="Update your account details"
        action={() => {}}
      />
      <SettingItem
        icon={Building2 as React.ComponentType<{ size: number, color: string }>}
        title="Warehouse Details"
        subtitle="Manage warehouse information"
        action={() => {}}
      />
  
      {/* Preferences Section */}
      <Text className="text-base font-semibold text-gray-700 mb-3 mt-4">Preferences</Text>
      <SettingItem
        icon={Bell as React.ComponentType<{ size: number, color: string }>}
        title="Notifications"
        subtitle="Customize your alerts"
        action={() => {}}
      />
      <SettingItem
        icon={FileText as React.ComponentType<{ size: number, color: string }>}
        title="Reports"
        subtitle="View and export reports"
        action={() => {}}
      />
  
      {/* Support Section */}
      <Text className="text-base font-semibold text-gray-700 mb-3 mt-4">Support</Text>
      <SettingItem
        icon={HelpCircle as React.ComponentType<{ size: number, color: string }>}
        title="Help & Support"
        subtitle="Get help and contact us"
        action={() => {}}
      />
  
      {/* Logout Button */}
      <TouchableOpacity 
        onPress={handleLogout}
        className="flex-row items-center bg-red-50 p-4 rounded-2xl mt-6"
      >
        <View className="bg-red-100 p-2 rounded-full">
          <LogOut size={24} color="#ef4444" />
        </View>
        <Text className="flex-1 ml-4 text-red-600 font-semibold">Log Out</Text>
        <ChevronRight size={20} color="#ef4444" />
      </TouchableOpacity>
      </ScrollView>
    );
  };
  
  export default SettingsScreen;