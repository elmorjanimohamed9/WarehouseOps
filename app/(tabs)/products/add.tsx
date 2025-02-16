import React, { useState, useCallback, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image,
  StatusBar,
} from "react-native";
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
  Camera,
  X,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { BlurView } from "expo-blur";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { Product } from "@/types/product";
import Input from "@/components/common/Input";
import { useProducts } from "@/hooks/useProducts";
import { useAuth } from "@/hooks/useAuth";

interface FormData {
  name: string;
  type: string;
  barcode: string;
  price: string;
  supplier: string;
  image: string;
  quantity: string;
  warehouse: string;
}

const INITIAL_FORM_STATE: FormData = {
  name: "",
  type: "",
  barcode: "",
  price: "",
  supplier: "",
  image: "",
  quantity: "",
  warehouse: "",
};

const PRODUCT_TYPES = ["Informatique", "Accessoires", "Smartphone", "Gaming"];

const WAREHOUSES = [
  { id: "1999", name: "Gueliz B2", city: "Marrakesh" },
  { id: "2991", name: "Lazari H2", city: "Oujda" },
];

const AddProductPage = () => {
  const router = useRouter();
  const { addProduct } = useProducts();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_STATE);
  const [imageLoading, setImageLoading] = useState(false);

  const updateFormField = useCallback(
    (field: keyof FormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: "" }));
    },
    []
  );

  useEffect(() => {
    if (user?.warehouseId) {
      const userWarehouse = WAREHOUSES.find(
        wh => parseInt(wh.id) === user.warehouseId
      );
      if (userWarehouse) {
        updateFormField('warehouse', userWarehouse.id);
      }
    }
  }, [user, updateFormField]);

  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please grant permission to access your photo library"
        );
        return;
      }

      setImageLoading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        updateFormField("image", result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
    } finally {
      setImageLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.type) newErrors.type = "Product type is required";
    if (!formData.barcode.trim()) newErrors.barcode = "Barcode is required";
    if (!formData.price.trim()) newErrors.price = "Price is required";
    else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = "Please enter a valid price";
    }
    if (!formData.supplier.trim()) newErrors.supplier = "Supplier is required";
    if (!formData.quantity.trim()) newErrors.quantity = "Quantity is required";
    else if (
      isNaN(Number(formData.quantity)) ||
      Number(formData.quantity) < 0
    ) {
      newErrors.quantity = "Please enter a valid quantity";
    }
    if (!formData.warehouse) newErrors.warehouse = "Please select a warehouse";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert("Error", "Please check all required fields");
      return;
    }

    setLoading(true);
    try {
      const selectedWarehouse = WAREHOUSES.find(
        (w) => w.id === formData.warehouse
      );

      const newProduct: Partial<Product> = {
        id: Date.now().toString(),
        name: formData.name.trim(),
        type: formData.type,
        barcode: formData.barcode.trim(),
        price: Number(formData.price),
        supplier: formData.supplier.trim(),
        image: formData.image || "https://placehold.co/600x400?text=No+Image",
        stocks: [
          {
            id: Number(formData.warehouse),
            name: selectedWarehouse?.name || "",
            quantity: Number(formData.quantity),
            localisation: {
              city: selectedWarehouse?.city || "",
              latitude: 0,
              longitude: 0,
            },
          },
        ],
        editedBy: [
          {
            warehousemanId: 1333,
            at: new Date().toISOString(),
          },
        ],
      };

      await addProduct(newProduct);
      Alert.alert("Success", "Product added successfully", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to add product. Please try again.");
      console.error("Error adding product:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderImagePicker = useMemo(() => (
    <View className="items-center my-6">
      <TouchableOpacity
        onPress={pickImage}
        disabled={imageLoading}
        className="w-40 h-40 bg-white rounded-3xl items-center justify-center border border-yellow-500 overflow-hidden"
      >
        {imageLoading ? (
          <LoadingSpinner />
        ) : formData.image ? (
          <View className="relative w-full h-full">
            <Image
              source={{ uri: formData.image }}
              className="w-full h-full"
              resizeMode="cover"
            />
            <TouchableOpacity
              onPress={() => updateFormField("image", "")}
              className="absolute top-2 right-2 w-8 h-8 bg-yellow-500 rounded-full items-center justify-center"
            >
              <X size={16} color="white" />
            </TouchableOpacity>
          </View>
        ) : (
          <View className="items-center">
            <Camera size={48} color="#eab308" />
            <Text className="text-gray-500 text-sm mt-2">
              Add Product Photo
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  ), [formData.image, imageLoading, pickImage, updateFormField]);

  const renderProductTypeSelection = useMemo(() => (
    <View className="mb-6">
      <Text className="text-gray-700 font-medium mb-2">Product Type</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 20 }}
      >
        {PRODUCT_TYPES.map((type) => (
          <TouchableOpacity
            key={type}
            onPress={() => updateFormField("type", type)}
            className={`mr-3 px-6 py-3 rounded-xl border ${
              formData.type === type
                ? "bg-yellow-500 border-yellow-500"
                : "bg-white border-gray-100"
            }`}
          >
            <Text
              className={`${
                formData.type === type ? "text-white" : "text-gray-700"
              } font-medium`}
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {errors.type && <ErrorMessage message={errors.type} />}
    </View>
  ), [errors.type, formData.type, updateFormField]);

  const renderFormFields = useMemo(() => (
    <View className="space-y-4">
      <View>
        <Text className="text-gray-700 font-medium mb-2">
          Product Name
        </Text>
        <Input
          leftIcon={Package}
          placeholder="Enter product name"
          value={formData.name}
          onChangeText={(text) => updateFormField("name", text)}
          containerClassName={`border ${
            errors.name ? "border-red-500" : "border-gray-100"
          } py-1`}
        />
        {errors.name && <ErrorMessage message={errors.name} />}
      </View>

      <View>
        <Text className="text-gray-700 font-medium mb-2">Barcode</Text>
        <Input
          leftIcon={Barcode}
          placeholder="Enter product barcode"
          value={formData.barcode}
          onChangeText={(text) => updateFormField("barcode", text)}
          containerClassName={`border ${
            errors.barcode ? "border-red-500" : "border-gray-100"
          } py-1`}
        />
        {errors.barcode && <ErrorMessage message={errors.barcode} />}
      </View>

      <View>
        <Text className="text-gray-700 font-medium mb-2">Price</Text>
        <Input
          leftIcon={DollarSign}
          placeholder="Enter product price"
          value={formData.price}
          onChangeText={(text) => updateFormField("price", text)}
          keyboardType="numeric"
          containerClassName={`border ${
            errors.price ? "border-red-500" : "border-gray-100"
          } py-1`}
        />
        {errors.price && <ErrorMessage message={errors.price} />}
      </View>

      <View>
        <Text className="text-gray-700 font-medium mb-2">Supplier</Text>
        <Input
          leftIcon={Building2}
          placeholder="Enter supplier name"
          value={formData.supplier}
          onChangeText={(text) => updateFormField("supplier", text)}
          containerClassName={`border ${
            errors.supplier ? "border-red-500" : "border-gray-100"
          } py-1`}
        />
        {errors.supplier && <ErrorMessage message={errors.supplier} />}
      </View>

      <View>
        <Text className="text-gray-700 font-medium mb-2">Quantity</Text>
        <Input
          leftIcon={Archive}
          placeholder="Enter product quantity"
          value={formData.quantity}
          onChangeText={(text) => updateFormField("quantity", text)}
          keyboardType="numeric"
          containerClassName={`border ${
            errors.quantity ? "border-red-500" : "border-gray-100"
          } py-1`}
        />
        {errors.quantity && <ErrorMessage message={errors.quantity} />}
      </View>
    </View>
  ), [errors, formData, updateFormField]);

  const renderWarehouseSelection = useMemo(() => (
    <View className="mb-6">
      <Text className="text-gray-700 font-medium mb-2">
        Selected Warehouse
      </Text>
      {WAREHOUSES.filter(
        (warehouse) => parseInt(warehouse.id) === user?.warehouseId
      ).map((warehouse) => (
        <View
          key={warehouse.id}
          className="mb-3 p-4 rounded-xl flex-row items-center justify-between bg-yellow-500"
        >
          <View className="flex-row items-center">
            <Warehouse size={20} color="white" />
            <View className="ml-3">
              <Text className="text-white font-medium">
                {warehouse.name}
              </Text>
              <View className="flex-row items-center mt-1">
                <MapPin size={14} color="#FEF9C3" />
                <Text className="text-yellow-100 ml-1">
                  {warehouse.city}
                </Text>
              </View>
            </View>
          </View>
          <ChevronRight size={20} color="white" />
        </View>
      ))}
    </View>
  ), [user?.warehouseId]);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="bg-yellow-500 pt-12 pb-6 px-6 rounded-b-[32px]">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 bg-yellow-400 rounded-full items-center justify-center"
          >
            <ArrowLeft color="#f9fafb" size={24} />
          </TouchableOpacity>
          <Text className="text-white text-lg font-bold">Add New Product</Text>
          <View className="w-10" />
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 24}
      >
        <ScrollView
          className="flex-1 px-6 mb-16"
          showsVerticalScrollIndicator={false}
        >
          {renderImagePicker}
          {renderProductTypeSelection}
          {renderFormFields}
          {renderWarehouseSelection}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Submit Button */}
      <BlurView
        intensity={100}
        tint="light"
        className="absolute bottom-0 left-0 right-0 border-t border-gray-200"
      >
        <View
          className="px-4 py-4"
          style={{
            paddingBottom: Platform.OS === "ios" ? 20 : 12,
          }}
        >
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            className={`py-4 rounded-xl items-center justify-center ${
              loading ? "bg-yellow-400" : "bg-yellow-500"
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
        </View>
      </BlurView>
    </SafeAreaView>
  );
};

export default AddProductPage;
