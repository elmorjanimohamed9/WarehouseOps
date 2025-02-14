import React from 'react';
import { View, Text } from 'react-native';
import { TrendingUp } from 'lucide-react-native';

interface StatCardProps {
  icon: React.ComponentType<{ size: number; color: string }>;
  title: string;
  value: string | number;
  suffix?: string;
  bgColor: string;
  trend?: number;
}

const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  title,
  value,
  suffix,
  bgColor,
  trend,
}) => (
  <View className="bg-white p-6 rounded-3xl mb-2 border border-gray-100 shadow-sm">
    <View className="flex-row justify-between items-center">
      <View className="flex-row items-center flex-1">
        <View
          className="w-12 h-12 rounded-2xl items-center justify-center"
          style={{ backgroundColor: bgColor }}
        >
          <Icon size={24} color="white" />
        </View>
        <View className="ml-4 flex-1">
          <Text className="text-gray-600 text-base font-medium">{title}</Text>
          <View className="flex-row items-center mt-1">
            <Text className="text-gray-900 text-xl font-bold">{value}</Text>
            {suffix && (
              <Text className="text-gray-500 text-sm ml-1">{suffix}</Text>
            )}
          </View>
        </View>
      </View>
      {trend && (
        <View className="bg-emerald-50 px-3 py-1.5 rounded-full flex-row items-center">
          <TrendingUp size={14} color="#059669" />
          <Text className="text-emerald-600 text-sm font-medium ml-1">
            +{trend}%
          </Text>
        </View>
      )}
    </View>
  </View>
);

export default StatCard;