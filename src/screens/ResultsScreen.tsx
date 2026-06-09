import React from 'react';
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
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

  if ((tagCounts['protein'] || 0) + (tagCounts['red-meat'] || 0) >= 2) {
    personas.push({ emoji: '🥩', label: 'Carnivore' });
  }
  if ((tagCounts['italian'] || 0) >= 1) {
    personas.push({ emoji: '🇮🇹', label: 'Italian Food' });
  }
  if ((tagCounts['fruit'] || 0) + (tagCounts['healthy'] || 0) >= 3) {
    personas.push({ emoji: '🍇', label: 'Fruit-Lover' });
  }
  if ((tagCounts['japanese'] || 0) >= 1) {
    personas.push({ emoji: '🇯🇵', label: 'Japanese Food' });
  }
  if ((tagCounts['vegan'] || 0) + (tagCounts['plant-based'] || 0) >= 1) {
    personas.push({ emoji: '🌱', label: 'Plant-Based' });
  }
  if ((tagCounts['comfort'] || 0) >= 2) {
    personas.push({ emoji: '🍔', label: 'Comfort Eater' });
  }

  if (personas.length === 0) {
    personas.push({ emoji: '🍽️', label: 'Foodie' });
  }

  return personas.slice(0, 3);
}

function buildLifestyleTraits(results: SwipeResult[]): string[] {
  const positive = results.filter((r) => r.direction === 'like' || r.direction === 'superlike');
  const tagCounts: Record<string, number> = {};
  positive.forEach(({ food }) => {
    food.tags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  const traits: string[] = [];
  if ((tagCounts['healthy'] || 0) >= 2) traits.push('Active');
  if ((tagCounts['protein'] || 0) >= 2) traits.push('Gym-Goer');
  if ((tagCounts['vegetable'] || 0) + (tagCounts['green'] || 0) >= 2) traits.push('Walks a lot');
  if ((tagCounts['omega-3'] || 0) + (tagCounts['fiber'] || 0) >= 1) traits.push('Health Conscious');
  if (traits.length === 0) traits.push('Adventurous Eater');
  return traits;
}

function FoodList({ foods, icon }: { foods: Food[]; icon: string }) {
  return (
    <FlatList
      data={foods}
      keyExtractor={(item) => item.id.toString()}
      scrollEnabled={false}
      ItemSeparatorComponent={() => (
        <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.06)' }} />
      )}
      renderItem={({ item }) => (
        <View style={styles.listRow}>
          <View style={styles.listIcon}>
            <Text style={styles.listIconText}>{icon}</Text>
          </View>
          <Text style={styles.listItemText}>{item.name}</Text>
        </View>
      )}
    />
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
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
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
                  {i < personas.length - 1 && (
                    <View style={styles.personaDivider} />
                  )}
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
                <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.06)', marginBottom: Spacing.sm }} />
                {lifestyleTraits.map((trait) => (
                  <View key={trait} style={styles.listRow}>
                    <View style={[styles.listIcon, { backgroundColor: Colors.accentDark }]}>
                      <Text style={styles.listIconText}>✓</Text>
                    </View>
                    <Text style={styles.listItemText}>{trait}</Text>
                  </View>
                ))}
              </View>
            </GlassCard>
          )}

          {liked.length > 0 && (
            <GlassCard style={styles.card}>
              <View style={styles.cardSection}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardHeaderEmoji}>❤️</Text>
                  <View>
                    <Text style={styles.cardTitle}>Foods You Love</Text>
                    <Text style={styles.cardSubtitle}>We'll Recommend These</Text>
                  </View>
                </View>
                <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.06)', marginBottom: Spacing.sm }} />
                <FoodList foods={liked} icon="♥" />
              </View>
            </GlassCard>
          )}

          {superliked.length > 0 && (
            <GlassCard style={styles.card}>
              <View style={styles.cardSection}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardHeaderEmoji}>⭐</Text>
                  <View>
                    <Text style={styles.cardTitle}>Your Superlikes</Text>
                    <Text style={styles.cardSubtitle}>Foods You Absolutely Love</Text>
                  </View>
                </View>
                <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.06)', marginBottom: Spacing.sm }} />
                <FoodList foods={superliked} icon="★" />
              </View>
            </GlassCard>
          )}

          {unsure.length > 0 && (
            <GlassCard style={styles.card}>
              <View style={styles.cardSection}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardHeaderEmoji}>🤔</Text>
                  <View>
                    <Text style={styles.cardTitle}>You're Not Sure About</Text>
                    <Text style={styles.cardSubtitle}>We'll ask again later</Text>
                  </View>
                </View>
                <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.06)', marginBottom: Spacing.sm }} />
                <FoodList foods={unsure} icon="?" />
              </View>
            </GlassCard>
          )}

          {disliked.length > 0 && (
            <GlassCard style={styles.card}>
              <View style={styles.cardSection}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardHeaderEmoji}>🙅</Text>
                  <View>
                    <Text style={styles.cardTitle}>Foods You Hate</Text>
                    <Text style={styles.cardSubtitle}>These will never be on the menu</Text>
                  </View>
                </View>
                <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.06)', marginBottom: Spacing.sm }} />
                <FoodList foods={disliked} icon="✕" />
              </View>
            </GlassCard>
          )}

          <View style={{ height: Spacing.xl }} />
        </ScrollView>

        <BottomNav activeTab="TasteProfile" />
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.lg,
  },
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
  cardHeaderEmoji: {
    fontSize: 20,
  },
  cardTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  cardSubtitle: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
  },
  personaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    gap: Spacing.lg,
  },
  personaItem: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  personaEmoji: {
    fontSize: 40,
  },
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
  listIcon: {
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    backgroundColor: Colors.accentDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listIconText: {
    fontSize: 12,
    color: Colors.textPrimary,
    fontWeight: Typography.bold,
  },
  listItemText: {
    fontSize: Typography.base,
    color: Colors.textPrimary,
  },
});
