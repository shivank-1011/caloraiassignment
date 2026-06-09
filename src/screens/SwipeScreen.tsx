import React, { useRef, useState } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import CardStack from '../components/CardStack';
import ProgressBar from '../components/ProgressBar';
import ActionButton from '../components/ActionButton';
import { FoodCardRef } from '../components/FoodCard';
import CrossIcon from '../../assets/icons/cross.svg';
import StarIcon from '../../assets/icons/star.svg';
import QuestionIcon from '../../assets/icons/question.svg';
import CarrotIcon from '../../assets/icons/carrot.svg';
import { Colors, Spacing, Typography } from '../constants';
import { RootStackParamList, SwipeDirection, SwipeResult } from '../types';
import { foods } from '../data';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'Swipe'>;

export default function SwipeScreen() {
  const navigation = useNavigation<NavProp>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<SwipeResult[]>([]);
  const topCardRef = useRef<FoodCardRef | null>(null);
  const isDone = currentIndex >= foods.length;

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
      }, 500);
    }
  };

  const triggerSwipe = (direction: SwipeDirection) => {
    if (!isDone) topCardRef.current?.triggerSwipe(direction);
  };

  return (
    <LinearGradient colors={[Colors.gradientTop, Colors.gradientBottom]} style={styles.root}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.progressContainer}>
          <ProgressBar current={currentIndex} total={foods.length} />
        </View>

        <View style={styles.cardArea}>
          {isDone ? (
            <View style={styles.doneState}>
              <ActivityIndicator color={Colors.accent} size="large" />
              <Text style={styles.doneText}>Building your profile...</Text>
            </View>
          ) : (
            <CardStack
              foods={foods}
              currentIndex={currentIndex}
              onSwipe={handleSwipe}
              topCardRef={topCardRef}
            />
          )}
        </View>

        <View style={styles.actions}>
          <View style={styles.actionItem}>
            <ActionButton
              Icon={CrossIcon}
              iconColor="#FFFFFF"
              bgColor={Colors.dislike}
              size="lg"
              onPress={() => triggerSwipe('dislike')}
            />
            <Text style={[styles.actionLabel, { color: Colors.dislike }]}>Swipe Left</Text>
          </View>

          <View style={styles.actionItem}>
            <ActionButton
              Icon={QuestionIcon}
              iconColor="#FFFFFF"
              bgColor="rgba(255,255,255,0.15)"
              size="sm"
              onPress={() => triggerSwipe('unsure')}
            />
            <Text style={[styles.actionLabel, { color: Colors.unsure }]}>Not Sure</Text>
          </View>

          <View style={styles.actionItem}>
            <ActionButton
              Icon={StarIcon}
              iconColor="#FFFFFF"
              bgColor={Colors.superlike}
              size="sm"
              onPress={() => triggerSwipe('superlike')}
            />
            <Text style={[styles.actionLabel, { color: Colors.superlike }]}>Super Like</Text>
          </View>

          <View style={styles.actionItem}>
            <ActionButton
              Icon={CarrotIcon}
              iconColor="#FFFFFF"
              bgColor={Colors.like}
              size="lg"
              onPress={() => triggerSwipe('like')}
            />
            <Text style={[styles.actionLabel, { color: Colors.like }]}>Swipe Right</Text>
          </View>
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
    marginBottom: Spacing.lg,
  },
  cardArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneState: {
    alignItems: 'center',
    gap: Spacing.md,
  },
  doneText: {
    color: Colors.textSecondary,
    fontSize: Typography.base,
    fontWeight: Typography.medium,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: Spacing.md,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  actionItem: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  actionLabel: {
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
  },
});
