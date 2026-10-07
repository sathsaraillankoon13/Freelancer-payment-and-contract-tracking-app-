import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { HeaderBack } from '@/components/ui/HeaderBack';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';

export const RegisterScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    accountTypeId?: string;
    accountTypeName?: string;
  }>();

  const accountTypeName = params.accountTypeName || 'Individual Freelancer';
  const accountTypeId = params.accountTypeId || 'freelancer';

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const handleChangeAccountType = () => {
    router.push('/auth/account-type');
  };

  const handleContinue = () => {
    const newErrors: typeof errors = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Please enter your full name.';
    }

    if (!email.trim()) {
      newErrors.email = 'Please enter your email address.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      newErrors.password = 'Please enter a password.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Account Registered!',
        `Welcome to ISAACIFY CRM, ${fullName}! Your ${accountTypeName} account is ready.`,
        [
          {
            text: 'Go to Login',
            onPress: () => router.push('/auth/login'),
          },
        ]
      );
    }, 900);
  };

  const handleLogin = () => {
    router.push('/auth/login');
  };

  const getAccountIcon = (): keyof typeof Feather.glyphMap => {
    if (accountTypeId === 'client') return 'briefcase';
    if (accountTypeId === 'team') return 'users';
    return 'user';
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
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
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View>
            <HeaderBack />

            {/* Step 1 of 2 Indicator */}
            <View style={styles.stepHeader}>
              <View style={styles.stepTitleRow}>
                <Text style={styles.stepTitle}>Account Details</Text>
                <View style={styles.stepBadge}>
                  <Text style={styles.stepBadgeText}>Step 1 of 2</Text>
                </View>
              </View>

              {/* Progress bar */}
              <View style={styles.progressBarWrapper}>
                <View style={styles.progressBarActive} />
                <View style={styles.progressBarInactive} />
              </View>
            </View>

            {/* Headings */}
            <View style={styles.headingSection}>
              <Text style={styles.title}>Create your account</Text>
              <Text style={styles.subtitle}>
                Start organising your work with ISAACIFY.
              </Text>
            </View>

            {/* Account Type Card */}
            <View style={styles.accountTypeCard}>
              <View style={styles.accountTypeLeft}>
                <View style={styles.accountTypeIconBox}>
                  <Feather
                    name={getAccountIcon()}
                    size={20}
                    color={colors.buttonPrimary}
                  />
                </View>

                <View style={styles.accountTypeTextWrapper}>
                  <Text style={styles.accountTypeLabel}>ACCOUNT TYPE</Text>
                  <Text style={styles.accountTypeName}>{accountTypeName}</Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={handleChangeAccountType}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.changeLink}>Change</Text>
              </TouchableOpacity>
            </View>

            {/* Form Inputs */}
            <View style={styles.formSection}>
              <Input
                label="Full Name"
                placeholder=""
                value={fullName}
                onChangeText={(text) => {
                  setFullName(text);
                  if (errors.fullName) {
                    setErrors((prev) => ({ ...prev, fullName: undefined }));
                  }
                }}
                autoCapitalize="words"
                error={errors.fullName}
              />

              <Input
                label="Email address"
                placeholder=""
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email) {
                    setErrors((prev) => ({ ...prev, email: undefined }));
                  }
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                error={errors.email}
              />

              <Input
                label="Password"
                placeholder=""
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) {
                    setErrors((prev) => ({ ...prev, password: undefined }));
                  }
                }}
                isPassword
                error={errors.password}
              />

              <Input
                label="Confirm password"
                placeholder=""
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (errors.confirmPassword) {
                    setErrors((prev) => ({
                      ...prev,
                      confirmPassword: undefined,
                    }));
                  }
                }}
                isPassword
                error={errors.confirmPassword}
              />
            </View>
          </View>

          {/* Bottom Actions */}
          <View style={styles.bottomSection}>
            <Button
              title="Continue"
              loading={loading}
              onPress={handleContinue}
              style={styles.continueButton}
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
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xxl,
  },
  stepHeader: {
    marginBottom: 20,
  },
  stepTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  stepTitle: {
    fontFamily: typography.fonts.medium,
    fontSize: 14,
    color: colors.textSecondary,
  },
  stepBadge: {
    backgroundColor: colors.badgeBackground,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  stepBadgeText: {
    fontFamily: typography.fonts.bold,
    fontSize: 12,
    color: colors.badgeText,
  },
  progressBarWrapper: {
    flexDirection: 'row',
    height: 4,
    width: '100%',
    gap: 8,
  },
  progressBarActive: {
    flex: 1,
    height: '100%',
    backgroundColor: colors.progressBarActive,
    borderRadius: 2,
  },
  progressBarInactive: {
    flex: 1,
    height: '100%',
    backgroundColor: colors.progressBarInactive,
    borderRadius: 2,
  },
  headingSection: {
    marginBottom: 20,
  },
  title: {
    fontFamily: typography.fonts.bold,
    fontSize: 28,
    color: colors.textPrimary,
    lineHeight: 34,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: typography.fonts.regular,
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  accountTypeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    borderRadius: 18,
    padding: 16,
    marginBottom: 24,
  },
  accountTypeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  accountTypeIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.badgeBackground,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  accountTypeTextWrapper: {
    flex: 1,
  },
  accountTypeLabel: {
    fontFamily: typography.fonts.bold,
    fontSize: 11,
    color: colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  accountTypeName: {
    fontFamily: typography.fonts.bold,
    fontSize: 15,
    color: colors.textPrimary,
  },
  changeLink: {
    fontFamily: typography.fonts.medium,
    fontSize: 14,
    color: colors.buttonPrimary,
    paddingLeft: 8,
  },
  formSection: {
    width: '100%',
  },
  bottomSection: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  continueButton: {
    marginBottom: 20,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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

export default RegisterScreen;
