import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { Colors, Radius, Typography, Spacing } from '../constants';

type TabName = 'Start' | 'FAQ' | 'TasteProfile' | 'Search';

interface BottomNavProps {
  activeTab: TabName;
  onTabPress?: (tab: TabName) => void;
}

const TABS: { name: TabName; icon: string; label: string }[] = [
  { name: 'Start', icon: '🏠', label: 'Start' },
  { name: 'FAQ', icon: '?', label: 'FAQ' },
  { name: 'TasteProfile', icon: '🍴', label: 'Taste Profile' },
  { name: 'Search', icon: '🔍', label: '' },
];

function NavContent({ activeTab, onTabPress }: BottomNavProps) {
  return (
    <View style={styles.inner}>
      <View style={styles.pillTabs}>
        {TABS.slice(0, 3).map((tab) => {
          const isActive = activeTab === tab.name;
          return (
            <TouchableOpacity
              key={tab.name}
              onPress={() => onTabPress?.(tab.name)}
              style={[styles.tab, isActive && styles.tabActive]}
              activeOpacity={0.75}
            >
              <Text style={[styles.tabIcon, { color: isActive ? Colors.navActive : Colors.navInactive }]}>
                {tab.icon}
              </Text>
              {tab.label ? (
                <Text style={[styles.tabLabel, { color: isActive ? Colors.navActive : Colors.navInactive }]}>
                  {tab.label}
                </Text>
              ) : null}
            </TouchableOpacity>
          );
        })}
      </View>
      <TouchableOpacity
        onPress={() => onTabPress?.('Search')}
        style={styles.searchButton}
        activeOpacity={0.75}
      >
        <Text style={styles.searchIcon}>🔍</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function BottomNav({ activeTab, onTabPress }: BottomNavProps) {
  if (Platform.OS === 'ios') {
    return (
      <BlurView intensity={40} tint="dark" style={styles.container}>
        <View style={styles.blurOverlay}>
          <NavContent activeTab={activeTab} onTabPress={onTabPress} />
        </View>
      </BlurView>
    );
  }

  return (
    <View style={[styles.container, styles.androidContainer]}>
      <NavContent activeTab={activeTab} onTabPress={onTabPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.navBorder,
    overflow: 'hidden',
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  androidContainer: {
    backgroundColor: Colors.navBg,
  },
  blurOverlay: {
    backgroundColor: 'rgba(10, 10, 10, 0.5)',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  pillTabs: {
    flex: 1,
    flexDirection: 'row',
    gap: 4,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.full,
    gap: 6,
  },
  tabActive: {
    backgroundColor: 'rgba(74, 222, 128, 0.12)',
  },
  tabIcon: {
    fontSize: 18,
  },
  tabLabel: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchIcon: {
    fontSize: 18,
  },
});
