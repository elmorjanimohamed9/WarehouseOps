import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { X } from 'lucide-react-native';

interface ActiveFiltersProps {
  filterType: string;
  sortBy: string;
  sortOrder: string;
  onClearFilter: () => void;
  onClearSort: () => void;
}

const ActiveFilters = ({
  filterType,
  sortBy,
  sortOrder,
  onClearFilter,
  onClearSort
}: ActiveFiltersProps) => {
  if (filterType === 'all' && sortBy === 'name') return null;

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      className="mt-4"
    >
      {filterType !== 'all' && (
        <View className="bg-white/90 rounded-full flex-row items-center px-3 py-1.5 mr-2">
          <Text className="text-yellow-600 font-medium capitalize">{filterType}</Text>
          <TouchableOpacity onPress={onClearFilter} className="ml-2">
            <X size={14} color="#EAB308" />
          </TouchableOpacity>
        </View>
      )}

      {sortBy !== 'name' && (
        <View className="bg-white/90 rounded-full flex-row items-center px-3 py-1.5 mr-2">
          <Text className="text-yellow-600 font-medium capitalize">
            {sortBy} {sortOrder === 'asc' ? '↑' : '↓'}
          </Text>
          <TouchableOpacity onPress={onClearSort} className="ml-2">
            <X size={14} color="#EAB308" />
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

export default ActiveFilters;