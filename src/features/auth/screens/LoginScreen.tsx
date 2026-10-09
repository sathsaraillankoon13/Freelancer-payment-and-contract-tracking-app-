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
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { HeaderBack } from '@/components/ui/HeaderBack';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { IsaacifyLogo } from '@/components/branding/IsaacifyLogo';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';
import { useAppContext } from '@/context/AppContext';
import { AuthService } from '@/services/authService';

export const LoginScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { switchRole } = useAppContext();
  const [email, setEmail] = useState('kasun@creativepulse.lk');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const handleLogin = async () => {
    const newErrors: { email?: string; password?: string; general?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Please enter your email address.';
    } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      newErrors.password = 'Please enter your password.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const res = await AuthService.signInWithEmail(email, password);
      if (res.success && res.user) {
        switchRole(res.user.role);
        router.replace('/home');
      } else {
        setErrors({ general: res.error || 'Failed to sign in. Please verify your credentials.' });
      }
    } catch {
      setErrors({ general: 'An unexpected connection error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setErrors({});
    try {
      const res = await AuthService.signInWithGoogle('freelancer');
      if (res.success && res.user) {
        switchRole(res.user.role);
        router.replace('/home');
      } else if (res.cancelled) {
        // User cancelled, clean exit without error alert
      } else if (res.error) {
        setErrors({ general: res.error });
      }
    } catch {
      setErrors({ general: 'Google sign-in could not be completed.' });
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleForgotPassword = () => {
    router.push('/auth/forgot-password');
  };

  const handleCreateAccount = () => {
    router.push('/auth/account-type');
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
              <IsaacifyLogo size={68} />
            </View>

            {/* Headings */}
            <View style={styles.headingSection}>
              <Text style={styles.title}>Welcome back</Text>
              <Text style={styles.subtitle}>
                Log in to manage your client work.
              </Text>

              {/* Demo Login Presets */}
              <View style={styles.demoPillsRow}>
                <TouchableOpacity
                  style={[
                    styles.demoPill,
                    email === 'kasun@creativepulse.lk' && styles.demoPillActive,
                  ]}
                  onPress={() => {
                    setEmail('kasun@creativepulse.lk');
                    setPassword('password123');
                    setErrors({});
                  }}
                >
                  <Text
                    style={[
                      styles.demoPillText,
                      email === 'kasun@creativepulse.lk' && styles.demoPillTextActive,
                    ]}
                  >
                    ⚡ Freelancer
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.demoPill,
                    email === 'company@isaacify.io' && styles.demoPillActive,
                  ]}
                  onPress={() => {
                    setEmail('company@isaacify.io');
                    setPassword('password123');
                    setErrors({});
                  }}
                >
                  <Text
                    style={[
                      styles.demoPillText,
                      email === 'company@isaacify.io' && styles.demoPillTextActive,
                    ]}
                  >
                    ⚡ Company
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.demoPill,
                    email === 'senuri@ceylonbites.lk' && styles.demoPillActive,
                  ]}
                  onPress={() => {
                    setEmail('senuri@ceylonbites.lk');
                    setPassword('password123');
                    setErrors({});
                  }}
                >
                  <Text
                    style={[
                      styles.demoPillText,
                      email === 'senuri@ceylonbites.lk' && styles.demoPillTextActive,
                    ]}
                  >
                    ⚡ Client
                  </Text>
                </TouchableOpacity>
              </View>
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
                placeholder="••••••••"
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

              {/* Forgot password link */}
              <TouchableOpacity
                onPress={handleForgotPassword}
                style={styles.forgotPasswordWrapper}
                activeOpacity={0.7}
              >
                <Text style={styles.forgotPasswordText}>Forgot password?</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Bottom Actions */}
          <View style={styles.bottomSection}>
            <Button
              title="Log in"
              loading={loading}
              onPress={handleLogin}
              style={styles.loginButton}
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
              onPress={handleGoogleSignIn}
              disabled={googleLoading || loading}
              activeOpacity={0.8}
            >
              {googleLoading ? (
                <ActivityIndicator size="small" color={colors.textPrimary} />
              ) : (
                <>
                  <Ionicons name="logo-google" size={18} color="#EA4335" style={{ marginRight: 10 }} />
                  <Text style={styles.googleButtonText}>Continue with Google</Text>
                </>
              )}
            </TouchableOpacity>

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>New to ISAACIFY? </Text>
              <TouchableOpacity onPress={handleCreateAccount}>
                <Text style={styles.createAccountLink}>Create account</Text>
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
    marginVertical: 12,
  },
  headingSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontFamily: typography.fonts.bold,
    fontSize: 28,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 34,
  },
  subtitle: {
    fontFamily: typography.fonts.regular,
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  demoPillsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 14,
    marginBottom: 4,
  },
  demoPill: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  demoPillActive: {
    backgroundColor: '#F3E8FF',
    borderColor: colors.buttonPrimary,
  },
  demoPillText: {
    fontSize: 12,
    fontFamily: typography.fonts.medium,
    color: colors.textSecondary,
  },
  demoPillTextActive: {
    fontFamily: typography.fonts.bold,
    color: colors.buttonPrimary,
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
  forgotPasswordWrapper: {
    alignSelf: 'flex-end',
    marginTop: -4,
    marginBottom: 20,
    paddingVertical: 4,
  },
  forgotPasswordText: {
    fontFamily: typography.fonts.medium,
    fontSize: 14,
    color: colors.buttonPrimary,
  },
  bottomSection: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  loginButton: {
    width: '100%',
    marginBottom: 14,
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
  createAccountLink: {
    fontFamily: typography.fonts.bold,
    fontSize: 14,
    color: colors.buttonPrimary,
  },
});

export default LoginScreen;
