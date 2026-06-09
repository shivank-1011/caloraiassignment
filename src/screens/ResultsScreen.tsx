import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import GlassCard from "../components/GlassCard";
import BottomNav from "../components/BottomNav";
import BackgroundBlobs from "../components/BackgroundBlobs";
import { Colors, Radius, Spacing, Typography } from "../constants";
import { Food, RootStackParamList, SwipeResult, TastePersona } from "../types";
import { globalResults, foodEmojiMap } from "../data";

import HeartIcon from "../../assets/icons/heart.svg";
import StarIcon from "../../assets/icons/star.svg";
import QuestionIcon from "../../assets/icons/question.svg";
import CrossIcon from "../../assets/icons/cross.svg";

const SCREEN_WIDTH = Dimensions.get("window").width;
const CARD_WIDTH = SCREEN_WIDTH - Spacing.lg * 2;

type ResultsRoute = RouteProp<RootStackParamList, "Results">;

function buildPersonas(results: SwipeResult[]): TastePersona[] {
  const positive = results.filter(
    (r) => r.direction === "like" || r.direction === "superlike",
  );
  const tagCounts: Record<string, number> = {};
  positive.forEach(({ food }) => {
    food.tags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  const personas: TastePersona[] = [];
  if ((tagCounts["protein"] || 0) + (tagCounts["red-meat"] || 0) >= 2)
    personas.push({ emoji: "🥩", label: "Carnivore" });
  if ((tagCounts["italian"] || 0) >= 1)
    personas.push({ emoji: "🇮🇹", label: "Italian Food" });
  if ((tagCounts["fruit"] || 0) + (tagCounts["healthy"] || 0) >= 3)
    personas.push({ emoji: "🍇", label: "Fruit-Lover" });
  if ((tagCounts["japanese"] || 0) >= 1)
    personas.push({ emoji: "🇯🇵", label: "Japanese Food" });
  if ((tagCounts["vegan"] || 0) + (tagCounts["plant-based"] || 0) >= 1)
    personas.push({ emoji: "🌱", label: "Plant-Based" });
  if ((tagCounts["comfort"] || 0) >= 2)
    personas.push({ emoji: "🍔", label: "Comfort Eater" });
  if (personas.length === 0) personas.push({ emoji: "🍽️", label: "Foodie" });

  return personas.slice(0, 3);
}

function buildLifestyleTraits(results: SwipeResult[]): string[] {
  const positive = results.filter(
    (r) => r.direction === "like" || r.direction === "superlike",
  );
  const tagCounts: Record<string, number> = {};
  positive.forEach(({ food }) => {
    food.tags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  const traits: string[] = [];
  if ((tagCounts["healthy"] || 0) >= 2) traits.push("Active");
  if ((tagCounts["protein"] || 0) >= 2) traits.push("Gym-Goer");
  if ((tagCounts["vegetable"] || 0) + (tagCounts["green"] || 0) >= 2)
    traits.push("Walks a lot");
  if ((tagCounts["omega-3"] || 0) + (tagCounts["fiber"] || 0) >= 1)
    traits.push("Health Conscious");
  if (traits.length === 0) traits.push("Adventurous Eater");
  return traits;
}

export default function ResultsScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<ResultsRoute>();
  const { results = globalResults } = route.params || {};

  const handleTabPress = (tab: "Start" | "FAQ" | "TasteProfile" | "Search") => {
    if (tab === "Start") navigation.navigate("Intro");
    if (tab === "FAQ") navigation.navigate("FAQ");
    if (tab === "TasteProfile")
      navigation.navigate("Results", { results: globalResults });
  };

  const liked = results
    .filter((r) => r.direction === "like")
    .map((r) => r.food);
  const superliked = results
    .filter((r) => r.direction === "superlike")
    .map((r) => r.food);
  const disliked = results
    .filter((r) => r.direction === "dislike")
    .map((r) => r.food);
  const unsure = results
    .filter((r) => r.direction === "unsure")
    .map((r) => r.food);
  const personas = buildPersonas(results);
  const lifestyleTraits = buildLifestyleTraits(results);

  const categories = [
    {
      title: "Foods You Love",
      subtitle: "We'll Recommend These",
      headerEmoji: "❤️",
      foods: liked,
      accentColor: Colors.like,
      Icon: HeartIcon,
    },
    {
      title: "Your Superlikes",
      subtitle: "Foods You Absolutely Love",
      headerEmoji: "⭐",
      foods: superliked,
      accentColor: Colors.superlike,
      Icon: StarIcon,
    },
    {
      title: "You're Not Sure About",
      subtitle: "We'll ask again later",
      headerEmoji: "🤔",
      foods: unsure,
      accentColor: Colors.unsure,
      Icon: QuestionIcon,
    },
    {
      title: "Foods You Hate",
      subtitle: "These will never be on the menu",
      headerEmoji: "🙅",
      foods: disliked,
      accentColor: Colors.dislike,
      Icon: CrossIcon,
    },
  ].filter((c) => c.foods.length > 0);

  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const [heights, setHeights] = useState<number[]>([]);

  const handleLayout = (index: number, event: any) => {
    const { height } = event.nativeEvent.layout;
    setHeights(prev => {
      const newHeights = [...prev];
      if (Math.abs((newHeights[index] || 0) - height) > 1) {
        newHeights[index] = height;
        return newHeights;
      }
      return prev;
    });
  };

  const handleScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    setActiveCategoryIndex(Math.round(index));
  };

  let currentHeight: any = undefined;
  if (heights.length === categories.length && heights.every(h => h > 0)) {
    if (categories.length > 1) {
      currentHeight = scrollX.interpolate({
        inputRange: categories.map((_, i) => i * CARD_WIDTH),
        outputRange: heights,
        extrapolate: 'clamp',
      });
    } else {
      currentHeight = heights[0];
    }
  }

  return (
    <LinearGradient
      colors={[Colors.gradientTop, Colors.gradientBottom]}
      style={styles.root}
    >
      <BackgroundBlobs />
      <SafeAreaView style={styles.safe}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              activeOpacity={0.75}
            >
              <LinearGradient
                colors={[
                  "rgba(255,255,255,0.5)",
                  "transparent",
                  "transparent",
                  "rgba(255,255,255,0.5)",
                ]}
                locations={[0, 0.35, 0.65, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.backBtnGradient}
              >
                <LinearGradient
                  colors={["#18181A", "#0A0A0A"]}
                  start={{ x: 0.2, y: 1 }}
                  end={{ x: 0.8, y: 0 }}
                  style={styles.backBtnInner}
                >
                  <Text style={styles.backIcon}>‹</Text>
                </LinearGradient>
              </LinearGradient>
            </TouchableOpacity>
            <Text style={styles.heading}>Your Taste Profile</Text>
            <Text style={styles.subheading}>
              Tailored to your unique needs. We'll use this for recommendations
              and meal plans.
            </Text>
          </View>

          <Text style={styles.sectionLabel}>Key Highlights:</Text>

          <GlassCard style={styles.card}>
            <View style={styles.personaRow}>
              {personas.map((p, i) => (
                <React.Fragment key={p.label}>
                  <View style={styles.personaItem}>
                    <Text style={styles.personaEmoji}>{p.emoji}</Text>
                    <Text style={styles.personaLabel} numberOfLines={1}>
                      {p.label}
                    </Text>
                  </View>
                  {i < personas.length - 1 && (
                    <View style={styles.personaDivider} />
                  )}
                </React.Fragment>
              ))}
            </View>
            <View style={styles.personaDots}>
              <View style={[styles.personaDot, styles.personaDotActive]} />
              <View style={styles.personaDot} />
            </View>
          </GlassCard>

          {lifestyleTraits.length > 0 && (
            <GlassCard style={styles.card}>
              <View style={styles.cardSection}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardHeaderEmoji}>💪</Text>
                  <View>
                    <Text style={styles.cardTitle}>Lifestyle & Goals</Text>
                    <Text style={styles.cardSubtitle}>
                      We'll use this to tailor our advice & meal plan
                    </Text>
                  </View>
                </View>
                <View style={styles.divider} />
                {lifestyleTraits.map((trait, i) => (
                  <React.Fragment key={trait}>
                    <View style={styles.listRow}>
                      <View
                        style={[
                          styles.checkIcon,
                          { backgroundColor: Colors.accentDark },
                        ]}
                      >
                        <Text style={styles.checkText}>✓</Text>
                      </View>
                      <Text style={styles.listItemText}>{trait}</Text>
                    </View>
                    {i < lifestyleTraits.length - 1 && (
                      <View style={styles.divider} />
                    )}
                  </React.Fragment>
                ))}
              </View>
            </GlassCard>
          )}

          {categories.length > 0 && (
            <GlassCard style={styles.card}>
              <Animated.View style={{ height: currentHeight, overflow: 'hidden' }}>
                <ScrollView
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false, listener: handleScroll }
                  )}
                  scrollEventThrottle={16}
                >
                  {categories.map((cat, i) => {
                    const Icon = cat.Icon;
                    return (
                      <View key={cat.title} style={{ width: CARD_WIDTH }}>
                        <View style={styles.cardSection} onLayout={(e) => handleLayout(i, e)}>
                        <View style={styles.cardHeader}>
                          <Text style={styles.cardHeaderEmoji}>
                            {cat.headerEmoji}
                          </Text>
                          <View>
                            <Text style={styles.cardTitle}>{cat.title}</Text>
                            <Text style={styles.cardSubtitle}>
                              {cat.subtitle}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.divider} />
                        {cat.foods.map((item, index) => (
                          <React.Fragment key={item.id}>
                            <View style={styles.listRow}>
                              <View
                                style={[
                                  styles.iconCircle,
                                  { backgroundColor: "rgba(255,255,255,0.05)" },
                                ]}
                              >
                                <Text style={{ fontSize: 16 }}>
                                  {foodEmojiMap[item.id] ?? "🍽️"}
                                </Text>
                              </View>
                              <Text style={styles.listItemText}>
                                {item.name}
                              </Text>
                            </View>
                            {index < cat.foods.length - 1 && (
                              <View style={styles.divider} />
                            )}
                          </React.Fragment>
                        ))}
                      </View>
                    </View>
                  );
                })}
              </ScrollView>
              </Animated.View>

              <View style={styles.categoryDots}>
                {categories.map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.personaDot,
                      activeCategoryIndex === i && styles.personaDotActive,
                    ]}
                  />
                ))}
              </View>
            </GlassCard>
          )}

          <View style={{ height: Spacing.xl }} />
        </ScrollView>

        <BottomNav activeTab="TasteProfile" onTabPress={handleTabPress} />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: Spacing.lg },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  backBtnGradient: {
    width: 48,
    height: 48,
    borderRadius: Radius.full,
    padding: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  backBtnInner: {
    flex: 1,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  backIcon: {
    fontFamily: Typography.fontFamily,
    fontSize: 36,
    color: Colors.textPrimary,
    lineHeight: 28,
    marginTop: Platform.OS === 'ios' ? 8 : -5,
    marginLeft: -2,
  },
  heading: {
    fontSize: Typography["2xl"],
    fontWeight: Typography.extrabold,
    color: Colors.textPrimary,
  },
  subheading: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  sectionLabel: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.textSecondary,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  card: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  cardSection: {
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  cardHeaderEmoji: { fontSize: 20 },
  cardTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  cardSubtitle: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
    marginVertical: Spacing.xs,
  },
  personaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  personaItem: {
    alignItems: "center",
    gap: Spacing.sm,
    flex: 1,
  },
  personaEmoji: { fontSize: 32 },
  personaLabel: {
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    textAlign: "center",
  },
  personaDivider: {
    width: 1,
    height: 30,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  personaDots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingBottom: Spacing.lg,
  },
  personaDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  personaDotActive: {
    backgroundColor: "#FFFFFF",
  },
  listRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  listItemText: {
    flex: 1,
    fontSize: Typography.base,
    color: Colors.textPrimary,
  },
  categoryDots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingBottom: Spacing.lg,
  },
  checkIcon: {
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  checkText: {
    fontSize: 12,
    color: Colors.textPrimary,
    fontWeight: Typography.bold,
  },
});
