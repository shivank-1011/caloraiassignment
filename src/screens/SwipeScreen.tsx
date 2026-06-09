import React, { useRef, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import CardStack from '../components/CardStack';
import ProgressBar from '../components/ProgressBar';
import ActionButton from '../components/ActionButton';
import { FoodCardRef } from '../components/FoodCard';
import { Colors, Spacing } from '../constants';
import { RootStackParamList, SwipeDirection, SwipeResult } from '../types';
import { foods } from '../data';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'Swipe'>;


export default function SwipeScreen() {
  const navigation = useNavigation<NavProp>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<SwipeResult[]>([]);
  const topCardRef = useRef<FoodCardRef | null>(null);

  const handleSwipe = (direction: SwipeDirection) => {
    const food = foods[currentIndex];
    const newResults = [...results, { food, direction }];
    const nextIndex = currentIndex + 1;

    setResults(newResults);
    setCurrentIndex(nextIndex);

    Haptics.impactAsync(
      direction === 'like' || direction === 'superlike'
        ? Haptics.ImpactFeedbackStyle.Medium
        : Haptics.ImpactFeedbackStyle.Light
    );

    if (nextIndex >= foods.length) {
      setTimeout(() => {
        navigation.navigate('Results', { results: newResults });
      }, 400);
    }
  };

  const triggerSwipe = (direction: SwipeDirection) => {
    topCardRef.current?.triggerSwipe(direction);
  };

  return (
    <LinearGradient
      colors={[Colors.gradientTop, Colors.gradientBottom]}
      style={styles.root}
    >
      <SafeAreaView style={styles.safe}>
        <View style={styles.progressContainer}>
          <ProgressBar current={currentIndex} total={foods.length} />
        </View>

        <View style={styles.cardArea}>
          <CardStack
            foods={foods}
            currentIndex={currentIndex}
            onSwipe={handleSwipe}
            topCardRef={topCardRef}
          />
        </View>

        <View style={styles.actions}>
          <ActionButton
            icon="✕"
            color={Colors.dislike}
            size="lg"
            onPress={() => triggerSwipe('dislike')}
          />
          <ActionButton
            icon="?"
            color="rgba(255,255,255,0.15)"
            size="sm"
            onPress={() => triggerSwipe('unsure')}
          />
          <ActionButton
            icon="★"
            color={Colors.superlike}
            size="sm"
            onPress={() => triggerSwipe('superlike')}
          />
          <ActionButton
            icon="♥"
            color={Colors.like}
            size="lg"
            onPress={() => triggerSwipe('like')}
          />
        </View>

        <View style={styles.actionLabels}>
          <Text style={[styles.actionLabel, { color: Colors.dislike }]}>Swipe Left</Text>
          <Text style={[styles.actionLabel, { color: Colors.unsure }]}>Not Sure</Text>
          <Text style={[styles.actionLabel, { color: Colors.superlike }]}>Super Like</Text>
          <Text style={[styles.actionLabel, { color: Colors.like }]}>Swipe Right</Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safe: {
    flex: 1,
  },
  progressContainer: {
    paddingHorizontal: 0,
    marginBottom: Spacing.lg,
  },
  cardArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.sm,
  },
  actionLabels: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  actionLabel: {
    fontSize: 10,
    fontWeight: '500',
    width: 64,
    textAlign: 'center',
  },
});
