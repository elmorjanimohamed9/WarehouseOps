import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

interface CategoryListProps {
  categories: string[];
  selectedCategory: string;
  onSelect: (category: string) => void;
}

const CategoryList = ({ categories, selectedCategory, onSelect }: CategoryListProps) => {
  return (
    <View className="mb-6">
      <Text className="text-sm font-medium text-gray-700 mb-3">Categories</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        className="flex-row"
      >
        {categories.map(category => (
          <TouchableOpacity
            key={category}
            onPress={() => onSelect(category)}
            className={`px-4 py-2 rounded-full mr-2 ${
              selectedCategory === category ? 'bg-yellow-500' : 'bg-gray-100'
            }`}
          >
            <Text className={`capitalize ${
              selectedCategory === category ? 'text-white' : 'text-gray-700'
            }`}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default CategoryList;