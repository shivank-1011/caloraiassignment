import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import CardStack from "../components/CardStack";
import ProgressBar from "../components/ProgressBar";
import ActionButton from "../components/ActionButton";
import BackgroundBlobs from "../components/BackgroundBlobs";
import { FoodCardRef } from "../components/FoodCard";
import CrossIcon from "../../assets/icons/cross.svg";
import StarIcon from "../../assets/icons/star.svg";
import QuestionIcon from "../../assets/icons/question.svg";
import HeartIcon from "../../assets/icons/heart.svg";
import { Colors, Spacing, Typography } from "../constants";
import { RootStackParamList, SwipeDirection, SwipeResult } from '../types';
import { foods, globalResults } from '../data';

type NavProp = NativeStackNavigationProp<RootStackParamList, "Swipe">;

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
      direction === "like" || direction === "superlike"
        ? Haptics.ImpactFeedbackStyle.Medium
        : Haptics.ImpactFeedbackStyle.Light,
    );

    if (nextIndex >= foods.length) {
      setTimeout(() => {
        // Clear globalResults and push new ones so we mutate it correctly
        globalResults.length = 0;
        globalResults.push(...newResults);
        navigation.navigate("Results", { results: newResults });
      }, 500);
    }
  };

  const triggerSwipe = (direction: SwipeDirection) => {
    if (!isDone) topCardRef.current?.triggerSwipe(direction);
  };

  return (
    <LinearGradient
      colors={[Colors.gradientTop, Colors.gradientBottom]}
      style={styles.root}
    >
      <BackgroundBlobs />
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
              bgColor="#fa0202"
              shadowColor="#fa0202"
              size="lg"
              onPress={() => triggerSwipe("dislike")}
            />
            <Text style={[styles.actionLabel]}>Swipe Left</Text>
          </View>

          <View style={styles.actionItem}>
            <ActionButton
              Icon={QuestionIcon}
              iconColor="#FFFFFF"
              bgColor="#94A3B8"
              shadowColor="rgba(255,255,255,0.4)"
              size="sm"
              onPress={() => triggerSwipe("unsure")}
            />
            <Text style={[styles.actionLabel]}>Not Sure</Text>
          </View>

          <View style={styles.actionItem}>
            <ActionButton
              Icon={StarIcon}
              iconColor="#00E5FF"
              bgColor={["#7C66FF", "#4FA5FF"]}
              shadowColor="#4FA5FF"
              size="sm"
              onPress={() => triggerSwipe("superlike")}
            />
            <Text style={[styles.actionLabel]}>Super Like</Text>
          </View>

          <View style={styles.actionItem}>
            <ActionButton
              Icon={HeartIcon}
              iconColor="#FFFFFF"
              bgColor="#0bd400"
              shadowColor="#0bd400"
              size="lg"
              onPress={() => triggerSwipe("like")}
            />
            <Text style={[styles.actionLabel]}>Swipe Right</Text>
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
    alignItems: "center",
    justifyContent: "center",
  },
  doneState: {
    alignItems: "center",
    gap: Spacing.md,
  },
  doneText: {
    color: Colors.textSecondary,
    fontSize: Typography.base,
    fontWeight: Typography.medium,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    gap: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  actionItem: {
    alignItems: "center",
    gap: Spacing.md,
  },
  actionLabel: {
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
    fontSize: 11.61,
    lineHeight: 13.93,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.85)",
    textAlign: "center",
  },
});
