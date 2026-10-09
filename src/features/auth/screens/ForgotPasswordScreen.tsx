import { ScreenBackdrop } from '@/components/ui/Surface';
import { MotionTouchable as TouchableOpacity } from '@/components/ui/Motion';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';
import { HeaderBack } from '@/components/ui/HeaderBack';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';
import { useAppContext } from '@/context/AppContext';

export const ForgotPasswordScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { resetPassword } = useAppContext();

  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  const handleReset = async () => {
    const errs: typeof errors = {};

    if (!email.trim()) {
      errs.email = 'Please enter your registered email address.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Please enter a valid email address.';
    }

    if (!newPassword) {
      errs.newPassword = 'Please enter a new password.';
    } else if (newPassword.length < 8) {
      errs.newPassword = 'Password must be at least 8 characters.';
    }

    if (newPassword !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setLoading(true);

    let success = false;
    try { success = await resetPassword(email.trim(), newPassword, currentPassword); }
    catch { setErrors({ email: 'Unable to update your account. Please try again.' }); setLoading(false); return; }
    setLoading(false);

    if (success) {
      Alert.alert(
        'Password Reset Successful',
        'Your password has been securely updated. Please log in with your new credentials.',
        [
          {
            text: 'Log In',
            onPress: () => router.replace('/auth/login'),
          },
        ]
      );
    } else {
      setErrors({ email: 'The email or current password is incorrect.' });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
      <ScreenBackdrop />
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
          <HeaderBack />

          {/* Central Circular Lock Graphic matching design */}
          <View style={styles.lockGraphicWrapper}>
            <View style={styles.lockOuterCircle}>
              <View style={styles.lockInnerCircle}>
                <Ionicons name="lock-closed" size={38} color={colors.buttonPrimary} />
                <View style={styles.lockBadgeCheck}>
                  <Feather name="check" size={12} color={colors.white} />
                </View>
              </View>
            </View>
          </View>

          {/* Headings */}
          <View style={styles.headingSection}>
            <Text style={styles.title}>Change password</Text>
            <Text style={styles.subtitle}>
              Enter your current password to change it. If you have forgotten it, verified email recovery requires connecting the account service.
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formSection}>
            <Input
              label="Registered Email" icon="mail"
              placeholder="e.g. isaacify.info@gmail.com"
              value={email}
              onChangeText={(val) => {
                setEmail(val);
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
              }}
              autoCapitalize="none"
              keyboardType="email-address"
              autoCorrect={false}
              error={errors.email}
            />

            <Input label="Current password" icon="lock" value={currentPassword} onChangeText={setCurrentPassword} isPassword placeholder="Enter current password" />
            <Input
              label="New password" icon="lock"
              placeholder="••••••••"
              value={newPassword}
              onChangeText={(val) => {
                setNewPassword(val);
                if (errors.newPassword)
                  setErrors((prev) => ({ ...prev, newPassword: undefined }));
              }}
              isPassword
              error={errors.newPassword}
            />

            <Input
              label="Confirm new password" icon="lock"
              placeholder="••••••••"
              value={confirmPassword}
              onChangeText={(val) => {
                setConfirmPassword(val);
                if (errors.confirmPassword)
                  setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
              }}
              isPassword
              error={errors.confirmPassword}
            />

            <View style={styles.infoRow}>
              <Feather name="info" size={14} color={colors.textSecondary} />
              <Text style={styles.infoText}>Use at least 8 characters.</Text>
            </View>

            <View style={styles.buttonWrapper}>
              <Button
                title="Reset password"
                onPress={handleReset}
                loading={loading}
                showArrow
              />
            </View>

            <View style={styles.loginRow}>
              <Text style={styles.loginPrompt}>Remember your password? </Text>
              <TouchableOpacity onPress={() => router.push('/auth/login')}>
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
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
  },
  lockGraphicWrapper: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  lockOuterCircle: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: '#F3EEFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockInnerCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#EBE2FF',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  lockBadgeCheck: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  headingSection: {
    alignItems: 'center',
    marginBottom: 28,
  },
  title: {
    fontFamily: typography.fonts.bold,
    fontSize: 26,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: typography.fonts.regular,
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  formSection: {
    width: '100%',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: -8,
    marginBottom: 24,
  },
  infoText: {
    fontFamily: typography.fonts.regular,
    fontSize: 13,
    color: colors.textSecondary,
  },
  buttonWrapper: {
    marginTop: 4,
    marginBottom: 24,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  loginPrompt: {
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
