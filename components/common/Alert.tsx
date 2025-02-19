import React, { useEffect } from "react";
import { Animated, View, Text, TouchableOpacity } from "react-native";
import {
  AlertCircle,
  CheckCircle2,
  Info,
  XCircle,
  X as XIcon,
} from "lucide-react-native";

type AlertType = "success" | "error" | "warning" | "info";

interface AlertProps {
  type: AlertType;
  title: string;
  message: string;
  isVisible: boolean;
  onClose: () => void;
  action?: {
    label: string;
    onPress: () => void;
  };
}

const getAlertConfig = (type: AlertType) => {
  switch (type) {
    case "success":
      return {
        icon: CheckCircle2,
        bgColor: "bg-emerald-500",
        iconColor: "#ffffff",
      };
    case "error":
      return {
        icon: XCircle,
        bgColor: "bg-red-500",
        iconColor: "#ffffff",
      };
    case "warning":
      return {
        icon: AlertCircle,
        bgColor: "bg-amber-500",
        iconColor: "#ffffff",
      };
    case "info":
      return {
        icon: Info,
        bgColor: "bg-blue-500",
        iconColor: "#ffffff",
      };
  }
};

export const Alert: React.FC<AlertProps> = ({
  type,
  title,
  message,
  isVisible,
  onClose,
  action,
}) => {
  const translateY = new Animated.Value(-100);
  const config = getAlertConfig(type);
  const Icon = config.icon;

  useEffect(() => {
    if (isVisible) {
      // Slide in
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 80,
        friction: 10,
      }).start();

      // Auto dismiss if no action is provided
      if (!action) {
        const timer = setTimeout(() => {
          handleClose();
        }, 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [isVisible]);

  const handleClose = () => {
    Animated.timing(translateY, {
      toValue: -100,
      duration: 200,
      useNativeDriver: true,
    }).start(() => onClose());
  };

  if (!isVisible) return null;

  return (
    <Animated.View
      className="absolute top-0 left-0 right-0 z-50 px-4"
      style={{
        transform: [{ translateY }],
        paddingTop: 35, 
      }}
    >
      <View
        className={`${config.bgColor} rounded-2xl overflow-hidden`}
      >
        <View className="px-4 py-4 flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <View className="rounded-full p-2">
              <Icon size={20} color={config.iconColor} strokeWidth={2.5} />
            </View>
            <View className="ml-3 flex-1">
              <Text className="text-white font-semibold text-base">{title}</Text>
              {message && (
                <Text className="text-white/90 text-sm mt-0.5">{message}</Text>
              )}
            </View>
          </View>

          <View className="flex-row items-center">
            {action && (
              <TouchableOpacity
                onPress={action.onPress}
                className="mr-4 bg-white/20 px-4 py-1.5 rounded-full"
              >
                <Text className="text-white font-medium text-sm">
                  {action.label}
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={handleClose}
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
              className="bg-white/20 rounded-full p-1.5"
            >
              <XIcon size={16} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};