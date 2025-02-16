import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Vibration,
  Keyboard,
} from "react-native";
import {
  Barcode,
  PackageCheck,
  PackagePlus,
  AlertCircle,
  ArrowLeft,
  Camera,
  X,
  CameraOff,
  LucideProps,
} from "lucide-react-native";
import {
  CameraView,
  useCameraPermissions,
  BarcodeScanningResult,
} from "expo-camera";
import { router } from "expo-router";

type VibrationPattern = number | number[];

const API_URL = process.env.EXPO_PUBLIC_API_URL;

interface Product {
  id: string;
  name: string;
  barcode: string;
}

interface IconButtonProps {
  icon: React.ComponentType<LucideProps>;
  onPress: () => void;
  color?: string;
  size?: number;
  bgColor?: string;
  className?: string;
}

const IconButton: React.FC<IconButtonProps> = ({
  icon: Icon,
  onPress,
  color = "white",
  size = 24,
  bgColor = "bg-yellow-400",
  className = "",
}) => (
  <TouchableOpacity
    onPress={onPress}
    className={`w-10 h-10 ${bgColor} rounded-full items-center justify-center ${className}`}
  >
    <Icon color={color} size={size} />
  </TouchableOpacity>
);

interface BaseModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const BaseModal: React.FC<BaseModalProps> = ({
  visible,
  onClose,
  children,
}) => (
  <Modal
    visible={visible}
    animationType="fade"
    transparent
    onRequestClose={onClose}
  >
    <View className="flex-1 bg-black/90 justify-center items-center p-6">
      <View className="w-full max-w-md bg-white rounded-2xl p-6">
        {children}
      </View>
    </View>
  </Modal>
);

interface InputModalProps {
  visible: boolean;
  onClose: () => void;
  barcode: string;
  setBarcode: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
}

const InputModal: React.FC<InputModalProps> = ({
  visible,
  onClose,
  barcode,
  setBarcode,
  onSubmit,
  loading,
}) => (
  <BaseModal visible={visible} onClose={onClose}>
    <View className="flex-row justify-between items-center mb-6">
      <Text className="text-xl font-bold text-gray-900">Enter Barcode</Text>
      <IconButton
        icon={X}
        onPress={onClose}
        color="#6b7280"
        bgColor="bg-transparent"
      />
    </View>
    <View className="bg-gray-50 rounded-xl px-4 mb-6 flex-row items-center">
      <Barcode size={20} color="#eab308" />
      <TextInput
        className="flex-1 h-12 ml-3 text-base text-gray-900"
        placeholder="Enter barcode number"
        placeholderTextColor="#9ca3af"
        value={barcode}
        onChangeText={setBarcode}
        keyboardType="numeric"
        maxLength={13}
        autoFocus
        returnKeyType="search"
        onSubmitEditing={onSubmit}
      />
    </View>
    <TouchableOpacity
      className={`bg-yellow-500 p-4 rounded-xl ${loading ? "opacity-50" : ""}`}
      onPress={onSubmit}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text className="text-white text-center font-medium">Search</Text>
      )}
    </TouchableOpacity>
  </BaseModal>
);

interface ResultModalProps {
  visible: boolean;
  onClose: () => void;
  product: Product | null;
  barcode: string;
}

const ResultModal: React.FC<ResultModalProps> = ({
  visible,
  onClose,
  product,
  barcode,
}) => (
  <BaseModal visible={visible} onClose={onClose}>
    <View className="items-center mb-6">
      {product ? (
        <PackageCheck size={48} color="#eab308" />
      ) : (
        <PackagePlus size={48} color="#eab308" />
      )}
    </View>
    <Text className="text-xl font-bold text-center text-gray-900 mb-2">
      {product ? "Product Found" : "Product Not Found"}
    </Text>
    <Text className="text-gray-500 text-center mb-6">
      {product
        ? "This product already exists in the database."
        : "Would you like to add this product?"}
    </Text>
    <View className="flex-row gap-4">
      <TouchableOpacity
        className="flex-1 bg-gray-100 p-4 rounded-xl"
        onPress={onClose}
      >
        <Text className="text-gray-600 text-center font-medium">Cancel</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="flex-1 bg-yellow-500 p-4 rounded-xl"
        onPress={() => {
          onClose();
          product
            ? router.push(`/products/${product.id}`)
            : router.push({ pathname: "/products/add", params: { barcode } });
        }}
      >
        <Text className="text-white text-center font-medium">
          {product ? "View Details" : "Add Product"}
        </Text>
      </TouchableOpacity>
    </View>
  </BaseModal>
);

interface CameraPreviewProps {
  scanned: boolean;
  onBarcodeScanned: (scanningResult: BarcodeScanningResult) => void;
  isActive: boolean;
}

const CameraPreview: React.FC<CameraPreviewProps> = ({
  scanned,
  onBarcodeScanned,
  isActive,
}) => {
  const [permission] = useCameraPermissions();

  if (!permission?.granted) return null;

  return isActive ? (
    <CameraView
      className="flex-1"
      facing="back"
      barcodeScannerSettings={{
        barcodeTypes: ["qr", "ean13", "ean8", "upc_a", "upc_e"],
      }}
      onBarcodeScanned={scanned ? undefined : onBarcodeScanned}
    >
      <View className="items-center justify-center p-12">
        <View className="w-full aspect-square relative">
          <View className="absolute inset-0 border-2 border-white/30 rounded-lg" />
          <View className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-yellow-400 rounded-tl-lg" />
          <View className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-yellow-400 rounded-tr-lg" />
          <View className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-yellow-400 rounded-bl-lg" />
          <View className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-yellow-400 rounded-br-lg" />
        </View>
      </View>
    </CameraView>
  ) : (
    <View className="flex-1 justify-center items-center bg-black">
      <Text className="text-yellow-500 text-center">Camera Disabled</Text>
    </View>
  );
};

const ScanScreen: React.FC = () => {
  const [barcode, setBarcode] = useState<string>("");
  const [scanned, setScanned] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [showResultModal, setShowResultModal] = useState<boolean>(false);
  const [showInputModal, setShowInputModal] = useState<boolean>(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(true);

  const triggerVibration = (pattern: VibrationPattern) =>
    Vibration.vibrate(pattern);

  const handleBarcodeScanned = ({ data }: BarcodeScanningResult) => {
    if (!scanned && isCameraActive) {
      setScanned(true);
      setBarcode(data);
      searchProduct(data);
    }
  };

  const searchProduct = async (barcodeValue: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}?barcode=${barcodeValue}`);
      if (!response.ok) throw new Error("Product search failed");

      const data: Product[] = await response.json();
      handleSearchResult(data, barcodeValue);
    } catch (err) {
      handleSearchError(err);
    } finally {
      setLoading(false);
      setScanned(false);
    }
  };

  const handleSearchResult = (data: Product[], barcodeValue: string) => {
    if (data.length > 0) {
      triggerVibration(100);
      setProduct(data[0]);
      setShowResultModal(true);
    } else {
      triggerVibration([100, 100, 100]);
      setShowResultModal(true);
      setError("Product not found");
    }
  };

  const handleSearchError = (err: unknown) => {
    console.error("Server connection error", err);
    triggerVibration([100, 200, 100]);
    setError("Server connection error");
  };

  const handleManualSearch = () => {
    if (barcode.length < 8) {
      setError("Barcode must contain at least 8 digits");
      triggerVibration([100, 200, 100]);
      return;
    }
    Keyboard.dismiss();
    searchProduct(barcode);
  };

  return (
    <View className="flex-1 bg-yellow-500">
      {/* Header Section */}
      <View className="bg-yellow-500 pt-12 pb-4 px-6">
        <View className="flex-row items-center justify-between">
          <IconButton icon={ArrowLeft} onPress={() => router.back()} />
          <Text className="text-white text-2xl font-bold">Barcode Scanner</Text>
          <IconButton
            icon={isCameraActive ? Camera : CameraOff}
            onPress={() => setIsCameraActive(!isCameraActive)}
          />
        </View>

        <TouchableOpacity
          className="bg-white mt-4 rounded-2xl p-4 flex-row items-center justify-between"
          onPress={() => {
            setShowInputModal(true);
            setIsCameraActive(false);
          }}
        >
          <View className="flex-row items-center">
            <Barcode size={20} color="#eab308" />
            <Text className="text-gray-600 ml-3 font-medium">
              Enter Barcode Manually
            </Text>
          </View>
          <ArrowLeft
            size={20}
            color="#6b7280"
            style={{ transform: [{ rotate: "180deg" }] }}
          />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View className="flex-1 justify-items-center mt-12 pt-4 pb-8 px-8">
        <View className="w-full aspect-square max-w-md rounded-3xl overflow-hidden bg-black/20 mx-auto">
          {loading ? (
            <View className="flex-1 justify-center items-center bg-black">
              <ActivityIndicator size="large" color="#eab308" />
              <Text className="text-yellow-600 mt-4 font-medium text-center">
                Searching product...
              </Text>
            </View>
          ) : (
            <CameraPreview
              scanned={scanned}
              onBarcodeScanned={handleBarcodeScanned}
              isActive={isCameraActive}
            />
          )}
        </View>

        <View className="mt-16 px-6 py-3 bg-yellow-400/20 rounded-full mx-auto">
          <Text className="text-white text-center font-medium">
            Position barcode within frame to scan
          </Text>
        </View>

        {error && (
          <View className="mt-4 w-full max-w-md bg-red-50 border border-red-100 rounded-xl p-4 flex-row items-center mx-auto">
            <AlertCircle size={20} color="#ef4444" />
            <Text className="ml-3 text-red-600 flex-1">{error}</Text>
          </View>
        )}
      </View>

      {/* Modals */}
      <InputModal
        visible={showInputModal}
        onClose={() => setShowInputModal(false)}
        barcode={barcode}
        setBarcode={setBarcode}
        onSubmit={handleManualSearch}
        loading={loading}
      />

      <ResultModal
        visible={showResultModal}
        onClose={() => {
          setShowResultModal(false);
          setError(null);
          setScanned(false);
          setBarcode("");
        }}
        product={product}
        barcode={barcode}
      />
    </View>
  );
};

export default ScanScreen;
