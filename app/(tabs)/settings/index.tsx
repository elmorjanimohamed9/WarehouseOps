import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
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
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { logout } from '@/store/slices/authSlice';
import { clearAuthData } from '@/utils/auth';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { generateProductsHTML } from '@/utils/reportGenerator';
import { useProducts } from '@/hooks/useProducts';

const SettingsScreen = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const { products } = useProducts();

  const handleLogout = async () => {
    await clearAuthData();
    dispatch(logout());
    router.replace('/login');
  };

  const handleExportReport = async () => {
    try {
      const html = generateProductsHTML(products, {
        title: 'Warehouse Inventory Report',
        currency: 'MAD',
        primaryColor: '#eab308'
      });
  
      const { uri } = await Print.printToFileAsync({
        html,
        base64: false
      });
      
      await Sharing.shareAsync(uri, {
        UTI: '.pdf',
        mimeType: 'application/pdf'
      });
  
    } catch (error) {
      console.error('Error generating report:', error);
      Alert.alert('Error', 'Failed to generate report');
    }
  };

  const SettingItem = ({ icon: Icon, title, subtitle, action }: {
    icon: React.ComponentType<{ size: number; color: string }>;
    title: string;
    subtitle?: string;
    action: () => void;
  }) => (
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
    <ScrollView 
      className="flex-1 bg-gray-50 pt-12 mb-4 px-6" 
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <Text className="text-2xl font-bold text-gray-900 mb-6">Settings</Text>
  
      {/* Profile Card */}
      <View className="bg-white p-6 rounded-2xl mb-6 shadow-sm">
        <View className="flex-row items-center">
          {user?.image ? (
            <Image
              source={{ uri: user.image }}
              className="h-16 w-16 rounded-full"
              resizeMode="cover"
            />
          ) : (
            <View className="h-16 w-16 bg-yellow-100 rounded-full items-center justify-center">
              <User size={32} color="#eab308" />
            </View>
          )}
          <View className="ml-4 flex-1">
            <Text className="text-lg font-bold text-gray-900">
              {user?.name || 'User'}
            </Text>
            <Text className="text-gray-500">
              Warehouse Manager • {user?.city || 'Unknown Location'}
            </Text>
          </View>
          <ChevronRight size={20} color="#9CA3AF" />
        </View>
      </View>
  
      {/* Account Settings Section */}
      <Text className="text-base font-semibold text-gray-700 mb-3">
        Account Settings
      </Text>
      <SettingItem
        icon={User}
        title="Profile Information"
        subtitle="Update your account details"
        action={() => {}}
      />
      <SettingItem
        icon={Building2}
        title="Warehouse Details"
        subtitle="Manage warehouse information"
        action={() => router.push('/settings/warehouse-details')}
      />
  
      {/* Preferences Section */}
      <Text className="text-base font-semibold text-gray-700 mb-3 mt-4">
        Preferences
      </Text>
      <SettingItem
        icon={Bell}
        title="Notifications"
        subtitle="Customize your alerts"
        action={() => {}}
      />
      <SettingItem
        icon={FileText}
        title="Reports"
        subtitle="View and export reports"
        action={handleExportReport}
      />
  
      {/* Support Section */}
      <Text className="text-base font-semibold text-gray-700 mb-3 mt-4">
        Support
      </Text>
      <SettingItem
        icon={HelpCircle}
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
        <Text className="flex-1 ml-4 text-red-600 font-semibold">
          Log Out
        </Text>
        <ChevronRight size={20} color="#ef4444" />
      </TouchableOpacity>
    </ScrollView>
  );
};

export default SettingsScreen;