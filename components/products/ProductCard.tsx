import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Tag, AlertCircle } from "lucide-react-native";

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
  const totalStock = product.stocks.reduce((sum, stock) => sum + stock.quantity, 0);
  const isInStock = totalStock > 0;
  const hasDiscount = product.solde && product.solde < product.price;

  return (
    <TouchableOpacity
      testID="product-card-touchable"
      onPress={onPress}
      className="bg-white rounded-3xl mb-4 overflow-hidden shadow-sm border border-gray-100"
    >
      <View className="flex-row p-4">
        {/* Image Container */}
        <View className="relative w-28 h-28">
          <Image
            source={{ uri: product.image }}
            className="w-full h-full rounded-2xl"
            resizeMode="cover"
          />
          {/* Stock Badge */}
          <View className="absolute -top-1 -right-1">
            <View
              className={`px-3 py-1.5 rounded-full flex-row items-center ${
                isInStock ? "bg-green-500" : "bg-red-500"
              }`}
            >
              <View className="w-2 h-2 rounded-full mr-1.5 bg-white/80 animate-pulse" />
              <Text className="text-white text-xs font-medium">
                {isInStock ? `${totalStock} in stock` : "Out of stock"}
              </Text>
            </View>
          </View>
          {/* Subtle Gradient Overlay */}
          <View className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/10 to-transparent" />
        </View>

        {/* Content Container */}
        <View className="flex-1 ml-4 justify-between">
          {/* Product Info */}
          <View>
            <Text className="text-lg font-bold text-gray-900 mb-1" numberOfLines={1}>
              {product.name}
            </Text>
            <View className="flex-row items-center mb-2">
              <Tag size={14} color="#9CA3AF" />
              <Text className="text-sm text-gray-500 ml-1.5">{product.type}</Text>
            </View>
          </View>

          {/* Price and Supplier */}
          <View>
            <View className="flex-row items-baseline mb-1">
              <Text className="text-lg font-bold text-yellow-500">
                {product.price.toLocaleString()} MAD
              </Text>
              {hasDiscount && (
                <Text className="text-xs text-gray-400 line-through ml-2">
                  {product.solde?.toLocaleString()} MAD
                </Text>
              )}
            </View>
            <View className="flex-row items-center justify-between">
              <View className="bg-yellow-50 px-3 py-1.5 rounded-xl">
                <Text className="text-yellow-700 text-xs font-medium">
                  {product.supplier}
                </Text>
              </View>
              {product.stocks.length > 0 && (
                <Text className="text-xs text-gray-500">
                  {product.stocks[0].localisation.city}
                </Text>
              )}
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;