import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import {
  MapPin,
  Users,
  Package,
  Clock,
  ChevronRight,
  ArrowLeft,
  Settings,
  BoxIcon,
  AlertTriangle,
  Building2,
  BarChart2,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Product } from "@/types/product";
import QuickActionButton from "@/components/common/QuickActionButton";
import StatCard from "@/components/common/StatCard";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const WarehouseDetailsScreen = () => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouseStats, setWarehouseStats] = useState({
    totalProducts: 0,
    outOfStock: 0,
    totalValue: 0,
    capacity: 500,
    staff: 8,
    efficiency: 92,
  });

  useEffect(() => {
    fetchWarehouseData();
  }, [user?.warehouseId]);

  const fetchWarehouseData = async () => {
    if (!user?.warehouseId) return;
    try {
      const response = await fetch(`${API_URL}/products`);
      const data = await response.json();
      const warehouseProducts = data.filter((product: Product) =>
        product.stocks.some((stock) => stock.id === user.warehouseId)
      );
      setProducts(warehouseProducts);
      calculateStats(warehouseProducts);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching warehouse data:", error);
      setLoading(false);
    }
  };

  const calculateStats = (warehouseProducts: Product[]) => {
    if (!user) return;
    const stats = {
      totalProducts: warehouseProducts.length,
      outOfStock: warehouseProducts.filter((p) => {
        const stock = p.stocks.find((s) => s.id === user.warehouseId);
        return stock?.quantity === 0;
      }).length,
      totalValue: warehouseProducts.reduce((sum, p) => {
        const stock = p.stocks.find((s) => s.id === user.warehouseId);
        return sum + (stock ? stock.quantity * p.price : 0);
      }, 0),
      capacity: 500,
      staff: 8,
      efficiency: 92,
    };
    setWarehouseStats(stats);
  };

  if (!user || loading) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center">
        {!user ? (
          <Text>Please log in to view warehouse details</Text>
        ) : (
          <LoadingSpinner />
        )}
      </View>
    );
  }

  const warehouseName = user.warehouseId === 1999 ? "Gueliz B2" : "Lazari H2";

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header Section */}
      <View className="bg-yellow-500 pt-10 pb-6 px-6 rounded-b-[32px]">
        <View className="flex-row justify-between items-center mb-6">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
          >
            <ArrowLeft color="white" size={24} />
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-between items-end">
          <View>
            <Text className="text-white text-3xl font-bold mb-2">
              {warehouseName}
            </Text>
            <View className="flex-row items-center">
              <MapPin size={16} color="white" />
              <Text className="text-white/90 ml-1">{user.city}</Text>
            </View>
          </View>
          <View className="items-end">
            <View className="bg-white/20 px-3 py-1 rounded-full">
              <Text className="text-white font-medium">
                {warehouseStats.efficiency}% Efficiency
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Rest of the component remains the same */}
      <ScrollView className="flex-1 px-6 pt-6">
        {/* Stats Row - Horizontal Scroll */}
        <View className="mb-2">
          <StatCard
            icon={Package}
            title="Total Products"
            value={warehouseStats.totalProducts}
            bgColor="#6366f1"
            trend={12}
          />
          <StatCard
            icon={AlertTriangle}
            title="Out of Stock"
            value={warehouseStats.outOfStock}
            bgColor="#ef4444"
          />
          <StatCard
            icon={Building2}
            title="Total Value"
            value={Math.round(warehouseStats.totalValue).toLocaleString()}
            suffix="MAD"
            bgColor="#10b981"
            trend={8}
          />
        </View>

        {/* Recent Products */}
        <View className="bg-white rounded-3xl mb-6 p-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-gray-900">
              Recent Products
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/products")}
              className="flex-row items-center"
            >
              <Text className="text-yellow-500 mr-1">View All</Text>
              <ChevronRight size={16} color="#eab308" />
            </TouchableOpacity>
          </View>

          {products.slice(0, 3).map((product) => (
            <TouchableOpacity
              key={product.id}
              className="bg-gray-50/50 p-4 rounded-2xl mb-3 last:mb-0"
              onPress={() => router.push(`/products/${product.id}`)}
            >
              <View className="flex-row items-center">
                <View className="rounded-xl">
                  <Image
                    source={{ uri: product.image }}
                    className="w-20 h-20 rounded-xl"
                  />
                </View>

                {/* Product Details */}
                <View className="flex-1 ml-4">
                  <View className="flex-row justify-between items-start">
                    <Text className="text-gray-900 font-bold text-lg flex-1 mb-1">
                      {product.name}
                    </Text>
                    <ChevronRight size={20} color="#eab308" />
                  </View>

                  {/* Stats Row */}
                  <View className="flex-row items-center mt-2 space-x-3">
                    {/* Stock Badge */}
                    <View className="bg-white px-3 py-1.5 rounded-full border border-gray-100 flex-row items-center">
                      <Package size={14} color="#6B7280" />
                      <Text className="text-gray-600 text-sm font-medium ml-1">
                        {product.stocks.find((s) => s.id === user.warehouseId)
                          ?.quantity || 0}{" "}
                        units
                      </Text>
                    </View>

                    {/* Price Badge */}
                    <View className="bg-green-100 px-3 py-1.5 rounded-full flex-row items-center">
                      <Text className="text-green-500 font-semibold">
                        {product.price.toLocaleString()} MAD
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions */}
        <View className="bg-white rounded-3xl mb-6 p-2">
          <QuickActionButton
            icon={BoxIcon}
            title="Stock Management"
            subtitle="Update inventory levels"
            color="#6366f1"
            onPress={() => router.push("/settings/stock-management")}
          />
          <QuickActionButton
            icon={Users}
            title="Team Members"
            subtitle="Manage warehouse staff"
            color="#10b981"
            onPress={() => router.push("/team")}
          />
          <QuickActionButton
            icon={BarChart2}
            title="Analytics"
            subtitle="View performance metrics"
            color="#f59e0b"
            onPress={() => router.push("/analytics")}
          />
          <QuickActionButton
            icon={Settings}
            title="Settings"
            subtitle="Configure warehouse"
            color="#8b5cf6"
            onPress={() => router.push("/settings")}
            isLast
          />
        </View>

        {/* Last Update Info */}
        <View className="bg-gray-100 p-4 rounded-2xl flex-row items-center mb-6">
          <Clock size={20} color="#6B7280" />
          <Text className="text-gray-600 ml-2">
            Last updated {new Date().toLocaleDateString()}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default WarehouseDetailsScreen;