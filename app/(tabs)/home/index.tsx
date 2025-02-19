import React, { useCallback } from "react";
import { View, Text, ScrollView, SafeAreaView, RefreshControl, TouchableOpacity } from "react-native";
import { 
  Boxes, 
  AlertTriangle, 
  DollarSign, 
  Clock, 
  TrendingUp, 
  Package, 
  ArrowRight,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import { Product } from "@/types/home.types";
import RecentProductCard from "@/components/products/RecentProductCard";
import { useProducts } from "@/hooks/useProducts";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Header from '@/components/common/Header';
import * as Haptics from 'expo-haptics';

// Types
type StatCardProps = {
  icon: React.FC<{ size: number; color: string }>;
  title: string;
  value: string | number;
  color: string;
  trend?: number;
  description?: string;
};

// Components
const StatCard: React.FC<StatCardProps> = ({ 
  icon: Icon, 
  title, 
  value, 
  color, 
  trend, 
  description 
}) => (
  <View className="bg-white p-5 rounded-3xl flex-1 shadow-sm border border-gray-100">
    <View className="flex-row items-center justify-between mb-3">
      <View className={`w-12 h-12 ${color} rounded-2xl items-center justify-center`}>
        <Icon size={24} color="white" />
      </View>
      {trend != null && (
        <View className="bg-green-50 px-3 py-1 rounded-full flex-row items-center">
          <TrendingUp size={14} color="#10B981" />
          <Text className="text-green-600 text-xs ml-1 font-medium">+{trend}%</Text>
        </View>
      )}
    </View>
    <Text className="text-gray-500 text-sm mb-1">{title}</Text>
    <Text className="text-2xl font-bold text-gray-900 mb-1">{value}</Text>
    {description && (
      <Text className="text-gray-400 text-xs">{description}</Text>
    )}
  </View>
);

const RecentUpdatesHeader = () => (
  <View className="flex-row items-center justify-between mb-6">
    <View className="flex-row items-center">
      <View className="bg-yellow-50 p-2 rounded-xl mr-3">
        <Clock size={20} color="#EAB308" />
      </View>
      <View>
        <Text className="text-lg font-bold text-gray-900">Recent Updates</Text>
        <Text className="text-sm text-gray-500">Your latest product modifications</Text>
      </View>
    </View>
  </View>
);

const EmptyStateView = () => (
  <View className="items-center justify-center py-8 px-4">
    <View className="bg-gray-50 p-4 rounded-full mb-3">
      <Package size={28} color="#9CA3AF" />
    </View>
    <Text className="text-gray-900 font-medium mb-1">No Recent Activity</Text>
    <Text className="text-gray-500 text-sm text-center">
      Products you modify will appear here for quick access
    </Text>
  </View>
);

// Business Logic
const useWarehouseStats = (products: Product[], warehouseId: string) => {
  const filteredProducts = products.filter(product =>
    product.stocks.some(stock => stock.id === Number(warehouseId))
  );

  return {
    totalProducts: filteredProducts.length,
    outOfStock: filteredProducts.filter(product =>
      product.stocks.find(stock => 
        stock.id === Number(warehouseId) && stock.quantity === 0
      )
    ).length,
    totalValue: filteredProducts.reduce((sum, product) => {
      const stock = product.stocks.find(s => s.id === Number(warehouseId));
      return sum + (stock ? stock.quantity * product.price : 0);
    }, 0)
  };
};

const HomeScreen: React.FC = () => {
  const { products, loading, refreshProducts } = useProducts();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);

  const onRefresh = useCallback(() => {
    refreshProducts();
  }, [refreshProducts]);

  if (!user?.warehouseId || !user?.id) return null;

  const stats = useWarehouseStats(products, user.warehouseId.toString());
  const recentProducts = products
    .filter(product => 
      product.editedBy.some(edit => edit.warehousemanId.toString() === user.id)
    )
    .sort((a, b) => 
      new Date(b.editedBy[0]?.at).getTime() - new Date(a.editedBy[0]?.at).getTime()
    )
    .slice(0, 3);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} colors={["#EAB308"]} />
        }
      >
        <Header user={user} onRefresh={onRefresh} />

        <View className="p-6">
          {/* Warehouse Stats */}
          <View className="mb-8">
            <View className="flex-row gap-4 mb-4">
              <StatCard
                icon={Boxes}
                title="Total Products"
                value={stats.totalProducts}
                color="bg-blue-500"
                trend={12}
                description="Active products in warehouse"
              />
              <StatCard
                icon={AlertTriangle}
                title="Out of Stock"
                value={stats.outOfStock}
                color="bg-red-500"
                description="Products need attention"
              />
            </View>
            <StatCard
              icon={DollarSign}
              title="Total Stock Value"
              value={`${stats.totalValue.toLocaleString()} MAD`}
              color="bg-purple-500"
              trend={8}
              description="Current inventory value"
            />
          </View>

          {/* Recent Updates Section */}
          <View className="bg-white p-6 mb-14 rounded-3xl shadow-sm border border-gray-100">
            <RecentUpdatesHeader />
            
            {recentProducts.length > 0 ? (
              <View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    paddingHorizontal: 2,
                    paddingBottom: 8
                  }}
                  className="-mx-2"
                  decelerationRate="fast"
                  snapToInterval={280}
                  snapToAlignment="start"
                >
                  {recentProducts.map((product, index) => (
                    <View 
                      key={product.id}
                      className={`${index !== 0 ? 'ml-4' : ''}`}
                      style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.05,
                        shadowRadius: 5,
                        elevation: 2
                      }}
                    >
                      <RecentProductCard
                        product={product}
                        onPress={() => {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                          router.push(`/products/${product.id}`);
                        }}
                      />
                    </View>
                  ))}
                  
                  <TouchableOpacity
                    className="w-[120px] ml-4 bg-gray-50 rounded-3xl justify-center items-center"
                    onPress={() => router.push('/products')}
                  >
                    <View className="items-center justify-center p-4">
                      <View className="bg-white p-3 rounded-full mb-3 shadow-sm">
                        <ArrowRight size={20} color="#4B5563" />
                      </View>
                      <Text className="text-gray-600 font-medium text-sm">View All</Text>
                      <Text className="text-gray-400 text-xs">Products</Text>
                    </View>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            ) : (
              <EmptyStateView />
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;