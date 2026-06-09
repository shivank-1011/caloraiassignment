import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  PanResponder,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Food, SwipeDirection } from '../types';
import { Colors, Glass, Radius, Spacing, Swipe, Typography } from '../constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - Spacing.lg * 2;
const CARD_HEIGHT = CARD_WIDTH * 1.35;

export interface FoodCardRef {
  triggerSwipe: (direction: SwipeDirection) => void;
}

interface FoodCardProps {
  food: Food;
  onSwipe: (direction: SwipeDirection) => void;
  isTop: boolean;
}

const FoodCard = forwardRef<FoodCardRef, FoodCardProps>(({ food, onSwipe, isTop }, ref) => {
  const position = useRef(new Animated.ValueXY()).current;

  const rotate = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [`-${Swipe.cardRotationMax}deg`, '0deg', `${Swipe.cardRotationMax}deg`],
    extrapolate: 'clamp',
  });

  const likeOpacity = position.x.interpolate({
    inputRange: [0, Swipe.threshold],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const dislikeOpacity = position.x.interpolate({
    inputRange: [-Swipe.threshold, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const superlikeOpacity = position.y.interpolate({
    inputRange: [-Swipe.threshold, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const unsureOpacity = position.y.interpolate({
    inputRange: [0, Swipe.threshold],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const flyOff = (direction: SwipeDirection) => {
    const targetX =
      direction === 'like' ? SCREEN_WIDTH * 1.5 :
      direction === 'dislike' ? -SCREEN_WIDTH * 1.5 : 0;
    const targetY =
      direction === 'superlike' ? -SCREEN_WIDTH * 1.5 :
      direction === 'unsure' ? SCREEN_WIDTH * 1.5 : 0;

    Animated.timing(position, {
      toValue: { x: targetX, y: targetY },
      duration: 350,
      useNativeDriver: false,
    }).start(() => onSwipe(direction));
  };

  useImperativeHandle(ref, () => ({ triggerSwipe: flyOff }));

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => isTop,
      onMoveShouldSetPanResponder: () => isTop,
      onPanResponderMove: (_, g) => {
        position.setValue({ x: g.dx, y: g.dy });
      },
      onPanResponderRelease: (_, g) => {
        const aboveX = Math.abs(g.dx) > Swipe.threshold || Math.abs(g.vx) > 0.5;
        const aboveY = Math.abs(g.dy) > Swipe.threshold || Math.abs(g.vy) > 0.5;

        if (aboveX && Math.abs(g.dx) >= Math.abs(g.dy)) {
          flyOff(g.dx > 0 ? 'like' : 'dislike');
        } else if (aboveY && Math.abs(g.dy) > Math.abs(g.dx)) {
          flyOff(g.dy < 0 ? 'superlike' : 'unsure');
        } else {
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const cardContent = (
    <View style={styles.content}>
      <Animated.View style={[styles.badge, styles.likeBadge, { opacity: likeOpacity }]}>
        <Text style={styles.badgeText}>Yes ✓</Text>
      </Animated.View>
      <Animated.View style={[styles.badge, styles.dislikeBadge, { opacity: dislikeOpacity }]}>
        <Text style={styles.badgeText}>No ✕</Text>
      </Animated.View>
      <Animated.View style={[styles.badge, styles.superlikeBadge, { opacity: superlikeOpacity }]}>
        <Text style={styles.badgeText}>Superlike ⭐</Text>
      </Animated.View>
      <Animated.View style={[styles.badge, styles.unsureBadge, { opacity: unsureOpacity }]}>
        <Text style={styles.badgeText}>Unsure</Text>
      </Animated.View>

      <View style={styles.foodContent}>
        <Image source={{ uri: food.image }} style={styles.foodImage} resizeMode="cover" />
        <Text style={styles.label}>I love eating {food.name.toLowerCase()}</Text>
      </View>
    </View>
  );

  return (
    <Animated.View
      style={[
        styles.card,
        { transform: [...position.getTranslateTransform(), { rotate }] },
      ]}
      {...panResponder.panHandlers}
    >
      {Platform.OS === 'ios' ? (
        <BlurView intensity={Glass.blurIntensity} tint={Glass.blurTint} style={styles.blurCard}>
          <View style={styles.blurOverlay}>{cardContent}</View>
        </BlurView>
      ) : (
        <View style={styles.androidCard}>{cardContent}</View>
      )}
    </Animated.View>
  );
});

export default FoodCard;

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    position: 'absolute',
    alignSelf: 'center',
  },
  blurCard: {
    flex: 1,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Glass.borderColor,
    overflow: 'hidden',
  },
  blurOverlay: {
    flex: 1,
    backgroundColor: Colors.bgCard,
  },
  androidCard: {
    flex: 1,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Glass.borderColor,
    backgroundColor: Colors.bgCardSolid,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  foodContent: {
    alignItems: 'center',
    gap: Spacing.md,
  },
  foodImage: {
    width: 140,
    height: 140,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  label: {
    fontSize: Typography.xl,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: 30,
  },
  badge: {
    position: 'absolute',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    zIndex: 10,
  },
  likeBadge: { top: Spacing.lg, right: Spacing.lg, backgroundColor: Colors.like },
  dislikeBadge: { top: Spacing.lg, left: Spacing.lg, backgroundColor: Colors.dislike },
  superlikeBadge: { top: Spacing.lg, alignSelf: 'center', left: '20%', backgroundColor: Colors.superlike },
  unsureBadge: { bottom: Spacing.xl, alignSelf: 'center', left: '30%', backgroundColor: Colors.unsure },
  badgeText: {
    color: Colors.textPrimary,
    fontWeight: Typography.bold,
    fontSize: Typography.md,
  },
});
