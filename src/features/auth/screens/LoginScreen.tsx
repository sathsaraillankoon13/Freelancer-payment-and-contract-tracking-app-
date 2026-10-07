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
import { router } from 'expo-router';
import { HeaderBack } from '@/components/ui/HeaderBack';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { LoginFolderBadge } from '@/components/illustrations/LoginFolderBadge';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';
import { useAppContext } from '@/context/AppContext';

export const LoginScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { switchRole } = useAppContext();
  const [email, setEmail] = useState('kasun@creativepulse.lk');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleLogin = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Please enter your email address.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
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

    if (email.toLowerCase().includes('senuri') || email.toLowerCase().includes('client')) {
      switchRole('client');
    } else {
      switchRole('freelancer');
    }

    // Transition to Home Dashboard
    setTimeout(() => {
      setLoading(false);
      router.replace('/home');
    }, 400);
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Reset Password',
      'Password reset instructions will be sent to your email address.',
      [{ text: 'OK' }]
    );
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

            {/* Floating Top Badge Graphic */}
            <LoginFolderBadge />

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
                    ⚡ Kasun (Freelancer)
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
                    ⚡ Senuri (Client)
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Inputs */}
            <View style={styles.formSection}>
              <Input
                label="Email address"
                placeholder=""
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
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
                  if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
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
  headingSection: {
    alignItems: 'center',
    marginBottom: 28,
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
    marginTop: 24,
  },
  loginButton: {
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
  createAccountLink: {
    fontFamily: typography.fonts.bold,
    fontSize: 14,
    color: colors.buttonPrimary,
  },
});

export default LoginScreen;
