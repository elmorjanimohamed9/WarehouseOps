import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { ArrowUp, ArrowDown } from 'lucide-react-native';
import { SortOption } from '../../types/search.types';

interface FilterPanelProps {
  productTypes: string[];
  filterType: string;
  onFilterTypeChange: (type: string) => void;
  sortOptions: SortOption[];
  sortBy: string;
  sortOrder: string;
  onSortChange: (option: string) => void;
  onSortOrderChange: (order: 'asc' | 'desc') => void;
}

const FilterPanel = ({
  productTypes,
  filterType,
  onFilterTypeChange,
  sortOptions,
  sortBy,
  sortOrder,
  onSortChange,
  onSortOrderChange,
}: FilterPanelProps) => (
  <View className="bg-white mx-6 mt-4 p-4 rounded-2xl shadow-md">
    <View className="mb-6">
      <Text className="text-sm font-medium text-gray-700 mb-3">Categories</Text>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
        {productTypes.map(type => (
          <TouchableOpacity
            key={type}
            onPress={() => onFilterTypeChange(type)}
            className={`px-4 py-2 rounded-full mr-2 ${
              filterType === type ? 'bg-yellow-500' : 'bg-gray-100'
            }`}
          >
            <Text className={`capitalize ${
              filterType === type ? 'text-white' : 'text-gray-700'
            }`}>
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>

    <View>
      <Text className="text-sm font-medium text-gray-700 mb-3">Sort by</Text>
      <View className="flex-row flex-wrap gap-2">
        {sortOptions.map(option => (
          <TouchableOpacity
            key={option.id}
            onPress={() => {
              if (sortBy === option.id) {
                onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc');
              } else {
                onSortChange(option.id);
                onSortOrderChange('asc');
              }
            }}
            className={`flex-row items-center px-4 py-2 rounded-full ${
              sortBy === option.id ? 'bg-yellow-500' : 'bg-gray-100'
            }`}
          >
            <option.icon size={16} color={sortBy === option.id ? 'white' : '#6B7280'} />
            <Text className={`ml-2 ${sortBy === option.id ? 'text-white' : 'text-gray-700'}`}>
              {option.label}
            </Text>
            {sortBy === option.id && (
              <View className="ml-2">
                {sortOrder === 'asc' ? (
                  <ArrowUp size={14} color="white" />
                ) : (
                  <ArrowDown size={14} color="white" />
                )}
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  </View>
);

export default FilterPanel;