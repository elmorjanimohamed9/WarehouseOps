import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Clock } from 'lucide-react-native';

interface RecentProductCardProps {
  product: {
    id: number;
    name: string;
    type: string;
    price: number;
    image: string;
    editedBy: Array<{
      at: string;
    }>;
  };
  onPress: () => void;
}

const RecentProductCard = ({ product, onPress }: RecentProductCardProps) => {
  const formattedDate = new Date(product.editedBy[0]?.at).toLocaleDateString();

  return (
    <TouchableOpacity 
      onPress={onPress}
      className="bg-white rounded-2xl mr-4 w-48 overflow-hidden shadow-sm"
    >
      {/* Product Image */}
      <Image
        source={{ uri: product.image }}
        className="w-full h-32"
        resizeMode="cover"
      />
      
      {/* Content */}
      <View className="p-3">
        <Text className="text-base font-bold text-gray-900" numberOfLines={1}>
          {product.name}
        </Text>
        
        <Text className="text-sm text-gray-500 mb-2">
          {product.type}
        </Text>
        
        <Text className="text-yellow-500 font-bold">
          ${product.price.toLocaleString()}
        </Text>

        {/* Date Added */}
        <View className="flex-row items-center mt-2">
          <Clock size={12} color="#9CA3AF" />
          <Text className="text-xs text-gray-400 ml-1">
            Added {formattedDate}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default RecentProductCard;