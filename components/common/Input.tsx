import React from 'react';
import { View, TextInput, TouchableOpacity, TextInputProps } from 'react-native';
import { LucideIcon } from 'lucide-react-native';

interface InputProps extends TextInputProps {
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  rightIconProps?: {
    color?: string;
    size?: number;
    onPress?: () => void;
    isActive?: boolean;
  };
  containerClassName?: string;
  inputClassName?: string;
}

const Input = ({
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  rightIconProps,
  containerClassName = "",
  inputClassName = "",
  ...props
}: InputProps) => {
  return (
    <View className={`bg-white flex-row items-center px-4 rounded-xl ${containerClassName}`}>
      {LeftIcon && (
        <LeftIcon color="#eab308" size={16} />
      )}
      <TextInput
        className={`flex-1 ml-2 text-gray-900 ${inputClassName}`}
        placeholderTextColor="#9CA3AF"
        {...props}
      />
      {RightIcon && (
        <TouchableOpacity onPress={rightIconProps?.onPress}>
          <RightIcon 
            color={rightIconProps?.isActive ? "#EAB308" : "#9CA3AF"} 
            size={rightIconProps?.size || 20} 
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Input;