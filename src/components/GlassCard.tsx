import React from 'react';
import { Platform, StyleSheet, View, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { Glass, Colors } from '../constants';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
}

export default function GlassCard({ children, style }: GlassCardProps) {
  if (Platform.OS === 'ios') {
    return (
      <BlurView
        intensity={Glass.blurIntensity}
        tint={Glass.blurTint}
        style={[styles.card, style]}
      >
        <View style={styles.overlay}>{children}</View>
      </BlurView>
    );
  }

  return (
    <View style={[styles.card, styles.androidCard, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Glass.borderRadius,
    borderWidth: Glass.borderWidth,
    borderColor: Glass.borderColor,
    overflow: 'hidden',
  },
  overlay: {
    backgroundColor: Colors.bgCard,
    flex: 1,
  },
  androidCard: {
    backgroundColor: Colors.bgCardSolid,
  },
});
