import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
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

interface Statistics {
  totalProducts: number;
  outOfStock: number;
  totalStockValue: number;
  products: Array<{
    type: string;
    name: string;
    price: number;
  }>;
}

interface CategoryCount {
  [key: string]: {
    count: number;
    icon: React.ElementType;
    color: string;
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

const CategoryIcons: CategoryCount = {
  'Informatique': {
    count: 0,
    icon: Laptop,
    color: 'bg-purple-500'
  },
  'Smartphone': {
    count: 0,
    icon: Smartphone,
    color: 'bg-indigo-500'
  },
  'Gaming': {
    count: 0,
    icon: Gamepad,
    color: 'bg-pink-500'
  },
  'Accessoires': {
    count: 0,
    icon: Headphones,
    color: 'bg-orange-500'
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
  <View className="bg-white p-4 rounded-2xl shadow-sm" style={style}>
    <View className="flex-row justify-between items-center">
      <View>
        <Text className="text-gray-600 text-sm">{title}</Text>
        <Text className="text-2xl font-bold text-gray-900">
          {prefix ? `${prefix}${value}` : value}
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
        <Text 
          className={trend > 0 ? "text-green-500 ml-1" : "text-red-500 ml-1"}
        >
          {Math.abs(trend)}% from last month
        </Text>
      </View>
    )}
  </View>
);

const StatsScreen = () => {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [categoryStats, setCategoryStats] = useState<CategoryCount>(CategoryIcons);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateCategoryStats = (products: any[]) => {
    const newCategoryStats = { ...CategoryIcons };
    
    products.forEach(product => {
      if (newCategoryStats[product.type]) {
        newCategoryStats[product.type].count++;
      }
    });
    
    setCategoryStats(newCategoryStats);
  };

  const fetchStatistics = async () => {
    try {
      setError(null);
      const response = await fetch(`${API_URL}/statistics`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch statistics');
      }
      
      const data = await response.json();
      
      const calculatedStats = {
        ...data,
        totalStockValue: Math.round(data.totalStockValue / 1000)
      };
      
      setStatistics(calculatedStats);
      
      const productsResponse = await fetch(`${API_URL}/products`);
      const productsData = await productsResponse.json();
      calculateCategoryStats(productsData);
      
    } catch (error) {
      console.error('Error fetching statistics:', error);
      setError('Failed to load statistics. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchStatistics();
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#eab308" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 px-6">
        <Text className="text-red-500 text-center mb-4">{error}</Text>
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
      
      <StatCard
        title="Total Products"
        value={statistics?.totalProducts || 0}
        icon={Package}
        trend={5.2}
        color="bg-blue-500"
        style={{ marginBottom: 16 }}
      />
      
      <StatCard
        title="Out of Stock"
        value={statistics?.outOfStock || 0}
        icon={AlertTriangle}
        trend={-2.1}
        color="bg-red-500"
        style={{ marginBottom: 16 }}
      />
      
      <StatCard
        title="Total Stock Value"
        value={statistics?.totalStockValue || 0}
        icon={DollarSign}
        trend={3.8}
        color="bg-green-500"
        prefix="$"
        style={{ marginBottom: 16 }}
      />

      <View className="mt-6">
        <Text className="text-lg font-bold text-gray-900 mb-4">
          Products by Category
        </Text>
        <View className="flex-row flex-wrap justify-between">
          {Object.entries(categoryStats).map(([category, data], index) => (
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