import React from 'react';
import {
  Platform,
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
import BackgroundBlobs from '../components/BackgroundBlobs';
import BottomNav from '../components/BottomNav';
import { Colors, Spacing, Typography, Radius } from '../constants';
import { RootStackParamList } from '../types';
import { globalResults } from '../data';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'FAQ'>;

export default function FAQScreen() {
  const navigation = useNavigation<NavProp>();

  const handleTabPress = (tab: 'Start' | 'FAQ' | 'TasteProfile' | 'Search') => {
    if (tab === 'Start') navigation.navigate('Intro');
    if (tab === 'FAQ') navigation.navigate('FAQ');
    if (tab === 'TasteProfile') navigation.navigate('Results', { results: globalResults });
  };

  return (
    <LinearGradient
      colors={[Colors.gradientTop, Colors.gradientBottom]}
      style={styles.root}
    >
      <BackgroundBlobs />
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.75}>
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
                colors={['#18181A', '#0A0A0A']}
                start={{ x: 0.2, y: 1 }}
                end={{ x: 0.8, y: 0 }}
                style={styles.backBtnInner}
              >
                <Text style={styles.backIcon}>‹</Text>
              </LinearGradient>
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.heading} numberOfLines={1} adjustsFontSizeToFit>
            Frequently Asked
          </Text>
        </View>

        <View style={styles.cardWrapper}>
          <GlassCard style={styles.card}>
            <View style={styles.cardInner}>
              <Text style={styles.mainEmoji}>🤔</Text>
              <Text style={styles.cardTitle}>Got Questions?</Text>
              <Text style={styles.cardBody}>
                We're here to help you understand how your Taste Profile is built.
              </Text>
              <Text style={styles.cardSubBody}>
                This is a dummy FAQ screen to demonstrate the bottom navigation.
              </Text>
            </View>
          </GlassCard>
        </View>

        <BottomNav activeTab="FAQ" onTabPress={handleTabPress} />
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
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xs,
    gap: Spacing.md,
  },
  backBtnGradient: {
    width: 48,
    height: 48,
    borderRadius: Radius.full,
    padding: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  backBtnInner: {
    flex: 1,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
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
    fontFamily: Typography.fontFamily,
    fontSize: 28,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  cardWrapper: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 400,
  },
  cardInner: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  mainEmoji: {
    fontSize: 72,
    lineHeight: 80,
    marginBottom: 16,
  },
  cardTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 16,
  },
  cardBody: {
    fontFamily: Typography.fontFamily,
    fontSize: 16,
    color: 'rgba(217, 217, 217, 1)',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 320,
    marginBottom: 20,
  },
  cardSubBody: {
    fontFamily: Typography.fontFamily,
    fontSize: 14,
    color: 'rgba(217, 217, 217, 1)',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 320,
    marginBottom: 32,
  },
});
