import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { Colors, Radius } from '../constants';

interface ActionButtonProps {
  icon: string;
  color: string;
  size?: 'sm' | 'lg';
  onPress: () => void;
  style?: ViewStyle;
}

export default function ActionButton({ icon, color, size = 'sm', onPress, style }: ActionButtonProps) {
  const dimension = size === 'lg' ? 64 : 52;
  const fontSize = size === 'lg' ? 26 : 22;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[
        styles.button,
        { width: dimension, height: dimension, borderRadius: dimension / 2, backgroundColor: color },
        style,
      ]}
    >
      <Text style={[styles.icon, { fontSize }]}>{icon}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
  },
  icon: {
    textAlign: 'center',
  },
});
