import React from 'react';
import { Text } from 'react-native';

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => (
  <Text className="text-red-500 text-xs mt-1 ml-1">{message}</Text>
);