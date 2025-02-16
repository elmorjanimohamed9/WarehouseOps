import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Pressable,
  Alert,
} from "react-native";
import { Minus, Plus, X } from "lucide-react-native";
import { useProducts } from "@/hooks/useProducts";
import { useAuth } from "@/hooks/useAuth";

interface Localisation {
  city: string;
  latitude: number;
  longitude: number;
}

interface Stock {
  id: number;
  name: string;
  quantity: number;
  localisation: Localisation;
}

interface EditedBy {
  warehousemanId: number;
  at: string;
}

export interface Product {
  id: string;
  name: string;
  type: string;
  barcode: string;
  price: number;
  solde?: number;
  supplier: string;
  image: string;
  stocks: Stock[];
  editedBy: EditedBy[];
}

interface QuantityEditModalProps {
  isVisible: boolean;
  onClose: () => void;
  product: Product;
  onUpdate: () => void;
}

const ModalHeader: React.FC<{ title: string; onClose: () => void }> = ({
  title,
  onClose,
}) => (
  <View className="flex-row justify-between items-center mb-4">
    <Text className="text-xl font-bold text-gray-900">{title}</Text>
    <TouchableOpacity onPress={onClose} className="p-2">
      <X size={24} color="#6B7280" />
    </TouchableOpacity>
  </View>
);

const QuantityControl: React.FC<{
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
}> = ({ quantity, onIncrement, onDecrement }) => (
  <View className="flex-row items-center justify-center space-x-3">
    <TouchableOpacity
      onPress={onDecrement}
      className={`w-10 h-10 rounded-xl items-center justify-center ${
        quantity === 0 ? "bg-gray-200" : "bg-gray-100"
      }`}
      disabled={quantity === 0}
    >
      <Minus size={20} color={quantity === 0 ? "#9CA3AF" : "#4B5563"} />
    </TouchableOpacity>

    <Text className="text-lg font-semibold text-gray-900 min-w-[32px] text-center">
      {quantity}
    </Text>

    <TouchableOpacity
      onPress={onIncrement}
      className="w-10 h-10 bg-gray-100 rounded-xl items-center justify-center"
    >
      <Plus size={20} color="#4B5563" />
    </TouchableOpacity>
  </View>
);

const ActionButtons: React.FC<{
  onCancel: () => void;
  onSave: () => void;
  isLoading?: boolean;
}> = ({ onCancel, onSave, isLoading }) => (
  <View className="flex-row space-x-3">
    <TouchableOpacity
      onPress={onCancel}
      className="flex-1 p-4 rounded-2xl bg-gray-100 items-center"
      disabled={isLoading}
    >
      <Text className="text-base font-semibold text-gray-600">Cancel</Text>
    </TouchableOpacity>

    <TouchableOpacity
      onPress={onSave}
      className="flex-1 p-4 rounded-2xl bg-yellow-500 items-center"
      disabled={isLoading}
    >
      <Text className="text-base font-semibold text-white">
        {isLoading ? "Saving..." : "Save Changes"}
      </Text>
    </TouchableOpacity>
  </View>
);

const QuantityEditModal: React.FC<QuantityEditModalProps> = ({
  isVisible,
  onClose,
  product,
  onUpdate,
}) => {
  const { updateProduct, getProduct } = useProducts();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const userStock = product.stocks.find(
    (stock) => stock.id === user?.warehouseId
  );

  const [quantity, setQuantity] = useState(userStock?.quantity ?? 0);

  useEffect(() => {
    const currentUserStock = product.stocks.find(
      (stock) => stock.id === user?.warehouseId
    );
    setQuantity(currentUserStock?.quantity ?? 0);
  }, [product, user?.warehouseId, isVisible]);

  const handleQuantityChange = (increment: boolean) => {
    setQuantity((prev) => Math.max(0, prev + (increment ? 1 : -1)));
  };

  const handleSave = async () => {
    if (!userStock || !user?.warehouseId) {
      Alert.alert("Error", "Unable to update stock: No warehouse access");
      return;
    }
    if (quantity === userStock.quantity) {
      onClose();
      return;
    }

    setIsLoading(true);

    try {
      const updatedStocks = product.stocks.map((stock) =>
        stock.id === user.warehouseId ? { ...stock, quantity } : stock
      );

      const currentDate = new Date().toISOString().split("T")[0];

      const { id, ...updateData } = product;

      await updateProduct(product.id, {
        ...updateData,
        stocks: updatedStocks,
        editedBy: [
          {
            warehousemanId: parseInt(user.id),
            at: currentDate,
          },
          ...product.editedBy,
        ],
      });

      await getProduct(product.id);
      onUpdate();

      onClose();
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to update stock quantity. Please try again."
      );
      console.error("Error updating quantity:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!userStock || !user?.warehouseId) {
    return null;
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 bg-black/50 justify-end"
        onPress={onClose}
      >
        <Pressable
          className="bg-white rounded-t-3xl p-6"
          onPress={(e) => e.stopPropagation()}
        >
          <ModalHeader title="Edit Quantity" onClose={onClose} />

          <Text className="text-base text-gray-500 mb-6">{product.name}</Text>

          {/* Display the current product quantity */}
          <View className="mb-4">
            <Text className="text-lg text-gray-900 text-center">
              Current Quantity: {quantity}
            </Text>
          </View>

          <View className="bg-gray-50 p-4 rounded-2xl mb-6">
            <View className="flex-1 mb-4">
              <Text className="text-base font-semibold text-gray-900 mb-1">
                {userStock.name}
              </Text>
              <Text className="text-sm text-gray-500">
                {userStock.localisation.city}
              </Text>
            </View>

            <QuantityControl
              quantity={quantity}
              onIncrement={() => handleQuantityChange(true)}
              onDecrement={() => handleQuantityChange(false)}
            />
          </View>

          <ActionButtons
            onCancel={onClose}
            onSave={handleSave}
            isLoading={isLoading}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
};
export default QuantityEditModal;