import React, { useState, useEffect } from "react";
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
import { Alert } from "@/components/common/Alert";

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

interface CameraPreviewProps {
  scanned: boolean;
  onBarcodeScanned: (result: BarcodeScanningResult) => void;
  isActive: boolean;
}

interface InputModalProps {
  visible: boolean;
  onClose: () => void;
  barcode: string;
  setBarcode: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
}

interface ResultModalProps {
  visible: boolean;
  onClose: () => void;
  product: Product | null;
  barcode: string;
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

const BaseModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ visible, onClose, children }) => (
  <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
    <View className="flex-1 bg-black/90 justify-center items-center p-6">
      <View className="w-full max-w-md bg-white rounded-2xl p-6">
        <TouchableOpacity
          onPress={onClose}
          className="absolute right-4 top-4 z-10"
        >
          <X size={24} color="#6b7280" />
        </TouchableOpacity>
        {children}
      </View>
    </View>
  </Modal>
);

const InputModal: React.FC<InputModalProps> = ({
  visible,
  onClose,
  barcode,
  setBarcode,
  onSubmit,
  loading,
}) => (
  <BaseModal visible={visible} onClose={onClose}>
    <Text className="text-xl font-bold text-gray-900 mb-6">
      Enter Barcode Manually
    </Text>
    <TextInput
      value={barcode}
      onChangeText={setBarcode}
      placeholder="Enter barcode number"
      keyboardType="numeric"
      className="bg-gray-100 p-4 rounded-xl text-gray-900 text-lg mb-6"
      placeholderTextColor="#9ca3af"
    />
    <TouchableOpacity
      onPress={onSubmit}
      disabled={loading}
      className={`p-4 rounded-xl ${loading ? "bg-yellow-400" : "bg-yellow-500"}`}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text className="text-white text-center font-medium">Search</Text>
      )}
    </TouchableOpacity>
  </BaseModal>
);

const ResultModal: React.FC<ResultModalProps> = ({
  visible,
  onClose,
  product,
  barcode,
}) => (
  <BaseModal visible={visible} onClose={onClose}>
    {product ? (
      <>
        <Text className="text-xl font-bold text-gray-900 mb-6">
          Product Found
        </Text>
        <View className="bg-gray-50 rounded-xl p-4 mb-6">
          <Text className="text-base font-medium text-gray-900">
            {product.name}
          </Text>
          <Text className="text-sm text-gray-500 mt-1">{product.barcode}</Text>
        </View>
        <TouchableOpacity
          className="bg-yellow-500 p-4 rounded-xl"
          onPress={() => {
            router.push(`/products/${product.id}`);
            onClose();
          }}
        >
          <Text className="text-white text-center font-medium">View Details</Text>
        </TouchableOpacity>
      </>
    ) : (
      <>
        <Text className="text-xl font-bold text-gray-900 mb-6">
          Product Not Found
        </Text>
        <View className="bg-gray-50 rounded-xl p-4 mb-6">
          <Text className="text-base text-gray-500">
            No product found with barcode:
          </Text>
          <Text className="text-lg font-medium text-gray-900 mt-1">
            {barcode}
          </Text>
        </View>
        <TouchableOpacity
          className="bg-yellow-500 p-4 rounded-xl"
          onPress={() => {
            router.push(`/products/add?barcode=${barcode}`);
            onClose();
          }}
        >
          <Text className="text-white text-center font-medium">
            Add New Product
          </Text>
        </TouchableOpacity>
      </>
    )}
  </BaseModal>
);

const CameraPreview: React.FC<CameraPreviewProps> = ({
  scanned,
  onBarcodeScanned,
  isActive,
}) => {
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    requestPermission();
  }, []);

  if (!permission?.granted) {
    return (
      <View className="flex-1 justify-center items-center bg-black/20">
        <Text className="text-white text-center mb-4">
          We need camera permission to scan barcodes
        </Text>
      </View>
    );
  }

  if (!isActive) {
    return (
      <View className="flex-1 justify-center items-center bg-black/20">
        <CameraOff size={48} color="#ffffff" opacity={0.5} />
        <Text className="text-white mt-4 opacity-50">Camera is disabled</Text>
      </View>
    );
  }

  return (
    <CameraView
      className="flex-1"
      facing="back"
      barcodeScannerSettings={{
        barCodeTypes: ["ean13", "ean8", "upc_a", "upc_e"],
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
  );
};

const ScanScreen = () => {
  const [barcode, setBarcode] = useState("");
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showInputModal, setShowInputModal] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [alertConfig, setAlertConfig] = useState({
    type: "error" as "success" | "error" | "warning" | "info",
    title: "",
    message: "",
    isVisible: false,
  });

  const showAlert = (
    type: "success" | "error" | "warning" | "info",
    title: string,
    message: string
  ) => {
    setAlertConfig({
      type,
      title,
      message,
      isVisible: true,
    });
  };

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

      const response = await fetch(`${API_URL}/products?barcode=${barcodeValue}`);
      if (!response.ok) {
        throw new Error("Product search failed");
      }

      const data = await response.json();
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
      showAlert(
        "success",
        "Product Found",
        "Product successfully located in database"
      );
    } else {
      triggerVibration([100, 100, 100]);
      setShowResultModal(true);
      setError("Product not found");
      showAlert(
        "warning",
        "Product Not Found",
        "This product is not in our database"
      );
    }
  };

  const handleSearchError = (err: unknown) => {
    console.error("Server connection error", err);
    triggerVibration([100, 200, 100]);
    setError("Server connection error");
    showAlert(
      "error",
      "Connection Error",
      "Failed to connect to the server. Please try again."
    );
  };

  const handleManualSearch = () => {
    if (barcode.length < 8) {
      setError("Barcode must contain at least 8 digits");
      triggerVibration([100, 200, 100]);
      showAlert(
        "error",
        "Invalid Barcode",
        "Barcode must contain at least 8 digits"
      );
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

      {/* Alert Component */}
      <Alert
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        isVisible={alertConfig.isVisible}
        onClose={() => setAlertConfig((prev) => ({ ...prev, isVisible: false }))}
      />
    </View>
  );
};

export default ScanScreen;