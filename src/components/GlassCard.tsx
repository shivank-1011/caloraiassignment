import React from 'react';
import { Platform, StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
}

export default function GlassCard({ children, style }: GlassCardProps) {
  const content = (
    <LinearGradient
      colors={['rgba(255,255,255,0.5)', 'transparent', 'transparent', 'rgba(255,255,255,0.5)']}
      locations={[0, 0.35, 0.65, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.borderGradient}
    >
      <View style={styles.cardInnerContainer}>
        <LinearGradient
          colors={['#18181A', '#0A0A0A']}
          start={{ x: 0.2, y: 1 }}
          end={{ x: 0.8, y: 0 }}
          style={styles.blur}
        >
          {children}
        </LinearGradient>
      </View>
    </LinearGradient>
  );

  return (
    <View style={[styles.shadowContainer, style]}>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  shadowContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 32,
    elevation: 12,
  },
  borderGradient: {
    padding: 1, // 1px shiny glass border
    borderRadius: 28,
    width: '100%',
  },
  cardInnerContainer: {
    borderRadius: 27, // 1px smaller to fit exactly inside border
    overflow: 'hidden',
    width: '100%',
  },
  blur: {
    width: '100%',
  },
});
