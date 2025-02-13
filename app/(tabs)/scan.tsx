import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, Dimensions, Platform } from 'react-native';
import { Camera } from 'expo-camera';
import { BlurView } from 'expo-blur';
import { Camera as CameraIcon, X, Plus, Package, Clipboard, TextIcon } from 'lucide-react-native';
import { BottomSheet } from '@/components/ui/bottom-sheet';

const SCREEN_HEIGHT = Dimensions.get('window').height;

const ScanScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [scannedProduct, setScannedProduct] = useState(null);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    type: '',
    price: '',
    supplier: '',
    quantity: '',
    barcode: ''
  });

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };
    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = async ({ data }) => {
    setScanned(true);
    try {
      const response = await fetch(`http://192.168.43.247:3000/products?barcode=${data}`);
      const products = await response.json();
      
      if (products.length > 0) {
        setScannedProduct(products[0]);
        setIsNewProduct(false);
      } else {
        setIsNewProduct(true);
        setNewProduct(prev => ({ ...prev, barcode: data }));
      }
      setShowBottomSheet(true);
    } catch (error) {
      console.error('Error checking product:', error);
    }
  };

  const handleAddProduct = async () => {
    try {
      const response = await fetch('http://192.168.43.247:3000/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newProduct,
          stocks: [],
          editedBy: [{
            warehousemanId: 1333, 
            at: new Date().toISOString().split('T')[0]
          }]
        })
      });
      
      if (response.ok) {
        setShowBottomSheet(false);
        setScanned(false);
        setNewProduct({
          name: '',
          type: '',
          price: '',
          supplier: '',
          quantity: '',
          barcode: ''
        });
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  if (hasPermission === null || hasPermission === false) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-gray-600">
          {hasPermission === null ? "Requesting camera permission..." : "No access to camera"}
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-900">
      {/* Camera View */}
      <Camera
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        className="flex-1"
        ratio="16:9"
      >
        {/* Overlay UI */}
        <BlurView intensity={20} className="absolute top-0 left-0 right-0 h-24 flex-row items-end justify-between px-6 pb-4">
          <Text className="text-white text-lg font-semibold">Scan Product</Text>
          <TouchableOpacity 
            onPress={() => setShowManualInput(true)}
            className="bg-white/20 p-2 rounded-full"
          >
            <TextIcon color="white" size={24} />
          </TouchableOpacity>
        </BlurView>

        {/* Scan Area Indicator */}
        <View className="flex-1 justify-center items-center">
          <View className="w-72 h-72 border-2 border-white/50 rounded-lg justify-center items-center">
            <View className="absolute w-full h-1 bg-yellow-500 opacity-80" />
          </View>
          <Text className="text-white mt-4 opacity-80">
            Align barcode within the frame
          </Text>
        </View>
      </Camera>

      {/* Bottom Sheet for Product Info or New Product Form */}
      {showBottomSheet && (
        <BottomSheet
          snapPoints={[SCREEN_HEIGHT * 0.8, SCREEN_HEIGHT * 0.4]}
          onClose={() => {
            setShowBottomSheet(false);
            setScanned(false);
          }}
        >
          <View className="p-6">
            {isNewProduct ? (
              // New Product Form
              <View>
                <Text className="text-xl font-bold mb-4">Add New Product</Text>
                <View className="space-y-4">
                  <View>
                    <Text className="text-gray-600 mb-1">Product Name</Text>
                    <TextInput
                      className="bg-gray-100 px-4 py-3 rounded-xl"
                      value={newProduct.name}
                      onChangeText={text => setNewProduct(prev => ({ ...prev, name: text }))}
                      placeholder="Enter product name"
                    />
                  </View>
                  <View>
                    <Text className="text-gray-600 mb-1">Type</Text>
                    <TextInput
                      className="bg-gray-100 px-4 py-3 rounded-xl"
                      value={newProduct.type}
                      onChangeText={text => setNewProduct(prev => ({ ...prev, type: text }))}
                      placeholder="Enter product type"
                    />
                  </View>
                  <View>
                    <Text className="text-gray-600 mb-1">Price</Text>
                    <TextInput
                      className="bg-gray-100 px-4 py-3 rounded-xl"
                      value={newProduct.price}
                      onChangeText={text => setNewProduct(prev => ({ ...prev, price: text }))}
                      placeholder="Enter price"
                      keyboardType="numeric"
                    />
                  </View>
                  <TouchableOpacity
                    onPress={handleAddProduct}
                    className="bg-yellow-500 py-4 rounded-xl items-center mt-4"
                  >
                    <Text className="text-white font-semibold">Add Product</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              // Existing Product Info
              <View>
                <Text className="text-xl font-bold mb-4">Product Details</Text>
                <View className="flex-row mb-6">
                  {scannedProduct?.image && (
                    <Image
                      source={{ uri: scannedProduct.image }}
                      className="w-20 h-20 rounded-xl"
                    />
                  )}
                  <View className="ml-4 flex-1">
                    <Text className="text-lg font-semibold">{scannedProduct?.name}</Text>
                    <Text className="text-gray-500">{scannedProduct?.type}</Text>
                    <Text className="text-yellow-500 font-bold mt-2">
                      ${scannedProduct?.price}
                    </Text>
                  </View>
                </View>
                
                <View className="space-y-4">
                  {scannedProduct?.stocks.map(stock => (
                    <View key={stock.id} className="bg-gray-100 p-4 rounded-xl">
                      <Text className="font-semibold">{stock.name}</Text>
                      <Text className="text-gray-600">Quantity: {stock.quantity}</Text>
                      <Text className="text-gray-600">{stock.localisation.city}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        </BottomSheet>
      )}
    </View>
  );
};

export default ScanScreen;