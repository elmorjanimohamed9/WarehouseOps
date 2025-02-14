import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

interface QuickActionButtonProps {
  icon: React.ComponentType<{ size: number; color: string }>;
  title: string;
  subtitle: string;
  color: string;
  onPress: () => void;
  isLast?: boolean;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({ 
  icon: Icon, 
  title, 
  subtitle, 
  color, 
  onPress,
  isLast 
}) => {
  return (
    <TouchableOpacity 
      className={`p-4 flex-row items-center ${!isLast && 'border-b border-gray-100'}`}
      onPress={onPress}
    >
      <View 
        style={{ backgroundColor: `${color}10` }} 
        className="w-12 h-12 rounded-2xl items-center justify-center"
      >
        <Icon size={24} color={color} />
      </View>
      
      <View className="flex-1 ml-4">
        <Text className="text-gray-900 font-semibold text-lg">{title}</Text>
        <Text className="text-gray-500">{subtitle}</Text>
      </View>
      
      <View 
        style={{ backgroundColor: `${color}10` }} 
        className="w-8 h-8 rounded-xl items-center justify-center"
      >
        <ChevronRight size={20} color={color} />
      </View>
    </TouchableOpacity>
  );
};

export default QuickActionButton;