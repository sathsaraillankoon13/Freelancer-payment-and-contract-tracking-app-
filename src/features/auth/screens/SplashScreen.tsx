import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import { IsaacifyLogo } from '@/components/branding/IsaacifyLogo';
import { LoadingDots } from '@/components/ui/LoadingDots';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';

export const SplashScreen: React.FC = () => {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    // Automatically transition to the Onboarding screen after preview duration
    const timer = setTimeout(() => {
      router.replace('/onboarding');
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  const handlePress = () => {
    router.replace('/onboarding');
  };

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={1}
      onPress={handlePress}
    >
      <StatusBar style="dark" />

      {/* Subtle broad lavender glow behind branding */}
      <Svg
        style={StyleSheet.absoluteFill}
        width="100%"
        height="100%"
        pointerEvents="none"
      >
        <Defs>
          <RadialGradient
            id="centerGlow"
            cx="50%"
            cy="42%"
            rx="60%"
            ry="32%"
            fx="50%"
            fy="42%"
          >
            <Stop offset="0%" stopColor={colors.glowCenter} stopOpacity="0.85" />
            <Stop offset="35%" stopColor="#F2ECFA" stopOpacity="0.55" />
            <Stop offset="70%" stopColor="#F8F5FD" stopOpacity="0.25" />
            <Stop offset="100%" stopColor={colors.background} stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#centerGlow)" />
      </Svg>

      {/* Content wrapper with safe-area spacing */}
      <View
        style={[
          styles.content,
          {
            paddingTop: insets.top,
            paddingBottom: Math.max(insets.bottom, 24),
          },
        ]}
      >
        {/* Top spacer to position branding slightly above vertical center */}
        <View style={styles.topSpacer} />

        {/* Central Branding Group */}
        <View style={styles.brandingGroup}>
          <IsaacifyLogo width={60} height={70} />

          <View style={styles.titleContainer}>
            <Text style={styles.title}>ISAACIFY</Text>
            <Text style={styles.subtitle}>CRM Manager</Text>
          </View>

          <Text style={styles.tagline}>
            Your projects. Your clients. One place.
          </Text>
        </View>

        {/* Bottom spacer balancing the layout */}
        <View style={styles.bottomSpacer} />

        {/* Loading Dots at bottom of screen */}
        <View style={styles.dotsContainer}>
          <LoadingDots
            color={colors.loadingDots}
            size={7}
            gap={7}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topSpacer: {
    flex: 1.05,
  },
  brandingGroup: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: spacing.xl,
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: spacing.huge, // 40px spacing between logo bottom and title
  },
  title: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.title,
    color: colors.textPrimary,
    letterSpacing: typography.letterSpacing.title,
    textAlign: 'center',
    lineHeight: 36,
  },
  subtitle: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.subtitle,
    color: colors.primaryMedium,
    marginTop: 6,
    textAlign: 'center',
    lineHeight: 22,
  },
  tagline: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.tagline,
    color: colors.textSecondary,
    marginTop: spacing.xxl, // 24px spacing between subtitle and tagline
    textAlign: 'center',
    letterSpacing: typography.letterSpacing.tagline,
    lineHeight: 20,
  },
  bottomSpacer: {
    flex: 1.35,
  },
  dotsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 24,
    marginBottom: spacing.xxxl,
  },
});

export default SplashScreen;
