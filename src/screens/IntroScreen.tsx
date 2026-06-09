import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import GlassCard from '../components/GlassCard';
import BottomNav from '../components/BottomNav';
import { Colors, Spacing, Typography, Radius } from '../constants';
import { RootStackParamList } from '../types';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'Intro'>;

export default function IntroScreen() {
  const navigation = useNavigation<NavProp>();

  return (
    <LinearGradient
      colors={[Colors.gradientTop, Colors.gradientBottom]}
      style={styles.root}
    >
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} activeOpacity={0.7}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.heading}>Design Your Food Plan</Text>
        </View>

        <View style={styles.cardWrapper}>
          <GlassCard style={styles.card}>
            <View style={styles.cardInner}>
              <Text style={styles.mainEmoji}>😋</Text>
              <Text style={styles.cardTitle}>Build Your Taste Profile</Text>
              <Text style={styles.cardBody}>
                Swipe right on foods you love, left on foods you don't.
              </Text>
              <Text style={styles.cardSubBody}>
                This helps us recommend meals you'll love eating.
              </Text>
              <TouchableOpacity
                style={styles.ctaButton}
                onPress={() => navigation.navigate('Swipe')}
                activeOpacity={0.85}
              >
                <Text style={styles.ctaText}>Start Swiping</Text>
              </TouchableOpacity>
              <Text style={styles.hint}>Takes about 2 minutes.</Text>
            </View>
          </GlassCard>
        </View>

        <BottomNav activeTab="Start" />
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
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
    gap: Spacing.md,
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
    fontSize: Typography['3xl'],
    fontWeight: Typography.extrabold,
    color: Colors.textPrimary,
    lineHeight: 40,
  },
  cardWrapper: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  card: {
    flex: 1,
  },
  cardInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  mainEmoji: {
    fontSize: 72,
  },
  cardTitle: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  cardBody: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  cardSubBody: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  ctaButton: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.full,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing['2xl'],
    marginTop: Spacing.sm,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  ctaText: {
    fontSize: Typography.md,
    fontWeight: Typography.bold,
    color: '#0A0A0A',
    textAlign: 'center',
  },
  hint: {
    fontSize: Typography.sm,
    color: Colors.textMuted,
  },
});
