import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Package } from 'lucide-react-native';
import ProductCard from './ProductCard';

interface Product {
  id: number;
  name: string;
  type: string;
  price: number;
  solde?: number;
  supplier: string;
  image: string;
  stocks: Array<{
    id: number;
    name: string;
    quantity: number;
    localisation: {
      city: string;
      latitude: number;
      longitude: number;
    }
  }>;
}

interface ProductListProps {
  products: Product[];
  onProductPress?: (product: Product) => void;
}

const ProductList = ({ products, onProductPress }: ProductListProps) => {
  if (products.length === 0) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <Package size={48} color="#D1D5DB" />
        <Text className="text-gray-400 text-lg font-medium mt-4">
          No products found
        </Text>
        <Text className="text-gray-400 text-center mt-2">
          Try adjusting your search or filters
        </Text>
      </View>
    );
  }

  return (
    <ScrollView 
      className="flex-1 px-6 pt-4" 
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onPress={() => onProductPress?.(product)}
        />
      ))}
    </ScrollView>
  );
};

export default ProductList;