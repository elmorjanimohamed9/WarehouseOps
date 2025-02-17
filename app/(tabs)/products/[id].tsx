import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Share,
} from "react-native";
import {
  ArrowLeft,
  Package,
  MapPin,
  Truck,
  Barcode,
  Tag,
  Clock,
  Edit,
  Share2,
  AlertTriangle,
  ChevronRight,
  Building2,
} from "lucide-react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Product } from "@/types/product";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import QuantityEditModal from "@/components/products/QuantityEditModal";
import { useAuth } from "@/hooks/useAuth";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

interface StatCardProps {
  icon: React.ElementType;
  value: number;
  label: string;
  color: string;
  warning?: boolean;
}

interface InfoRowProps {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
  isLast?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  value,
  label,
  color,
  warning,
}) => (
  <View className="flex-1 bg-gray-50 p-4 rounded-2xl">
    <View className="flex-row items-center space-x-3">
      <View
        className="w-12 h-12 rounded-xl items-center justify-center"
        style={{ backgroundColor: warning ? "#FEF2F2" : `${color}15` }}
      >
        <Icon size={24} color={warning ? "#EF4444" : color} />
      </View>
      <View className="ml-2">
        <Text className="text-2xl font-bold text-gray-900">{value}</Text>
        <Text className="text-sm text-gray-500">{label}</Text>
      </View>
    </View>
  </View>
);

const InfoRow: React.FC<InfoRowProps> = ({
  icon: Icon,
  label,
  value,
  color,
  isLast,
}) => (
  <View
    className={`flex-row items-center ${
      !isLast ? "border-b border-gray-200 pb-4 mb-4" : ""
    }`}
  >
    <View
      className="w-10 h-10 rounded-full items-center justify-center"
      style={{ backgroundColor: `${color}15` }}
    >
      <Icon size={20} color={color} />
    </View>
    <View className="ml-4 flex-1">
      <Text className="text-gray-500 text-sm">{label}</Text>
      <Text className="text-gray-900 font-medium mt-0.5">{value}</Text>
    </View>
  </View>
);

const ProductDetails: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      const response = await fetch(`${API_URL}/products/${id}`);
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!product) return;
    try {
      await Share.share({
        message: `Check out ${product.name} - Price: ${product.price} MAD`,
        title: product.name,
      });
    } catch (error) {
      console.error("Error sharing product:", error);
    }
  };

  const getTotalStock = () => {
    if (!product) return 0;
    return product.stocks.reduce((sum, stock) => sum + stock.quantity, 0);
  };

  const getUserWarehouseStock = () => {
    if (!product || !user?.warehouseId) return null;
    return product.stocks.find(stock => stock.id === user.warehouseId);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!product) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center">
        <AlertTriangle size={48} color="#EF4444" />
        <Text className="text-gray-500 text-lg mt-4">Product not found</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-6 px-6 py-3 bg-yellow-500 rounded-xl"
        >
          <Text className="text-white font-medium">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isLowStock = getTotalStock() < 10;
  const userWarehouseStock = getUserWarehouseStock();

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <View className="bg-yellow-500 px-6 py-4">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 bg-yellow-400 rounded-full items-center justify-center"
            >
              <ArrowLeft color="#f9fafb" size={24} />
            </TouchableOpacity>

            <Text className="text-white text-lg font-bold">{product.name}</Text>

            <View className="flex-row">
              <TouchableOpacity
                onPress={handleShare}
                className="w-10 h-10 mr-2 bg-yellow-400 rounded-full items-center justify-center"
              >
                <Share2 color="#f9fafb" size={20} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIsEditModalVisible(true)}
                className="w-10 h-10 bg-yellow-400 rounded-full items-center justify-center"
              >
                <Edit color="#f9fafb" size={20} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView className="flex-1">
        <View className="h-[300px]">
          <Image
            source={{ uri: product.image }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>

        <View className="bg-white -mt-12 rounded-t-[32px] px-6 pt-8 pb-6">
          <View className="mb-8">
            <View className="flex-row items-center mb-2">
              <Tag size={16} color="#eab308" />
              <Text className="text-yellow-500 ml-2 font-medium">
                {product.type}
              </Text>
            </View>
            <Text className="text-3xl font-bold text-gray-900 mb-2">
              {product.name}
            </Text>
            <Text className="text-2xl font-bold text-green-500">
              {product.price.toLocaleString()} MAD
            </Text>
          </View>

          <View className="flex-row mb-6 gap-4">
            <StatCard
              icon={Package}
              value={getTotalStock()}
              label="Total Units"
              color="#eab308"
              warning={isLowStock}
            />
            <StatCard
              icon={MapPin}
              value={product.stocks.length}
              label="Locations"
              color="#eab308"
            />
          </View>

          <View className="mb-6">
            <Text className="text-lg font-bold text-gray-900 mb-4">
              Product Information
            </Text>
            <View className="bg-gray-50 rounded-2xl p-4">
              <InfoRow
                icon={Truck}
                label="Supplier"
                value={product.supplier}
                color="#eab308"
              />
              <InfoRow
                icon={Barcode}
                label="Barcode"
                value={product.barcode}
                color="#8b5cf6"
              />
              <InfoRow
                icon={Clock}
                label="Last Updated"
                value={new Date(product.editedBy[0]?.at).toLocaleDateString()}
                color="#10b981"
                isLast
              />
            </View>
          </View>

          <View className="mb-14">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-bold text-gray-900">
                Stock Information
              </Text>
              {userWarehouseStock && (
                <View className="flex-row items-center bg-yellow-100 px-3 py-1.5 rounded-lg">
                  <Building2 size={16} color="#EAB308" />
                  <Text className="text-yellow-600 font-medium ml-1.5">
                    Your Warehouse
                  </Text>
                </View>
              )}
            </View>

            {userWarehouseStock && (
              <TouchableOpacity
                className="bg-yellow-50 border-2 border-yellow-200 p-4 rounded-2xl flex-row items-center justify-between mb-3"
              >
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-gray-900">
                    {userWarehouseStock.name}
                  </Text>
                  <View className="flex-row items-center mt-1">
                    <MapPin size={14} color="#6B7280" />
                    <Text className="text-gray-500 ml-1">
                      {userWarehouseStock.localisation.city}
                    </Text>
                  </View>
                </View>
                <View className="flex-row items-center space-x-3">
                  <View className="bg-yellow-100 px-4 py-2 rounded-xl">
                    <Text className="text-yellow-600 font-bold">
                      {userWarehouseStock.quantity} units
                    </Text>
                  </View>
                  <ChevronRight size={20} color="#9CA3AF" />
                </View>
              </TouchableOpacity>
            )}

            {product.stocks.length === 0 && (
              <View className="bg-gray-50 p-6 rounded-2xl items-center">
                <Package size={32} color="#9CA3AF" />
                <Text className="text-gray-500 mt-2 text-center">
                  No stock information available
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <QuantityEditModal
        isVisible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        product={product}
        onUpdate={fetchProductDetails}
      />
    </View>
  );
};

export default ProductDetails;