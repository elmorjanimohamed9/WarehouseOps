import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import {
  ArrowLeft,
  HelpCircle,
  Mail,
  MessageCircle,
  Phone,
  FileText,
  ExternalLink,
} from "lucide-react-native";
import { router } from "expo-router";

const HelpSupportScreen = () => {
  const SupportItem = ({ 
    icon: Icon, 
    title, 
    subtitle, 
    action 
  }: {
    icon: any;
    title: string;
    subtitle: string;
    action: () => void;
  }) => (
    <TouchableOpacity
      onPress={action}
      className="flex-row items-center bg-white p-4 rounded-2xl mb-4"
    >
      <View className="bg-yellow-50 p-3 rounded-full">
        <Icon size={24} color="#eab308" />
      </View>
      <View className="flex-1 ml-4">
        <Text className="text-gray-900 font-semibold">{title}</Text>
        <Text className="text-gray-500 text-sm">{subtitle}</Text>
      </View>
      <ExternalLink size={20} color="#9CA3AF" />
    </TouchableOpacity>
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
            Help & Support
          </Text>
          <View className="w-10" />
        </View>

        {/* Support Banner */}
        <View className="items-center -mb-16 z-50">
          <View className="bg-white p-4 rounded-2xl shadow-sm w-full">
            <View className="items-center">
              <HelpCircle size={40} color="#eab308" />
              <Text className="text-gray-900 font-bold text-lg mt-2">
                How can we help you?
              </Text>
              <Text className="text-gray-500 text-center mt-1">
                Choose an option below to get assistance
              </Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView 
        className="flex-1 px-6 pt-20"
        showsVerticalScrollIndicator={false}
      >
        <SupportItem
          icon={MessageCircle}
          title="Live Chat Support"
          subtitle="Chat with our support team"
          action={() => Linking.openURL('https://support.warehouseops.com/chat')}
        />

        <SupportItem
          icon={Mail}
          title="Email Support"
          subtitle="Send us an email"
          action={() => Linking.openURL('mailto:support@warehouseops.com')}
        />

        <SupportItem
          icon={Phone}
          title="Phone Support"
          subtitle="Call our support line"
          action={() => Linking.openURL('tel:+1234567890')}
        />

        <SupportItem
          icon={FileText}
          title="Documentation"
          subtitle="Read our user guides"
          action={() => Linking.openURL('https://docs.warehouseops.com')}
        />

        {/* FAQ Section */}
        <View className="mb-40">
          <Text className="text-base font-semibold text-gray-700 mb-3">
            Frequently Asked Questions
          </Text>
          
          {/* FAQ Items */}
          <View className="bg-white p-4 rounded-2xl">
            <TouchableOpacity className="pb-4 border-b border-gray-100">
              <Text className="text-gray-900 font-medium mb-1">
                How do I update my warehouse details?
              </Text>
              <Text className="text-gray-500 text-sm">
                Navigate to Settings > Warehouse Details to update your information.
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="py-4 border-b border-gray-100">
              <Text className="text-gray-900 font-medium mb-1">
                How to generate reports?
              </Text>
              <Text className="text-gray-500 text-sm">
                Go to Settings > Reports and click on "Export Report" to generate.
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="pt-4">
              <Text className="text-gray-900 font-medium mb-1">
                How to manage inventory?
              </Text>
              <Text className="text-gray-500 text-sm">
                Use the Products tab to add, edit, or remove inventory items.
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default HelpSupportScreen; 