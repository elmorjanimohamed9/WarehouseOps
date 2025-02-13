import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import {
  Package,
  Boxes,
  Building2,
  AlertTriangle,
  DollarSign,
  PlusCircle,
  Clock,
  TrendingUp,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { Statistics, Product } from "@/types/home.types";
import RecentProductCard from "@/components/products/RecentProductCard";

const HomeScreen = () => {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeWarehouse, setActiveWarehouse] = useState("all");
  const navigation = useNavigation();
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsResponse, productsResponse] = await Promise.all([
        fetch("http://172.16.11.195:3000/statistics"),
        fetch("http://172.16.11.195:3000/products"),
      ]);
      const statsData = await statsResponse.json();
      const productsData = await productsResponse.json();
      setStatistics(statsData);
      setProducts(productsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleAddProduct = (product: Product) => {
    setProducts((prev) => [product, ...prev]);
    fetchData(); // Refresh data after adding new product
  };

  const warehouses = [
    { id: "all", name: "All Warehouses" },
    { id: "1999", name: "Marrakesh" },
    { id: "2991", name: "Oujda" },
  ];

  const filteredProducts = products.filter((product) => {
    if (activeWarehouse === "all") return true;
    return product.stocks.some(
      (stock) => stock.id.toString() === activeWarehouse
    );
  });

  const sortedProducts = [...filteredProducts].sort(
    (a, b) =>
      new Date(b.editedBy[0]?.at).getTime() -
      new Date(a.editedBy[0]?.at).getTime()
  );
  const recentProducts = sortedProducts.slice(0, 3);

  const StatCard = ({ icon: Icon, title, value, color, trend }: any) => (
    <View className="bg-white p-4 rounded-2xl flex-1 shadow-sm">
      <View className="flex-row items-center justify-between mb-2">
        <View
          className={`w-10 h-10 ${color} rounded-full items-center justify-center`}
        >
          <Icon size={20} color="white" />
        </View>
        {trend && (
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

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* Header Section */}
        <View className="bg-yellow-500 pt-12 pb-6 px-6 rounded-b-[32px]">
          <View className="flex-row items-center justify-between mb-6">
            <View>
              <Text className="text-white text-2xl font-bold">
                WarehouseOps
              </Text>
              <Text className="text-yellow-100">Welcome back, Manager</Text>
            </View>
            <TouchableOpacity className="bg-yellow-400 p-2 rounded-full">
              <Package color="white" size={24} />
            </TouchableOpacity>
          </View>

          {/* Warehouse Selector */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row -mx-2"
          >
            {warehouses.map((warehouse) => (
              <TouchableOpacity
                key={warehouse.id}
                onPress={() => setActiveWarehouse(warehouse.id)}
                className={`px-4 py-2 rounded-full mr-2 ${
                  activeWarehouse === warehouse.id
                    ? "bg-white"
                    : "bg-yellow-400/50"
                }`}
              >
                <Text
                  className={
                    activeWarehouse === warehouse.id
                      ? "text-yellow-500 font-medium"
                      : "text-white"
                  }
                >
                  {warehouse.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View className="p-6">
          {/* Quick Actions */}
          <View className="bg-yellow-500 p-4 rounded-2xl flex-row items-center justify-between mb-6">
            <View className="flex-1">
              <Text className="text-white text-lg font-bold mb-1">
                Add New Product
              </Text>
              <Text className="text-yellow-100 text-sm">
                Create and manage your inventory items
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => router.push("/products/add")}
              className="bg-yellow-400 p-3 rounded-xl active:bg-yellow-300"
              activeOpacity={0.8}
            >
              <PlusCircle color="white" size={24} />
            </TouchableOpacity>
          </View>

          {/* Statistics Grid */}
          <View className="mb-6">
            <View className="flex-row gap-4 mb-4">
              <StatCard
                icon={Boxes}
                title="Total Products"
                value={statistics?.totalProducts || 0}
                color="bg-blue-500"
                trend="12"
              />
              <StatCard
                icon={AlertTriangle}
                title="Out of Stock"
                value={statistics?.outOfStock || 0}
                color="bg-red-500"
              />
            </View>

            <View className="flex-row gap-4">
              <StatCard
                icon={Building2}
                title="Total Cities"
                value="2"
                color="bg-green-500"
              />
              <StatCard
                icon={DollarSign}
                title="Stock Value"
                value={`$${statistics?.totalStockValue || 0}k`}
                color="bg-purple-500"
                trend="8"
              />
            </View>
          </View>

          {/* Recent Products */}
          <View>
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center">
                <Clock size={20} color="#4B5563" />
                <Text className="text-lg font-bold text-gray-900 ml-2">
                  Recently Added
                </Text>
              </View>
            </View>

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
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
