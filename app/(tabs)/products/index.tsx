import React, { useState } from 'react';
import { SafeAreaView, View, RefreshControl, ScrollView } from 'react-native';
import { Search, Filter, Tag, ArrowUpDown, Package, Truck } from 'lucide-react-native';

import SearchHeader from '@/components/search/SearchHeader';
import SearchInput from '@/components/common/Input';
import ActiveFilters from '@/components/search/ActiveFilters';
import FilterPanel from '@/components/search/FilterPanel';
import ProductList from '@/components/products/ProductList';
import LoadingScreen from '@/components/common/Loading';
import { useProducts } from '@/hooks/useProducts';
import { Product, SortOption } from '@/types/search.types';

const sortOptions: SortOption[] = [
  { id: 'name', label: 'Name', icon: Tag },
  { id: 'price', label: 'Price', icon: ArrowUpDown },
  { id: 'quantity', label: 'Quantity', icon: Package },
  { id: 'supplier', label: 'Supplier', icon: Truck },
];

const ProductScreen = () => {
  const { products, loading, error, refreshProducts } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterType, setFilterType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const onRefresh = async () => {
    setIsRefreshing(true);
    await refreshProducts();
    setIsRefreshing(false);
  };

  if (loading && !isRefreshing) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <ScrollView 
        contentContainerStyle={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        <View className="flex-1 items-center justify-center">
          <Text>Error loading products. Pull down to refresh.</Text>
        </View>
      </ScrollView>
    );
  }

  const productTypes = ['all', ...new Set(products.map(product => product.type))];

  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.supplier.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === 'all' || product.type === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'quantity':
          comparison = (
            a.stocks.reduce((sum, stock) => sum + stock.quantity, 0) -
            b.stocks.reduce((sum, stock) => sum + stock.quantity, 0)
          );
          break;
        case 'supplier':
          comparison = a.supplier.localeCompare(b.supplier);
          break;
        default:
          comparison = a.name.localeCompare(b.name);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const handleProductPress = (product: Product) => {
    console.log('Selected product:', product.id);
  };

  const handleFilterChange = (type: string) => {
    setFilterType(type);
  };

  const handleSortChange = (sort: string) => {
    if (sortBy === sort) {
      setSortOrder(current => current === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(sort);
      setSortOrder('asc');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={['#EAB308']}
            tintColor="#EAB308"
          />
        }
      >
        <View className="flex-1">
          <View className="bg-yellow-500 pt-12 pb-6 px-6 rounded-b-[32px]">
            <SearchHeader />

            <SearchInput
              placeholder="Search products..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              leftIcon={Search}
              rightIcon={Filter}
              rightIconProps={{
                isActive: showFilters,
                onPress: () => setShowFilters(!showFilters)
              }}
            />

            <ActiveFilters
              filterType={filterType}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onClearFilter={() => setFilterType('all')}
              onClearSort={() => setSortBy('name')}
            />
          </View>

          {showFilters && (
            <FilterPanel
              productTypes={productTypes}
              filterType={filterType}
              onFilterTypeChange={handleFilterChange}
              sortOptions={sortOptions}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSortChange={handleSortChange}
              onSortOrderChange={setSortOrder}
            />
          )}

          <ProductList 
            products={filteredProducts}
            onProductPress={handleProductPress}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProductScreen;