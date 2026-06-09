import React, { useRef } from 'react';
import { Dimensions, Platform, StyleSheet, Text, View, Image } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { Food, SwipeDirection } from '../types';
import { Colors, Radius, Spacing, Swipe, Typography, Glass } from '../constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - Spacing.lg * 2;
const CARD_HEIGHT = CARD_WIDTH * 1.35;

interface FoodCardProps {
  food: Food;
  onSwipe: (direction: SwipeDirection) => void;
  isTop: boolean;
}

export interface FoodCardRef {
  triggerSwipe: (direction: SwipeDirection) => void;
}

function SwipeBadge({ label, style }: { label: string; style: object }) {
  return (
    <View style={[styles.badge, style]}>
      <Text style={styles.badgeText}>{label}</Text>
    </View>
  );
}

const FoodCard = React.forwardRef<FoodCardRef, FoodCardProps>(
  ({ food, onSwipe, isTop }, ref) => {
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const cardOpacity = useSharedValue(1);

    const flyOff = (direction: SwipeDirection) => {
      const targetX =
        direction === 'like' ? SCREEN_WIDTH * 1.5 :
        direction === 'dislike' ? -SCREEN_WIDTH * 1.5 : 0;
      const targetY =
        direction === 'superlike' ? -SCREEN_WIDTH * 1.5 :
        direction === 'unsure' ? SCREEN_WIDTH * 1.5 : 0;

      translateX.value = withTiming(targetX, { duration: 350 });
      translateY.value = withTiming(targetY, { duration: 350 }, (finished) => {
        if (finished) runOnJS(onSwipe)(direction);
      });
      cardOpacity.value = withTiming(0, { duration: 300 });
    };

    React.useImperativeHandle(ref, () => ({
      triggerSwipe: (direction: SwipeDirection) => {
        flyOff(direction);
      },
    }));

    const flyOffJS = runOnJS(flyOff);

    const gesture = Gesture.Pan()
      .enabled(isTop)
      .onUpdate((e) => {
        translateX.value = e.translationX;
        translateY.value = e.translationY;
      })
      .onEnd((e) => {
        const aboveX = Math.abs(e.translationX) > Swipe.threshold || Math.abs(e.velocityX) > Swipe.velocityThreshold;
        const aboveY = Math.abs(e.translationY) > Swipe.threshold || Math.abs(e.velocityY) > Swipe.velocityThreshold;

        if (aboveX && Math.abs(e.translationX) >= Math.abs(e.translationY)) {
          flyOffJS(e.translationX > 0 ? 'like' : 'dislike');
        } else if (aboveY && Math.abs(e.translationY) > Math.abs(e.translationX)) {
          flyOffJS(e.translationY < 0 ? 'superlike' : 'unsure');
        } else {
          translateX.value = withSpring(0, { damping: 15, stiffness: 200 });
          translateY.value = withSpring(0, { damping: 15, stiffness: 200 });
        }
      });

    const cardStyle = useAnimatedStyle(() => {
      const rotate = interpolate(
        translateX.value,
        [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
        [-Swipe.cardRotationMax, 0, Swipe.cardRotationMax],
        Extrapolation.CLAMP
      );
      return {
        transform: [
          { translateX: translateX.value },
          { translateY: translateY.value },
          { rotate: `${rotate}deg` },
        ],
        opacity: cardOpacity.value,
      };
    });

    const likeOpacity = useAnimatedStyle(() => ({
      opacity: interpolate(translateX.value, [0, Swipe.threshold], [0, 1], Extrapolation.CLAMP),
    }));

    const dislikeOpacity = useAnimatedStyle(() => ({
      opacity: interpolate(translateX.value, [-Swipe.threshold, 0], [1, 0], Extrapolation.CLAMP),
    }));

    const superlikeOpacity = useAnimatedStyle(() => ({
      opacity: interpolate(translateY.value, [-Swipe.threshold, 0], [1, 0], Extrapolation.CLAMP),
    }));

    const unsureOpacity = useAnimatedStyle(() => ({
      opacity: interpolate(translateY.value, [0, Swipe.threshold], [0, 1], Extrapolation.CLAMP),
    }));

    const cardContent = (
      <View style={styles.content}>
        <Animated.View style={[styles.badge, styles.likeBadge, likeOpacity]}>
          <Text style={styles.badgeText}>Yes ✓</Text>
        </Animated.View>
        <Animated.View style={[styles.badge, styles.dislikeBadge, dislikeOpacity]}>
          <Text style={styles.badgeText}>No ✕</Text>
        </Animated.View>
        <Animated.View style={[styles.badge, styles.superlikeBadge, superlikeOpacity]}>
          <Text style={styles.badgeText}>Superlike ⭐</Text>
        </Animated.View>
        <Animated.View style={[styles.badge, styles.unsureBadge, unsureOpacity]}>
          <Text style={styles.badgeText}>Unsure</Text>
        </Animated.View>

        <View style={styles.foodContent}>
          <Image
            source={{ uri: food.image }}
            style={styles.foodImage}
            resizeMode="cover"
          />
          <Text style={styles.label}>I love eating {food.name.toLowerCase()}</Text>
        </View>
      </View>
    );

    return (
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.card, cardStyle]}>
          {Platform.OS === 'ios' ? (
            <BlurView intensity={Glass.blurIntensity} tint={Glass.blurTint} style={styles.blurCard}>
              <View style={styles.blurOverlay}>
                {cardContent}
              </View>
            </BlurView>
          ) : (
            <View style={styles.androidCard}>
              {cardContent}
            </View>
          )}
        </Animated.View>
      </GestureDetector>
    );
  }
);

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
  likeBadge: {
    top: Spacing.lg,
    right: Spacing.lg,
    backgroundColor: Colors.like,
  },
  dislikeBadge: {
    top: Spacing.lg,
    left: Spacing.lg,
    backgroundColor: Colors.dislike,
  },
  superlikeBadge: {
    top: Spacing.lg,
    alignSelf: 'center',
    backgroundColor: Colors.superlike,
    left: '20%',
  },
  unsureBadge: {
    bottom: Spacing.xl,
    alignSelf: 'center',
    backgroundColor: Colors.unsure,
    left: '30%',
  },
  badgeText: {
    color: Colors.textPrimary,
    fontWeight: Typography.bold,
    fontSize: Typography.md,
  },
});
