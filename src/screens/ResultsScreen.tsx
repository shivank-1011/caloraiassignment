import React from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import GlassCard from '../components/GlassCard';
import BottomNav from '../components/BottomNav';
import { Colors, Radius, Spacing, Typography } from '../constants';
import { Food, RootStackParamList, SwipeResult, TastePersona } from '../types';

type ResultsRoute = RouteProp<RootStackParamList, 'Results'>;

function buildPersonas(results: SwipeResult[]): TastePersona[] {
  const positive = results.filter((r) => r.direction === 'like' || r.direction === 'superlike');
  const tagCounts: Record<string, number> = {};
  positive.forEach(({ food }) => {
    food.tags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  const personas: TastePersona[] = [];
  if ((tagCounts['protein'] || 0) + (tagCounts['red-meat'] || 0) >= 2) personas.push({ emoji: '🥩', label: 'Carnivore' });
  if ((tagCounts['italian'] || 0) >= 1) personas.push({ emoji: '🇮🇹', label: 'Italian Food' });
  if ((tagCounts['fruit'] || 0) + (tagCounts['healthy'] || 0) >= 3) personas.push({ emoji: '🍇', label: 'Fruit-Lover' });
  if ((tagCounts['japanese'] || 0) >= 1) personas.push({ emoji: '🇯🇵', label: 'Japanese Food' });
  if ((tagCounts['vegan'] || 0) + (tagCounts['plant-based'] || 0) >= 1) personas.push({ emoji: '🌱', label: 'Plant-Based' });
  if ((tagCounts['comfort'] || 0) >= 2) personas.push({ emoji: '🍔', label: 'Comfort Eater' });
  if (personas.length === 0) personas.push({ emoji: '🍽️', label: 'Foodie' });

  return personas.slice(0, 3);
}

function buildLifestyleTraits(results: SwipeResult[]): string[] {
  const positive = results.filter((r) => r.direction === 'like' || r.direction === 'superlike');
  const tagCounts: Record<string, number> = {};
  positive.forEach(({ food }) => {
    food.tags.forEach((tag) => { tagCounts[tag] = (tagCounts[tag] || 0) + 1; });
  });

  const traits: string[] = [];
  if ((tagCounts['healthy'] || 0) >= 2) traits.push('Active');
  if ((tagCounts['protein'] || 0) >= 2) traits.push('Gym-Goer');
  if ((tagCounts['vegetable'] || 0) + (tagCounts['green'] || 0) >= 2) traits.push('Walks a lot');
  if ((tagCounts['omega-3'] || 0) + (tagCounts['fiber'] || 0) >= 1) traits.push('Health Conscious');
  if (traits.length === 0) traits.push('Adventurous Eater');
  return traits;
}

interface FoodSectionProps {
  title: string;
  subtitle: string;
  headerEmoji: string;
  foods: Food[];
  accentColor: string;
}

function FoodSection({ title, subtitle, headerEmoji, foods, accentColor }: FoodSectionProps) {
  if (foods.length === 0) return null;
  return (
    <GlassCard style={styles.card}>
      <View style={styles.cardSection}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardHeaderEmoji}>{headerEmoji}</Text>
          <View>
            <Text style={styles.cardTitle}>{title}</Text>
            <Text style={styles.cardSubtitle}>{subtitle}</Text>
          </View>
        </View>
        <View style={styles.divider} />
        <FlatList
          data={foods}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={styles.divider} />}
          renderItem={({ item }) => (
            <View style={styles.listRow}>
              <Image source={{ uri: item.image }} style={styles.foodThumb} />
              <Text style={styles.listItemText}>{item.name}</Text>
              <View style={[styles.dot, { backgroundColor: accentColor }]} />
            </View>
          )}
        />
      </View>
    </GlassCard>
  );
}

export default function ResultsScreen() {
  const navigation = useNavigation();
  const route = useRoute<ResultsRoute>();
  const { results } = route.params;

  const liked = results.filter((r) => r.direction === 'like').map((r) => r.food);
  const superliked = results.filter((r) => r.direction === 'superlike').map((r) => r.food);
  const disliked = results.filter((r) => r.direction === 'dislike').map((r) => r.food);
  const unsure = results.filter((r) => r.direction === 'unsure').map((r) => r.food);
  const personas = buildPersonas(results);
  const lifestyleTraits = buildLifestyleTraits(results);

  return (
    <LinearGradient colors={[Colors.gradientTop, Colors.gradientBottom]} style={styles.root}>
      <SafeAreaView style={styles.safe}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
              <Text style={styles.backIcon}>‹</Text>
            </TouchableOpacity>
            <Text style={styles.heading}>Your Taste Profile</Text>
            <Text style={styles.subheading}>
              Tailored to your unique needs. We'll use this for recommendations and meal plans.
            </Text>
          </View>

          <Text style={styles.sectionLabel}>Key Highlights:</Text>

          <GlassCard style={styles.card}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.personaRow}
            >
              {personas.map((p, i) => (
                <React.Fragment key={p.label}>
                  <View style={styles.personaItem}>
                    <Text style={styles.personaEmoji}>{p.emoji}</Text>
                    <Text style={styles.personaLabel}>{p.label}</Text>
                  </View>
                  {i < personas.length - 1 && <View style={styles.personaDivider} />}
                </React.Fragment>
              ))}
            </ScrollView>
          </GlassCard>

          {lifestyleTraits.length > 0 && (
            <GlassCard style={styles.card}>
              <View style={styles.cardSection}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardHeaderEmoji}>💪</Text>
                  <View>
                    <Text style={styles.cardTitle}>Lifestyle & Goals</Text>
                    <Text style={styles.cardSubtitle}>We'll use this to tailor our advice & meal plan</Text>
                  </View>
                </View>
                <View style={styles.divider} />
                {lifestyleTraits.map((trait, i) => (
                  <React.Fragment key={trait}>
                    <View style={styles.listRow}>
                      <View style={[styles.checkIcon, { backgroundColor: Colors.accentDark }]}>
                        <Text style={styles.checkText}>✓</Text>
                      </View>
                      <Text style={styles.listItemText}>{trait}</Text>
                    </View>
                    {i < lifestyleTraits.length - 1 && <View style={styles.divider} />}
                  </React.Fragment>
                ))}
              </View>
            </GlassCard>
          )}

          <FoodSection title="Foods You Love" subtitle="We'll Recommend These" headerEmoji="❤️" foods={liked} accentColor={Colors.like} />
          <FoodSection title="Your Superlikes" subtitle="Foods You Absolutely Love" headerEmoji="⭐" foods={superliked} accentColor={Colors.superlike} />
          <FoodSection title="You're Not Sure About" subtitle="We'll ask again later" headerEmoji="🤔" foods={unsure} accentColor={Colors.unsure} />
          <FoodSection title="Foods You Hate" subtitle="These will never be on the menu" headerEmoji="🙅" foods={disliked} accentColor={Colors.dislike} />

          <View style={{ height: Spacing.xl }} />
        </ScrollView>

        <BottomNav activeTab="TasteProfile" />
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
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 28,
    color: Colors.textPrimary,
    lineHeight: 32,
  },
  heading: {
    fontSize: Typography['2xl'],
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
    marginBottom: Spacing.sm,
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
    flexDirection: 'row',
    alignItems: 'center',
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
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginVertical: Spacing.xs,
  },
  personaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    gap: Spacing.lg,
  },
  personaItem: { alignItems: 'center', gap: Spacing.sm },
  personaEmoji: { fontSize: 40 },
  personaLabel: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
  },
  personaDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  foodThumb: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  listItemText: {
    flex: 1,
    fontSize: Typography.base,
    color: Colors.textPrimary,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: Radius.full,
  },
  checkIcon: {
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: {
    fontSize: 12,
    color: Colors.textPrimary,
    fontWeight: Typography.bold,
  },
});
