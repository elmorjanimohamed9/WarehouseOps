import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert, 
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image
} from 'react-native';
import { 
  Package, 
  DollarSign, 
  Building2, 
  Barcode, 
  Archive, 
  ArrowLeft,
  Warehouse,
  MapPin,
  ChevronRight,
  Camera
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

const AddProductPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    barcode: '',
    price: '',
    supplier: '',
    image: '',
    quantity: '',
    warehouse: ''
  });

  const productTypes = ['Informatique', 'Accessoires', 'Smartphone', 'Gaming'];
  const warehouses = [
    { id: '1999', name: 'Gueliz B2', city: 'Marrakesh' },
    { id: '2991', name: 'Lazari H2', city: 'Oujda' }
  ];

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant permission to access your photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setFormData(prev => ({ ...prev, image: result.assets[0].uri }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.type) newErrors.type = 'Product type is required';
    if (!formData.barcode.trim()) newErrors.barcode = 'Barcode is required';
    if (!formData.price.trim()) newErrors.price = 'Price is required';
    else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'Please enter a valid price';
    }
    if (!formData.supplier.trim()) newErrors.supplier = 'Supplier is required';
    if (!formData.quantity.trim()) newErrors.quantity = 'Quantity is required';
    else if (isNaN(Number(formData.quantity)) || Number(formData.quantity) < 0) {
      newErrors.quantity = 'Please enter a valid quantity';
    }
    if (!formData.warehouse) newErrors.warehouse = 'Please select a warehouse';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const selectedWarehouse = warehouses.find(w => w.id === formData.warehouse);
      const newProduct = {
        id: Date.now(),
        name: formData.name.trim(),
        type: formData.type,
        barcode: formData.barcode.trim(),
        price: Number(formData.price),
        supplier: formData.supplier.trim(),
        image: formData.image || 'https://placehold.co/600x400?text=No+Image',
        stocks: [{
          id: Number(formData.warehouse),
          name: selectedWarehouse?.name || '',
          quantity: Number(formData.quantity),
          localisation: {
            city: selectedWarehouse?.city || '',
            latitude: 0,
            longitude: 0
          }
        }],
        editedBy: [{
          warehousemanId: 1333,
          at: new Date().toISOString()
        }]
      };

      const response = await fetch('http://172.16.11.195:3000/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });

      if (!response.ok) throw new Error('Failed to add product');

      Alert.alert('Success', 'Product added successfully', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ 
    icon: Icon, 
    label,
    placeholder, 
    value, 
    onChangeText,
    keyboardType = 'default',
    error
  }: {
    icon: any,
    label: string,
    placeholder: string,
    value: string,
    onChangeText: (text: string) => void,
    keyboardType?: 'default' | 'numeric',
    error?: string
  }) => (
    <View className="mb-4">
      <Text className="text-gray-700 text-sm mb-2">{label}</Text>
      <View className={`flex-row items-center bg-gray-100 rounded-xl px-4 py-3 ${
        error ? 'border border-red-500' : ''
      }`}>
        <Icon size={20} color={error ? '#EF4444' : '#6B7280'} />
        <TextInput
          className="flex-1 ml-3 text-gray-900"
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
        />
      </View>
      {error && (
        <Text className="text-red-500 text-xs mt-1 ml-1">{error}</Text>
      )}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-yellow-500 px-6 py-4">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="w-10 h-10 bg-yellow-400 rounded-full items-center justify-center"
          >
            <ArrowLeft color="white" size={24} />
          </TouchableOpacity>
          <Text className="text-white text-lg font-bold">Add New Product</Text>
          <View className="w-10" />
        </View>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className="flex-1 p-6">
          {/* Product Image */}
          <View className="items-center mb-6">
            <TouchableOpacity 
              onPress={pickImage}
              className="w-32 h-32 bg-gray-200 rounded-2xl items-center justify-center mb-2"
            >
              {formData.image ? (
                <Image 
                  source={{ uri: formData.image }} 
                  className="w-full h-full rounded-2xl"
                  resizeMode="cover"
                />
              ) : (
                <View className="items-center">
                  <Camera size={48} color="#9CA3AF" />
                  <Text className="text-gray-500 text-sm mt-2">Add Photo</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Product Type Selection */}
          <View className="mb-6">
            <Text className="text-gray-700 text-sm mb-2">Product Type</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {productTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => {
                    setFormData({ ...formData, type });
                    setErrors({ ...errors, type: '' });
                  }}
                  className={`mr-2 px-4 py-2 rounded-full border ${
                    formData.type === type 
                      ? 'bg-yellow-500 border-yellow-500' 
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <Text 
                    className={formData.type === type ? 'text-white' : 'text-gray-700'}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {errors.type && (
              <Text className="text-red-500 text-xs mt-1 ml-1">{errors.type}</Text>
            )}
          </View>

          {/* Form Fields */}
          <InputField
            icon={Package}
            label="Product Name"
            placeholder="Enter product name"
            value={formData.name}
            onChangeText={(text) => {
              setFormData({ ...formData, name: text });
              setErrors({ ...errors, name: '' });
            }}
            error={errors.name}
          />

          <InputField
            icon={Barcode}
            label="Barcode"
            placeholder="Enter product barcode"
            value={formData.barcode}
            onChangeText={(text) => {
              setFormData({ ...formData, barcode: text });
              setErrors({ ...errors, barcode: '' });
            }}
            error={errors.barcode}
          />

          <InputField
            icon={DollarSign}
            label="Price"
            placeholder="Enter product price"
            value={formData.price}
            onChangeText={(text) => {
              setFormData({ ...formData, price: text });
              setErrors({ ...errors, price: '' });
            }}
            keyboardType="numeric"
            error={errors.price}
          />

          <InputField
            icon={Building2}
            label="Supplier"
            placeholder="Enter supplier name"
            value={formData.supplier}
            onChangeText={(text) => {
              setFormData({ ...formData, supplier: text });
              setErrors({ ...errors, supplier: '' });
            }}
            error={errors.supplier}
          />

          <InputField
            icon={Archive}
            label="Quantity"
            placeholder="Enter product quantity"
            value={formData.quantity}
            onChangeText={(text) => {
              setFormData({ ...formData, quantity: text });
              setErrors({ ...errors, quantity: '' });
            }}
            keyboardType="numeric"
            error={errors.quantity}
          />

          {/* Warehouse Selection */}
          <View className="mb-6">
            <Text className="text-gray-700 text-sm mb-2">Select Warehouse</Text>
            {warehouses.map((warehouse) => (
              <TouchableOpacity
                key={warehouse.id}
                onPress={() => {
                  setFormData({ ...formData, warehouse: warehouse.id });
                  setErrors({ ...errors, warehouse: '' });
                }}
                className={`mb-2 p-4 rounded-xl flex-row items-center justify-between ${
                  formData.warehouse === warehouse.id 
                    ? 'bg-yellow-500' 
                    : 'bg-white border border-gray-200'
                }`}
              >
                <View className="flex-row items-center">
                  <Warehouse 
                    size={20} 
                    color={formData.warehouse === warehouse.id ? 'white' : '#6B7280'} 
                  />
                  <View className="ml-3">
                    <Text className={
                      formData.warehouse === warehouse.id 
                        ? 'text-white font-medium' 
                        : 'text-gray-900'
                    }>
                      {warehouse.name}
                    </Text>
                    <View className="flex-row items-center mt-1">
                      <MapPin 
                        size={14} 
                        color={formData.warehouse === warehouse.id ? '#FEF9C3' : '#9CA3AF'} 
                      />
                      <Text className={
                        formData.warehouse === warehouse.id 
                          ? 'text-yellow-100 ml-1' 
                          : 'text-gray-500 ml-1'
                      }>
                        {warehouse.city}
                      </Text>
                    </View>
                  </View>
                </View>
                <ChevronRight 
                  size={20} 
                  color={formData.warehouse === warehouse.id ? 'white' : '#6B7280'} 
                />
              </TouchableOpacity>
            ))}
            {errors.warehouse && (
              <Text className="text-red-500 text-xs mt-1 ml-1">{errors.warehouse}</Text>
            )}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            className={`py-4 rounded-xl items-center justify-center mb-6 ${
              loading ? 'bg-yellow-400' : 'bg-yellow-500'
            }`}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-semibold text-lg">
                Add Product
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddProductPage;