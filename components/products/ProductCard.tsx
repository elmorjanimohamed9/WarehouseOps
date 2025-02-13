import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Package, Tag } from "lucide-react-native";

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    type: string;
    price: number;
    solde?: number;
    image: string;
    supplier: string;
    stocks: Array<{
      quantity: number;
      localisation: {
        city: string;
      };
    }>;
  };
  onPress: () => void;
}

const ProductCard = ({ product, onPress }: ProductCardProps) => {
  const isInStock = product.stocks.length > 0;
  const totalStock = product.stocks.reduce(
    (sum, stock) => sum + stock.quantity,
    0
  );

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-2xl mb-4 overflow-hidden shadow-sm"
    >
      <View className="flex-row p-3">
        {/* Image Section */}
        <View className="relative w-24 h-24">
          <Image
            source={{ uri: product.image }}
            className="w-full h-full rounded-xl"
            resizeMode="cover"
          />
          {/* Stock Indicator */}
          <View className="absolute -top-1 -right-1">
            <View
              className={`px-2 py-1 rounded-full flex-row items-center ${
                isInStock ? "bg-green-500/90" : "bg-red-500/90"
              }`}
            >
              <View
                className={`w-1.5 h-1.5 rounded-full mr-1 ${
                  isInStock ? "bg-green-200" : "bg-red-200"
                } animate-pulse`}
              />
              <Text className="text-white text-[10px] font-medium">
                {isInStock ? (
                  <Text>
                    <Text className="font-bold">{totalStock}</Text>
                    <Text className="font-normal"> in stock</Text>
                  </Text>
                ) : (
                  "Out of stock"
                )}
              </Text>
            </View>
          </View>
          {/* Gradient Overlay */}
          <View className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/20 to-transparent" />
        </View>

        {/* Content Section */}
        <View className="flex-1 ml-3 justify-between">
          <View>
            <Text
              className="text-base font-bold text-gray-900 mb-1"
              numberOfLines={1}
            >
              {product.name}
            </Text>
            <View className="flex-row items-center">
              <Tag size={14} color="#9CA3AF" />
              <Text className="text-xs text-gray-500 ml-1">{product.type}</Text>
            </View>
          </View>

          <View className="flex-row items-center justify-between mt-2">
            <View>
              <Text className="text-yellow-500 font-bold text-base">
                ${product.price.toLocaleString()}
              </Text>
              {product.solde && (
                <Text className="text-xs text-gray-400 line-through">
                  ${product.solde.toLocaleString()}
                </Text>
              )}
            </View>
            <View className="bg-yellow-50 px-2 py-1 rounded-lg">
              <Text className="text-yellow-700 text-xs">
                {product.supplier}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;
