import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import {
  Boxes,
  AlertTriangle,
  DollarSign,
  Clock,
  TrendingUp,
  Icon,
  LucideProps,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import { Product, Statistics } from "@/types/home.types";
import RecentProductCard from "@/components/products/RecentProductCard";
import { useProducts } from "@/hooks/useProducts";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Header from '@/components/common/Header';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

type StatCardProps = {
  icon: React.ComponentType<LucideProps>;
  title: string;
  value: string | number;
  color: string;
  trend?: number;
};

// Extract reusable components
const StatCard: React.FC<StatCardProps> = ({ icon: Icon, title, value, color, trend }) => (
  <View className="bg-white p-4 rounded-2xl flex-1 shadow-sm">
    <View className="flex-row items-center justify-between mb-2">
      <View className={`w-10 h-10 ${color} rounded-full items-center justify-center`}>
        <Icon size={20} color="white" />
      </View>
      {trend != null && (
        <View className="flex-row items-center">
          <TrendingUp size={14} color="#10B981" />
          <Text className="text-green-600 text-xs ml-1">+{trend}%</Text>
        </View>
      )}
    </View>
    <Text className="text-gray-600 text-sm">{title}</Text>
    <Text className="text-xl font-bold text-gray-900">{value}</Text>
  </View>
);

// Extract business logic into separate functions
const calculateWarehouseStats = (products: Product[], warehouseId: string) => {
  const userProducts = filterProductsByWarehouse(products, warehouseId);
  
  return {
    totalProducts: userProducts.length,
    outOfStock: countOutOfStockProducts(userProducts, warehouseId),
    totalValue: calculateTotalStockValue(userProducts, warehouseId),
  };
};

const filterProductsByWarehouse = (products: Product[], warehouseId: string) => 
  products.filter((product) =>
    product.stocks.some((stock) => stock.id === Number(warehouseId))
  );

const countOutOfStockProducts = (products: Product[], warehouseId: string) =>
  products.filter((product) =>
    product.stocks.find((stock) => 
      stock.id === Number(warehouseId) && stock.quantity === 0
    )
  ).length;

const calculateTotalStockValue = (products: Product[], warehouseId: string) =>
  products.reduce((sum, product) => {
    const stock = product.stocks.find((s) => s.id === Number(warehouseId));
    return sum + (stock ? stock.quantity * product.price : 0);
  }, 0);

const getRecentProducts = (products: Product[], userId: string, limit: number) =>
  products
    .filter((product) =>
      product.editedBy.some((edit) => 
        edit.warehousemanId.toString() === userId
      )
    )
    .sort((a, b) =>
      new Date(b.editedBy[0]?.at).getTime() - 
      new Date(a.editedBy[0]?.at).getTime()
    )
    .slice(0, limit);

const HomeScreen: React.FC = () => {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const { products, loading, refreshProducts } = useProducts();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);

  const fetchStatistics = async () => {
    try {
      const response = await fetch(`${API_URL}/statistics`);
      if (!response.ok) throw new Error("Failed to fetch statistics");
      const data: Statistics = await response.json();
      setStatistics(data);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };

  const onRefresh = useCallback(async () => {
    try {
      await Promise.all([refreshProducts(), fetchStatistics()]);
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
  }, [refreshProducts]);

  if (!user?.warehouseId || !user?.id) {
    return null; 
  }

  const warehouseStats = calculateWarehouseStats(products, user.warehouseId.toString());
  const recentProducts = getRecentProducts(products, user.id, 3);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={onRefresh}
            colors={["#EAB308"]}
          />
        }
      >
        <Header user={user} onRefresh={onRefresh} />

        <View className="p-6">
          <View className="mb-6">
            <View className="flex-row gap-4 mb-4">
              <StatCard
                icon={Boxes}
                title="Warehouse Products"
                value={warehouseStats.totalProducts}
                color="bg-blue-500"
              />
              <StatCard
                icon={AlertTriangle}
                title="Out of Stock"
                value={warehouseStats.outOfStock}
                color="bg-red-500"
              />
            </View>
            <View className="flex-row gap-4">
              <StatCard
                icon={DollarSign}
                title="Stock Value"
                value={`${warehouseStats.totalValue.toLocaleString()} MAD`}
                color="bg-purple-500"
              />
            </View>
          </View>

          <View>
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center">
                <Clock size={20} color="#4B5563" />
                <Text className="text-lg font-bold text-gray-900 ml-2">
                  Your Recent Updates
                </Text>
              </View>
            </View>

            {recentProducts.length > 0 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="-mx-6 px-6 mb-14"
              >
                {recentProducts.map((product) => (
                  <RecentProductCard
                    key={product.id}
                    product={product}
                    onPress={() => router.push(`/products/${product.id}`)}
                  />
                ))}
              </ScrollView>
            ) : (
              <View className="items-center justify-center py-8">
                <Text className="text-gray-500">No recent updates</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;