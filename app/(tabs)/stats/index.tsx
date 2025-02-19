import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, RefreshControl, Dimensions } from 'react-native';
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  AlertTriangle,
  DollarSign,
  Laptop,
  Smartphone,
  Gamepad,
  Headphones
} from 'lucide-react-native';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { useStatistics } from '@/hooks/useStatistics';
import { useProducts } from '@/hooks/useProducts';

interface Statistics {
  totalProducts: number;
  outOfStock: number;
  totalStockValue: number;
  products: Array<{
    type: string;
    name: string;
    price: number;
    stocks: Array<{
      quantity: number;
    }>;
  }>;
}

interface CategoryCount {
  [key: string]: {
    count: number;
    icon: React.ElementType;
    color: string;
    hexColor: string;
  };
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: number;
  color: string;
  prefix?: string;
  style?: object;
}

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const screenWidth = Dimensions.get('window').width - 70;

const CategoryIcons: CategoryCount = {
  'Informatique': {
    count: 0,
    icon: Laptop,
    color: 'bg-purple-500',
    hexColor: '#A855F7'
  },
  'Smartphone': {
    count: 0,
    icon: Smartphone,
    color: 'bg-indigo-500',
    hexColor: '#6366F1'
  },
  'Gaming': {
    count: 0,
    icon: Gamepad,
    color: 'bg-pink-500',
    hexColor: '#EC4899'
  },
  'Accessoires': {
    count: 0,
    icon: Headphones,
    color: 'bg-orange-500',
    hexColor: '#F97316'
  }
};

const chartConfig = {
  backgroundColor: '#ffffff',
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(234, 179, 8, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: '6',
    strokeWidth: '2',
    stroke: '#EAB308'
  }
};

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  color,
  prefix,
  style
}) => (
  <View className={`bg-white p-4 rounded-2xl shadow-sm ${style}`}>
    <View className="flex-row justify-between items-center">
      <View>
        <Text className="text-gray-600 text-sm">{title}</Text>
        <Text className="text-2xl font-bold text-gray-900">
          {prefix}{value.toLocaleString()}
        </Text>
      </View>
      <View className={`${color} p-3 rounded-full`}>
        <Icon color="white" size={24} />
      </View>
    </View>
    {trend !== undefined && (
      <View className="flex-row items-center mt-2">
        {trend > 0 ? (
          <TrendingUp size={16} color="#22C55E" />
        ) : (
          <TrendingDown size={16} color="#EF4444" />
        )}
        <Text className={trend > 0 ? "text-green-500 ml-1" : "text-red-500 ml-1"}>
          {Math.abs(trend)}% from last month
        </Text>
      </View>
    )}
  </View>
);

const StatsScreen = () => {
  const { products, loading: productsLoading, refreshProducts } = useProducts();
  const { general: statistics, loading: statsLoading, loadGeneralStatistics } = useStatistics();
  const [categoryStats, setCategoryStats] = useState<CategoryCount>(CategoryIcons);
  const [refreshing, setRefreshing] = useState(false);
  const [topProducts, setTopProducts] = useState({
    labels: [],
    datasets: [{
      data: [],
      color: (opacity = 1) => `rgba(234, 179, 8, ${opacity})`
    }]
  });

  const calculateTopProducts = (products: any[]) => {
    const sortedProducts = [...products]
      .sort((a, b) => {
        const aTotal = a.stocks.reduce((sum: number, stock: any) => sum + stock.quantity, 0);
        const bTotal = b.stocks.reduce((sum: number, stock: any) => sum + stock.quantity, 0);
        return bTotal - aTotal;
      })
      .slice(0, 3);

    setTopProducts({
      labels: sortedProducts.map(p => p.name.length > 10 ? p.name.substring(0, 10) + '...' : p.name),
      datasets: [{
        data: sortedProducts.map(p => 
          p.stocks.reduce((sum: number, stock: any) => sum + stock.quantity, 0)
        ),
        color: (opacity = 1) => `rgba(234, 179, 8, ${opacity})`
      }]
    });
  };

  const calculateCategoryStats = (products: any[]) => {
    const newCategoryStats = { ...CategoryIcons };
    products.forEach(product => {
      if (newCategoryStats[product.type]) {
        newCategoryStats[product.type].count++;
      }
    });
    setCategoryStats(newCategoryStats);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        refreshProducts(),
        loadGeneralStatistics()
      ]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadGeneralStatistics();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      calculateTopProducts(products);
      calculateCategoryStats(products);
    }
  }, [products]);

  if (productsLoading || statsLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#eab308" />
      </View>
    );
  }

  return (
    <ScrollView 
      className="flex-1 bg-gray-50 pt-12 px-6" 
      contentContainerStyle={{ paddingBottom: 100 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#EAB308"]} />
      }
    >
      <Text className="text-2xl font-bold text-gray-900 mb-6">Statistics</Text>

      {/* Top Products Bar Chart */}
      <View className="bg-white p-4 rounded-2xl shadow-sm mb-6">
        <Text className="text-lg font-bold text-gray-900 mb-4">Top Stock Products</Text>
        <BarChart
          data={topProducts}
          width={screenWidth}
          height={220}
          yAxisLabel=""
          chartConfig={chartConfig}
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      </View>
      
      <View className="flex-row justify-between gap-3 mb-6">
        <StatCard
          title="Total Products"
          value={statistics?.totalProducts || 0}
          icon={Package}
          trend={5.2}
          color="bg-blue-500"
          style={{ width: '48%' }}
        />
        
        <StatCard
          title="Out of Stock"
          value={statistics?.outOfStock || 0}
          icon={AlertTriangle}
          trend={-2.1}
          color="bg-red-500"
          style={{ width: '48%' }}
        />
      </View>

      <StatCard
        title="Total Stock Value"
        value={statistics?.totalStockValue || 0}
        icon={DollarSign}
        trend={3.8}
        color="bg-green-500"
        prefix="MAD "
        style={{ marginBottom: 16 }}
      />

      {/* Category Distribution */}
      <View className="mt-8 bg-white p-4 rounded-2xl shadow-sm">
        <Text className="text-lg font-bold text-gray-900 mb-4">Category Distribution</Text>
        <PieChart
          data={Object.entries(categoryStats)
            .filter(([_, data]) => data.count > 0)
            .map(([category, data]) => ({
              name: category,
              population: data.count,
              color: data.hexColor,
              legendFontColor: '#666666',
              legendFontSize: 12,
            }))}
          width={screenWidth}
          height={220}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </View>

      <View className="mt-6">
        <Text className="text-lg font-bold text-gray-900 mb-4">
          Products by Category
        </Text>
        <View className="flex-row flex-wrap justify-between">
          {Object.entries(categoryStats).map(([category, data]) => (
            <View key={category} style={{ width: '48%', marginBottom: 16 }}>
              <StatCard
                title={category}
                value={data.count}
                icon={data.icon}
                color={data.color}
              />
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default StatsScreen;