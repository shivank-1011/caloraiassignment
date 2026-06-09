import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Colors, Radius } from '../constants';

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const progress = total > 0 ? current / total : 0;

  const animatedStyle = useAnimatedStyle(() => ({
    width: withTiming(`${progress * 100}%` as any, { duration: 400 }),
  }));

  return (
    <View style={styles.track}>
      <Animated.View style={[styles.fill, animatedStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 4,
    backgroundColor: Colors.progressBg,
    borderRadius: Radius.full,
    overflow: 'hidden',
    marginHorizontal: 0,
  },
  fill: {
    height: '100%',
    backgroundColor: Colors.progressFill,
    borderRadius: Radius.full,
  },
});
