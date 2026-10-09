import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';
import { HeaderBack } from '@/components/ui/HeaderBack';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { IsaacifyLogo } from '@/components/branding/IsaacifyLogo';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';
import { useAppContext } from '@/context/AppContext';
import { AuthService } from '@/services/authService';
import { UserRole } from '@/types';

export const RegisterScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { switchRole } = useAppContext();
  const params = useLocalSearchParams<{
    accountTypeId?: string;
    accountTypeName?: string;
  }>();

  const accountTypeName = params.accountTypeName || 'Individual Freelancer';
  const accountTypeId = (params.accountTypeId as UserRole) || 'freelancer';

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});

  const handleChangeAccountType = () => {
    router.push('/auth/account-type');
  };

  const handleContinue = async () => {
    const newErrors: typeof errors = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Please enter your full name.';
    }

    if (!email.trim()) {
      newErrors.email = 'Please enter your email address.';
    } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
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

    try {
      const res = await AuthService.signUpWithEmail(
        email,
        password,
        fullName,
        accountTypeId
      );

      if (res.success && res.user) {
        switchRole(accountTypeId);
        router.replace('/home');
      } else {
        setErrors({ general: res.error || 'Registration failed. Please try again.' });
      }
    } catch {
      setErrors({ general: 'Connection error during account creation. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    setErrors({});
    try {
      const res = await AuthService.signInWithGoogle(accountTypeId);
      if (res.success && res.user) {
        switchRole(res.user.role);
        router.replace('/home');
      } else if (res.cancelled) {
        // User cancelled, clean exit without error
      } else if (res.error) {
        setErrors({ general: res.error });
      }
    } catch {
      setErrors({ general: 'Google sign-up could not be completed.' });
    } finally {
      setGoogleLoading(false);
    }
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

            {/* Official ISAACIFY Logo */}
            <View style={styles.logoContainer}>
              <IsaacifyLogo size={56} />
            </View>

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
                Join ISAACIFY to manage projects and clients seamlessly.
              </Text>
            </View>

            {/* Selected Account Type Card */}
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
                activeOpacity={0.7}
              >
                <Text style={styles.changeLink}>Change</Text>
              </TouchableOpacity>
            </View>

            {/* General Error Banner */}
            {errors.general ? (
              <View style={styles.errorBanner}>
                <Ionicons name="alert-circle" size={18} color={colors.error} />
                <Text style={styles.errorBannerText}>{errors.general}</Text>
              </View>
            ) : null}

            {/* Inputs */}
            <View style={styles.formSection}>
              <Input
                label="Full name"
                placeholder="e.g. Kasun Perera"
                value={fullName}
                onChangeText={(text) => {
                  setFullName(text);
                  if (errors.fullName || errors.general) {
                    setErrors((prev) => ({ ...prev, fullName: undefined, general: undefined }));
                  }
                }}
                autoCapitalize="words"
                autoCorrect={false}
                error={errors.fullName}
              />

              <Input
                label="Email address"
                placeholder="name@example.com"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email || errors.general) {
                    setErrors((prev) => ({ ...prev, email: undefined, general: undefined }));
                  }
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                error={errors.email}
              />

              <Input
                label="Password"
                placeholder="At least 6 characters"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password || errors.general) {
                    setErrors((prev) => ({ ...prev, password: undefined, general: undefined }));
                  }
                }}
                isPassword
                error={errors.password}
              />

              <Input
                label="Confirm password"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (errors.confirmPassword || errors.general) {
                    setErrors((prev) => ({ ...prev, confirmPassword: undefined, general: undefined }));
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
              title="Create Account"
              loading={loading}
              onPress={handleContinue}
              style={styles.continueButton}
            />

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Google Authentication Button */}
            <TouchableOpacity
              style={styles.googleButton}
              onPress={handleGoogleSignUp}
              disabled={googleLoading || loading}
              activeOpacity={0.8}
            >
              {googleLoading ? (
                <ActivityIndicator size="small" color={colors.textPrimary} />
              ) : (
                <>
                  <Ionicons name="logo-google" size={18} color="#EA4335" style={{ marginRight: 10 }} />
                  <Text style={styles.googleButtonText}>Sign up with Google</Text>
                </>
              )}
            </TouchableOpacity>

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
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  stepHeader: {
    marginBottom: 20,
  },
  stepTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  stepTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: 16,
    color: colors.textPrimary,
  },
  stepBadge: {
    backgroundColor: colors.badgeBackground,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
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
    marginBottom: 20,
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
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
    gap: 8,
  },
  errorBannerText: {
    flex: 1,
    fontSize: 13,
    fontFamily: typography.fonts.medium,
    color: colors.error,
    lineHeight: 18,
  },
  formSection: {
    width: '100%',
  },
  bottomSection: {
    width: '100%',
    alignItems: 'center',
    marginTop: 16,
  },
  continueButton: {
    width: '100%',
    marginBottom: 12,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    paddingHorizontal: 12,
    fontSize: 13,
    color: colors.textSecondary,
    fontFamily: typography.fonts.medium,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: colors.white,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  googleButtonText: {
    fontFamily: typography.fonts.medium,
    fontSize: 15,
    color: colors.textPrimary,
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
