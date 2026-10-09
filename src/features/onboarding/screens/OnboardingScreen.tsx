import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { OnboardingCardIllustration } from '@/components/illustrations/OnboardingCardIllustration';
import { Button } from '@/components/ui/Button';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';

const SLIDES = [
  {
    title: 'Keep client work organised',
    subtitle:
      'Manage projects, messages and approvals in one place—for freelancers, teams and clients.',
  },
  {
    title: 'Track projects & milestones',
    subtitle:
      'Never miss a deadline. Keep client deliverables structured, transparent and on schedule.',
  },
  {
    title: 'Effortless client billing',
    subtitle:
      'Send branded invoices, track receipts and get paid faster with built-in payment workflows.',
  },
];

export const OnboardingScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      router.push('/auth/account-type');
    }
  };

  const handleSkip = () => {
    router.push('/auth/account-type');
  };

  const handleLogin = () => {
    router.push('/auth/login');
  };

  const slide = SLIDES[currentSlide];

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: Math.max(insets.top, 16),
            paddingBottom: Math.max(insets.bottom, 24),
          },
        ]}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header with Skip */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleSkip}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        {/* Central Illustration */}
        <View style={styles.illustrationWrapper}>
          <OnboardingCardIllustration />
        </View>

        {/* Text Section */}
        <View style={styles.textSection}>
          <Text style={styles.title}>{slide.title}</Text>
          <Text style={styles.subtitle}>{slide.subtitle}</Text>
        </View>

        {/* Dot Pagination Indicator */}
        <View style={styles.paginationRow}>
          {SLIDES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentSlide ? styles.activePill : styles.inactiveDot,
              ]}
            />
          ))}
        </View>

        {/* Actions Section */}
        <View style={styles.actionSection}>
          <Button
            title="Next"
            showArrow
            onPress={handleNext}
            style={styles.nextButton}
          />

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={handleLogin}>
              <Text style={styles.loginLink}>Log in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: 40,
    width: '100%',
  },
  skipText: {
    fontFamily: typography.fonts.medium,
    fontSize: 14,
    color: colors.textSecondary,
  },
  illustrationWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  textSection: {
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    marginVertical: 12,
  },
  title: {
    fontFamily: typography.fonts.bold,
    fontSize: 26,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 32,
  },
  subtitle: {
    fontFamily: typography.fonts.regular,
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 320,
  },
  paginationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 20,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  activePill: {
    width: 24,
    backgroundColor: colors.buttonPrimary,
  },
  inactiveDot: {
    width: 6,
    backgroundColor: '#DCD6F3',
  },
  actionSection: {
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
  },
  nextButton: {
    marginBottom: 20,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 4,
  },
  footerText: {
    fontFamily: typography.fonts.regular,
    fontSize: 14,
    color: colors.textSecondary,
  },
  loginLink: {
    fontFamily: typography.fonts.bold,
    fontSize: 14,
    color: colors.buttonPrimary,
  },
});

export default OnboardingScreen;
