import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
  Share,
  Dimensions
} from 'react-native';
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
  ChevronRight
} from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Product } from '@/types/product';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

const { width } = Dimensions.get('window');

const ProductDetails = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [scrollOffset, setScrollOffset] = useState(0);

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      const response = await fetch(`http://172.16.11.195:3000/products/${id}`);
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
      console.error('Error sharing product:', error);
    }
  };

  const getTotalStock = () => {
    if (!product) return 0;
    return product.stocks.reduce((sum, stock) => sum + stock.quantity, 0);
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

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />

      {/* Floating Header */}
      <SafeAreaView>
  <View className="bg-yellow-500 px-6 py-4">
    <View className="flex-row items-center justify-between">
      <TouchableOpacity
        onPress={() => router.back()}
        className="w-10 h-10 bg-yellow-400 rounded-full items-center justify-center"
      >
        <ArrowLeft color="#f9fafb" size={24} />
      </TouchableOpacity>

      <Text className="text-white text-lg font-bold">
        {product.name}
      </Text>

      <View className="flex-row">
        <TouchableOpacity
          onPress={handleShare}
          className="w-10 h-10 mr-2 bg-yellow-400 rounded-full items-center justify-center"
        >
          <Share2 color="#f9fafb" size={20} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push(`/products/edit/${product.id}`)}
          className="w-10 h-10 bg-yellow-400 rounded-full items-center justify-center"
        >
          <Edit color="#f9fafb" size={20} />
        </TouchableOpacity>
      </View>
    </View>
  </View>
</SafeAreaView>

      <ScrollView 
        className="flex-1"
        onScroll={e => setScrollOffset(e.nativeEvent.contentOffset.y)}
        scrollEventThrottle={16}
      >
        {/* Hero Image */}
        <View className="h-[300px]">
          <Image
            source={{ uri: product.image }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>

        {/* Content Container */}
        <View className="bg-white -mt-12 rounded-t-[32px] px-6 pt-8 pb-6">
          {/* Product Header */}
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

          {/* Quick Stats */}
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

          {/* Product Details */}
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

          {/* Stock Information */}
          <View className="mb-14">
            <Text className="text-lg font-bold text-gray-900 mb-4">
              Stock Information
            </Text>
            {product.stocks.map((stock, index) => (
              <TouchableOpacity
                key={stock.id}
                onPress={() => router.push(`/stock-management/${product.id}/${stock.id}`)}
                className={`bg-gray-50 p-4 rounded-2xl flex-row items-center justify-between
                  ${index !== product.stocks.length - 1 ? 'mb-3' : ''}`}
              >
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-gray-900">
                    {stock.name}
                  </Text>
                  <View className="flex-row items-center mt-1">
                    <MapPin size={14} color="#6B7280" />
                    <Text className="text-gray-500 ml-1">
                      {stock.localisation.city}
                    </Text>
                  </View>
                </View>
                <View className="flex-row items-center space-x-3">
                  <View className="bg-green-100 px-4 py-2 rounded-xl">
                    <Text className="text-green-500 font-bold">
                      {stock.quantity} units
                    </Text>
                  </View>
                  <ChevronRight size={20} color="#9CA3AF" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const StatCard = ({ icon: Icon, value, label, color, warning }: { icon: React.ElementType; value: number; label: string; color: string; warning?: boolean }) => (
  <View className="flex-1 bg-gray-50 p-4 rounded-2xl">
    <View className="flex-row items-center space-x-3">
      <View 
        className={`w-12 h-12 rounded-xl items-center justify-center`}
        style={{ backgroundColor: warning ? '#FEF2F2' : `${color}15` }}
      >
        <Icon size={24} color={warning ? '#EF4444' : color} />
      </View>
      <View className="ml-2">
        <Text className="text-2xl font-bold text-gray-900">{value}</Text>
        <Text className="text-sm text-gray-500">{label}</Text>
      </View>
    </View>
  </View>
);

const InfoRow = ({ icon: Icon, label, value, color, isLast }: { icon: React.ElementType; label: string; value: string; color: string; isLast?: boolean }) => (
  <View className={`flex-row items-center ${!isLast ? 'border-b border-gray-200 pb-4 mb-4' : ''}`}>
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

export default ProductDetails;