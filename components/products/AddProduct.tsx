import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback 
} from 'react-native';
import { 
  Package, 
  DollarSign, 
  Building2, 
  Barcode, 
  ImageIcon, 
  Archive, 
  ArrowRight, 
  ArrowLeft,
  Warehouse,
  MapPin 
} from 'lucide-react-native';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Product } from '@/types/home.types';

interface AddProductSheetProps {
  isVisible: boolean;
  onClose: () => void;
  onAdd: (product: Product) => void;
}

const AddProductSheet = ({ isVisible, onClose, onAdd }: AddProductSheetProps) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
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
  const [errors, setErrors] = useState<Record<string, string>>({});

  const productTypes = ['Informatique', 'Accessoires', 'Smartphone', 'Gaming'];
  const warehouses = [
    { id: '1999', name: 'Gueliz B2', city: 'Marrakesh' },
    { id: '2991', name: 'Lazari H2', city: 'Oujda' }
  ];

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.type) newErrors.type = 'Product type is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.barcode.trim()) newErrors.barcode = 'Barcode is required';
    if (!formData.price.trim()) newErrors.price = 'Price is required';
    else if (isNaN(Number(formData.price))) newErrors.price = 'Price must be a number';
    if (!formData.supplier.trim()) newErrors.supplier = 'Supplier is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.quantity.trim()) newErrors.quantity = 'Quantity is required';
    else if (isNaN(Number(formData.quantity))) newErrors.quantity = 'Quantity must be a number';
    if (!formData.warehouse) newErrors.warehouse = 'Warehouse is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validateStep3()) return;
    
    setLoading(true);
    try {
      const selectedWarehouse = warehouses.find(w => w.id === formData.warehouse);
      const newProduct = {
        id: Date.now(),
        name: formData.name,
        type: formData.type,
        barcode: formData.barcode,
        price: Number(formData.price),
        supplier: formData.supplier,
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
          at: new Date().toISOString().split('T')[0]
        }]
      };

      const response = await fetch('http://172.16.11.195:3000/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });

      if (!response.ok) throw new Error('Failed to add product');

      onAdd(newProduct);
      onClose();
      setStep(1);
      setFormData({
        name: '', type: '', barcode: '', price: '',
        supplier: '', image: '', quantity: '', warehouse: ''
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ 
    icon: Icon, 
    placeholder, 
    value, 
    onChangeText, 
    keyboardType = 'default',
    error
  }: { 
    icon: React.ComponentType<{ size: number; color: string }>, 
    placeholder: string, 
    value: string, 
    onChangeText: (text: string) => void, 
    keyboardType?: 'default' | 'numeric',
    error?: string
  }) => (
    <View className="mb-4">
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
          returnKeyType="next"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
      {error && (
        <Text className="text-red-500 text-xs mt-1 ml-1">{error}</Text>
      )}
    </View>
  );

  const StepIndicator = () => (
    <View className="flex-row items-center justify-center mb-6">
      <View className={`h-2 w-12 rounded-full ${step >= 1 ? 'bg-yellow-500' : 'bg-gray-200'}`} />
      <View className="w-2" />
      <View className={`h-2 w-12 rounded-full ${step >= 2 ? 'bg-yellow-500' : 'bg-gray-200'}`} />
      <View className="w-2" />
      <View className={`h-2 w-12 rounded-full ${step === 3 ? 'bg-yellow-500' : 'bg-gray-200'}`} />
    </View>
  );

  const getStepTitle = () => {
    switch(step) {
      case 1: return { title: 'Basic Information', subtitle: 'Enter product details' };
      case 2: return { title: 'Product Details', subtitle: 'Add specifications' };
      case 3: return { title: 'Stock Information', subtitle: 'Set inventory details' };
      default: return { title: '', subtitle: '' };
    }
  };

  const renderStepContent = () => {
    switch(step) {
      case 1:
        return (
          <>
            <InputField
              icon={Package}
              placeholder="Product Name"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              error={errors.name}
            />

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Product Type</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                {productTypes.map((type) => (
                  <TouchableOpacity
                    key={type}
                    onPress={() => {
                      setFormData({ ...formData, type });
                      setErrors({ ...errors, type: '' });
                    }}
                    className={`mr-2 px-4 py-2 rounded-full ${
                      formData.type === type ? 'bg-yellow-500' : 'bg-gray-100'
                    }`}
                  >
                    <Text className={formData.type === type ? 'text-white' : 'text-gray-700'}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              {errors.type && (
                <Text className="text-red-500 text-xs mt-1 ml-1">{errors.type}</Text>
              )}
            </View>
          </>
        );

      case 2:
        return (
          <>
            <InputField
              icon={Barcode}
              placeholder="Barcode"
              value={formData.barcode}
              onChangeText={(text) => setFormData({ ...formData, barcode: text })}
              error={errors.barcode}
            />

            <InputField
              icon={DollarSign}
              placeholder="Price"
              value={formData.price}
              onChangeText={(text) => setFormData({ ...formData, price: text })}
              keyboardType="numeric"
              error={errors.price}
            />

            <InputField
              icon={Building2}
              placeholder="Supplier"
              value={formData.supplier}
              onChangeText={(text) => setFormData({ ...formData, supplier: text })}
              error={errors.supplier}
            />

            <InputField
              icon={ImageIcon}
              placeholder="Image URL (optional)"
              value={formData.image}
              onChangeText={(text) => setFormData({ ...formData, image: text })}
            />
          </>
        );

      case 3:
        return (
          <>
            <InputField
              icon={Archive}
              placeholder="Quantity"
              value={formData.quantity}
              onChangeText={(text) => setFormData({ ...formData, quantity: text })}
              keyboardType="numeric"
              error={errors.quantity}
            />

            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-2">Select Warehouse</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                {warehouses.map((warehouse) => (
                  <TouchableOpacity
                    key={warehouse.id}
                    onPress={() => {
                      setFormData({ ...formData, warehouse: warehouse.id });
                      setErrors({ ...errors, warehouse: '' });
                    }}
                    className={`mr-2 px-4 py-3 rounded-xl ${
                      formData.warehouse === warehouse.id ? 'bg-yellow-500' : 'bg-gray-100'
                    }`}
                  >
                    <View className="flex-row items-center mb-1">
                      <Warehouse size={16} color={formData.warehouse === warehouse.id ? 'white' : '#6B7280'} />
                      <Text className={`ml-2 ${
                        formData.warehouse === warehouse.id ? 'text-white' : 'text-gray-700'
                      }`}>
                        {warehouse.name}
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <MapPin size={14} color={formData.warehouse === warehouse.id ? '#FEF9C3' : '#9CA3AF'} />
                      <Text className={`ml-1 text-xs ${
                        formData.warehouse === warehouse.id ? 'text-yellow-100' : 'text-gray-500'
                      }`}>
                        {warehouse.city}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              {errors.warehouse && (
                <Text className="text-red-500 text-xs mt-1 ml-1">{errors.warehouse}</Text>
              )}
            </View>
          </>
        );
    }
  };

  return isVisible ? (
    <BottomSheet onClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView 
            className="px-6"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <StepIndicator />
            
            <View className="mb-6">
              <Text className="text-2xl font-bold text-gray-900">
                {getStepTitle().title}
              </Text>
              <Text className="text-gray-500">
                {getStepTitle().subtitle}
              </Text>
            </View>

            {renderStepContent()}

            <View className="flex-row gap-4 mb-6">
              {step > 1 && (
                <TouchableOpacity
                  onPress={handleBack}
                  className="flex-1 bg-gray-100 py-4 rounded-xl flex-row items-center justify-center"
                >
                  <ArrowLeft color="#4B5563" size={20} />
                  <Text className="text-gray-700 font-semibold text-lg ml-2">Back</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={step === 3 ? handleSubmit : handleNext}
                disabled={loading}
                className={`flex-1 py-4 rounded-xl items-center justify-center ${
                  loading ? 'bg-yellow-400' : 'bg-yellow-500'
                }`}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <View className="flex-row items-center">
                    <Text className="text-white font-semibold text-lg mr-2">
                      {step === 3 ? 'Add Product' : 'Next'}
                    </Text>
                    {step < 3 && <ArrowRight color="white" size={20} />}
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </BottomSheet>
  ) : null;
};

export default AddProductSheet;