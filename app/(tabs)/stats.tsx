import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { BarChart, LineChart } from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  AlertTriangle,
  DollarSign
} from 'lucide-react-native';

const StatsScreen = () => {
  const [statistics, setStatistics] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await fetch('http://192.168.43.247:3000/statistics');
      const data = await response.json();
      setStatistics(data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const StatCard = ({ title, value, icon: Icon, trend, color }) => (
    <View className="bg-white p-4 rounded-2xl mb-4">
      <View className="flex-row justify-between items-center">
        <View>
          <Text className="text-gray-600">{title}</Text>
          <Text className="text-2xl font-bold text-gray-900">{value}</Text>
        </View>
        <View className={`${color} p-3 rounded-full`}>
          <Icon color="white" size={24} />
        </View>
      </View>
      {trend && (
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

  return (
    <ScrollView className="flex-1 bg-gray-50 pt-12 px-6" contentContainerStyle={{ paddingBottom: 100 }}>
      <Text className="text-2xl font-bold text-gray-900 mb-6">Statistics</Text>
      
      <StatCard
        title="Total Products"
        value={statistics?.totalProducts || 0}
        icon={Package}
        trend={5.2}
        color="bg-blue-500"
      />
      
      <StatCard
        title="Out of Stock"
        value={statistics?.outOfStock || 0}
        icon={AlertTriangle}
        trend={-2.1}
        color="bg-red-500"
      />
      
      <StatCard
        title="Total Stock Value"
        value={`$${statistics?.totalStockValue || 0}k`}
        icon={DollarSign}
        trend={3.8}
        color="bg-green-500"
      />

      {/* Additional charts and statistics can be added here */}
      
      <View className="mt-6">
        <Text className="text-lg font-bold text-gray-900 mb-4">Recent Activity</Text>
        {recentActivity.map((activity, index) => (
          <View key={index} className="bg-white p-4 rounded-2xl mb-4">
            <Text className="text-gray-900">{activity.action}</Text>
            <Text className="text-gray-500 text-sm">{activity.timestamp}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default StatsScreen;