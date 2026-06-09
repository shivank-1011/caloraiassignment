import React from 'react';
import { StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { SvgProps } from 'react-native-svg';
import { Radius } from '../constants';

interface ActionButtonProps {
  Icon: React.FC<SvgProps>;
  iconColor?: string;
  iconSize?: number;
  bgColor: string;
  size?: 'sm' | 'lg';
  onPress: () => void;
  style?: ViewStyle;
}

export default function ActionButton({
  Icon,
  iconColor = '#FFFFFF',
  iconSize,
  bgColor,
  size = 'sm',
  onPress,
  style,
}: ActionButtonProps) {
  const dimension = size === 'lg' ? 64 : 52;
  const resolvedIconSize = iconSize ?? (size === 'lg' ? 24 : 20);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[
        styles.button,
        {
          width: dimension,
          height: dimension,
          borderRadius: dimension / 2,
          backgroundColor: bgColor,
        },
        style,
      ]}
    >
      <Icon width={resolvedIconSize} height={resolvedIconSize} color={iconColor} />
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
});
