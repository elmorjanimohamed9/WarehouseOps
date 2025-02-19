import { Tabs, usePathname } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { Home, BarChart2, Scan, Package, Settings } from 'lucide-react-native';
import '../../global.css'

const TabLayout = () => {
  const pathname = usePathname();
  const isAddProductPage = pathname.includes('/products/add');
  const isScanPage = pathname.includes('/scan');
  const isProfileInformationPage = pathname.includes('/settings/profile-information');

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0,
          backgroundColor: 'white',
          borderTopEndRadius: 20,
          borderTopStartRadius: 20,
          height: 60,
          paddingBottom: 10,
          zIndex: 1,
          display: isAddProductPage || isScanPage || isProfileInformationPage ? 'none' : 'flex',
        },
        tabBarActiveTintColor: '#eab308',
        tabBarInactiveTintColor: '#9ca3af',
      }}
    >

      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
          href: '/home',
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: 'Products',
          headerShown: false,
          tabBarIcon: ({ color }) => <Package size={24} color={color} />,
          href: '/products',
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: 'Scan',
          tabBarLabel: () => null,
          tabBarIcon: ({ color }) => (
            <View style={{
              backgroundColor: '#eab308',
              borderRadius: 30,
              padding: 12,
              marginBottom: 20,
            }}>
              <Scan size={24} color="white" />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Stats',
          tabBarIcon: ({ color }) => <BarChart2 size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          headerShown: false,
          tabBarIcon: ({ color }) => <Settings size={24} color={color} />,
        }}
      />
    </Tabs>
  );
};

export default TabLayout;