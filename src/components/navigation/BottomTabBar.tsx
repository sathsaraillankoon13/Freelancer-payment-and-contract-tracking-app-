import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';

export type TabName = 'home' | 'projects' | 'messages' | 'finance' | 'more';

interface BottomTabBarProps {
  activeTab?: TabName;
  onTabPress?: (tab: TabName) => void;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeTab = 'home',
  onTabPress,
}) => {
  const insets = useSafeAreaInsets();

  const tabs: { id: TabName; label: string; icon: keyof typeof Feather.glyphMap }[] = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'projects', label: 'Projects', icon: 'folder' },
    { id: 'messages', label: 'Messages', icon: 'message-square' },
    { id: 'finance', label: 'Finance', icon: 'credit-card' },
    { id: 'more', label: 'More', icon: 'grid' },
  ];

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: Math.max(insets.bottom, 12) },
      ]}
    >
      <View style={styles.tabRow}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.tabItem}
              activeOpacity={0.7}
              onPress={() => onTabPress && onTabPress(tab.id)}
            >
              <Feather
                name={tab.icon}
                size={22}
                color={isActive ? colors.buttonPrimary : colors.textSecondary}
              />
              <Text
                style={[
                  styles.tabLabel,
                  isActive ? styles.tabLabelActive : styles.tabLabelInactive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: '#F0EFF6',
    paddingTop: 10,
    width: '100%',
  },
  tabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 56,
  },
  tabLabel: {
    fontSize: 11,
    fontFamily: typography.fonts.medium,
    marginTop: 4,
  },
  tabLabelActive: {
    color: colors.buttonPrimary,
    fontFamily: typography.fonts.bold,
  },
  tabLabelInactive: {
    color: colors.textSecondary,
  },
});

export default BottomTabBar;
