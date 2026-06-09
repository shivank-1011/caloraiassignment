import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import {
  Animated,
  Dimensions,
  PanResponder,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Food, SwipeDirection } from '../types';
import { Swipe, Typography } from '../constants';
import { foodEmojiMap, getCardText } from '../data';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_WIDTH = Math.min(SCREEN_WIDTH - 40, 430);
const CARD_HEIGHT = Math.min(SCREEN_HEIGHT * 0.58, 540);

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
    inputRange: [-200, 200],
    outputRange: ['-25deg', '25deg'],
    extrapolate: 'clamp',
  });

  const likeOpacity = position.x.interpolate({
    inputRange: [0, 80],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const dislikeOpacity = position.x.interpolate({
    inputRange: [-80, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const superlikeOpacity = position.y.interpolate({
    inputRange: [-80, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const unsureOpacity = position.y.interpolate({
    inputRange: [0, 80],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const flyOff = (direction: SwipeDirection) => {
    const targetX =
      direction === 'like' ? 500 :
      direction === 'dislike' ? -500 : 0;
    const targetY =
      direction === 'superlike' ? -500 :
      direction === 'unsure' ? 500 : 0;

    Animated.timing(position, {
      toValue: { x: targetX, y: targetY },
      duration: 300,
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
        const THRESHOLD = 120;
        const VELOCITY = 0.5;

        const aboveX = Math.abs(g.dx) > THRESHOLD || Math.abs(g.vx) > VELOCITY;
        const aboveY = Math.abs(g.dy) > THRESHOLD || Math.abs(g.vy) > VELOCITY;

        if (aboveX && Math.abs(g.dx) >= Math.abs(g.dy)) {
          flyOff(g.dx > 0 ? 'like' : 'dislike');
        } else if (aboveY && Math.abs(g.dy) > Math.abs(g.dx)) {
          flyOff(g.dy < 0 ? 'superlike' : 'unsure');
        } else {
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
            stiffness: 300,
          }).start();
        }
      },
    })
  ).current;

  const cardContent = (
    <View style={styles.contentContainer}>
      <Animated.View style={[styles.badgeContainer, styles.likeBadge, { opacity: likeOpacity }]}>
        <View style={[styles.badge, { backgroundColor: '#4BD883' }]}>
          <Text style={styles.badgeText}>Yes</Text>
        </View>
      </Animated.View>

      <Animated.View style={[styles.badgeContainer, styles.dislikeBadge, { opacity: dislikeOpacity }]}>
        <View style={[styles.badge, { backgroundColor: '#F95341' }]}>
          <Text style={styles.badgeText}>No</Text>
        </View>
      </Animated.View>

      <Animated.View style={[styles.badgeContainer, styles.superlikeBadge, { opacity: superlikeOpacity }]}>
        <LinearGradient colors={['#7843FF', '#4CC6FF']} style={styles.badge}>
          <Text style={styles.badgeText}>Superlike 🌟</Text>
        </LinearGradient>
      </Animated.View>

      <Animated.View style={[styles.badgeContainer, styles.unsureBadge, { opacity: unsureOpacity }]}>
        <View style={[styles.badge, { backgroundColor: '#BFBFBF' }]}>
          <Text style={styles.badgeText}>Unsure</Text>
        </View>
      </Animated.View>

      <View style={styles.foodContent}>
        <Text style={styles.emoji}>{foodEmojiMap[food.id] ?? '🍽️'}</Text>
        <Text style={styles.label}>{getCardText(food.name)}</Text>
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
            style={styles.blurCard}
          >
            {cardContent}
          </LinearGradient>
        </View>
      </LinearGradient>
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
  borderGradient: {
    padding: 1, // 1px shiny glass border
    borderRadius: 28,
    width: '100%',
    height: '100%',
  },
  cardInnerContainer: {
    flex: 1,
    borderRadius: 27, // 1px smaller to fit exactly inside border
    overflow: 'hidden',
  },
  blurCard: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  foodContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  emoji: {
    fontSize: 80,
    lineHeight: 85,
  },
  label: {
    fontFamily: Typography.fontFamily,
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 30,
    letterSpacing: -0.56,
    paddingHorizontal: 24,
  },
  badgeContainer: {
    position: 'absolute',
    zIndex: 10,
  },
  badge: {
    paddingVertical: 8.57,
    paddingHorizontal: 21.43,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  likeBadge: { 
    top: 76, 
    right: 20, 
    transform: [{ rotate: '16deg' }] 
  },
  dislikeBadge: { 
    top: 67, 
    left: 20, 
    transform: [{ rotate: '-16deg' }] 
  },
  superlikeBadge: { 
    top: 24, 
    alignSelf: 'center', 
    left: '50%',
    marginLeft: -80, // Approximate centering
  },
  unsureBadge: { 
    bottom: 20, 
    alignSelf: 'center', 
    left: '50%',
    marginLeft: -50,
  },
  badgeText: {
    fontFamily: Typography.fontFamily,
    color: '#000000',
    fontWeight: '700',
    fontSize: 16,
  },
});
