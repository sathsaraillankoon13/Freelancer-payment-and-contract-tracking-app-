import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';

export const EmailVerificationScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ email?: string }>();
  const email = params.email || 'user@example.com';

  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(45);
  const canResend = resendTimer === 0;
  const [isVerifying, setIsVerifying] = useState(false);

  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleOtpChange = (text: string, index: number) => {
    // Only accept digits
    const cleaned = text.replace(/[^0-9]/g, '');
    const newOtp = [...otp];

    if (cleaned.length > 1) {
      // Paste handling
      const digits = cleaned.slice(0, 6).split('');
      for (let i = 0; i < 6; i++) {
        newOtp[i] = digits[i] || '';
      }
      setOtp(newOtp);
      const nextIndex = Math.min(digits.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    newOtp[index] = cleaned;
    setOtp(newOtp);

    // Auto-advance
    if (cleaned && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const code = otp.join('');
    if (code.length < 6) {
      Alert.alert('Incomplete Code', 'Please enter all 6 digits of the verification code.');
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      Alert.alert(
        'Email Verified!',
        'Your email address has been successfully verified. You can now access your workspace.',
        [
          {
            text: 'Go to Dashboard',
            onPress: () => router.replace('/home'),
          },
        ]
      );
    }, 800);
  };

  const handleResend = () => {
    if (!canResend) return;
    setResendTimer(45);
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
    Alert.alert('Code Resent', `A new 6-digit verification code has been sent to ${email}.`);
  };

  const handleChangeEmail = () => {
    Alert.alert(
      'Change Email',
      'Would you like to return to setup and enter a different email address?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Change', onPress: () => router.back() },
      ]
    );
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
          showsVerticalScrollIndicator={false}
        >
          {/* Top Bar with Back Button */}
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Feather name="arrow-left" size={22} color={colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.topBarTitle}>Verification</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Icon Badge */}
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <Feather name="mail" size={32} color={colors.buttonPrimary} />
            </View>
          </View>

          {/* Heading */}
          <Text style={styles.title}>Verify Your Email</Text>
          <Text style={styles.subtitle}>
            We have sent a 6-digit confirmation code to:
          </Text>
          <View style={styles.emailBadge}>
            <Text style={styles.emailText}>{email}</Text>
          </View>

          {/* 6 OTP Boxes */}
          <View style={styles.otpRow}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}
                style={[
                  styles.otpInput,
                  digit ? styles.otpInputFilled : null,
                  index === otp.findIndex((d) => d === '') ? styles.otpInputActive : null,
                ]}
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onChangeText={(text) => handleOtpChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                selectTextOnFocus
                textAlign="center"
              />
            ))}
          </View>

          {/* Verify Button */}
          <TouchableOpacity
            style={[
              styles.verifyButton,
              isVerifying && { opacity: 0.7 },
            ]}
            onPress={handleVerify}
            activeOpacity={0.8}
            disabled={isVerifying}
          >
            <Text style={styles.verifyButtonText}>
              {isVerifying ? 'Verifying...' : 'Verify & Continue'}
            </Text>
            <Feather name="check-circle" size={18} color={colors.white} />
          </TouchableOpacity>

          {/* Resend & Change Email Actions */}
          <View style={styles.actionsFooter}>
            <View style={styles.resendRow}>
              <Text style={styles.resendNotice}>Didn&apos;t receive code? </Text>
              {canResend ? (
                <TouchableOpacity onPress={handleResend}>
                  <Text style={styles.resendLink}>Resend code</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.timerText}>Resend in {resendTimer}s</Text>
              )}
            </View>

            <TouchableOpacity
              style={styles.changeEmailButton}
              onPress={handleChangeEmail}
            >
              <Feather name="edit-2" size={14} color={colors.buttonPrimary} />
              <Text style={styles.changeEmailText}>Change email address</Text>
            </TouchableOpacity>
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
    paddingHorizontal: 24,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EFEBF5',
  },
  topBarTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: 16,
    color: colors.textPrimary,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: '#F3EEFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: typography.fonts.bold,
    fontSize: 24,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: typography.fonts.regular,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  emailBadge: {
    backgroundColor: '#EDE8F5',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignSelf: 'center',
    marginBottom: 32,
  },
  emailText: {
    fontFamily: typography.fonts.bold,
    fontSize: 13,
    color: colors.buttonPrimary,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 32,
  },
  otpInput: {
    flex: 1,
    height: 56,
    borderRadius: 14,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: '#E2DCED',
    fontSize: 22,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary,
  },
  otpInputFilled: {
    borderColor: colors.buttonPrimary,
    backgroundColor: '#FAF8FD',
  },
  otpInputActive: {
    borderColor: colors.buttonPrimary,
  },
  verifyButton: {
    backgroundColor: colors.buttonPrimary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 28,
  },
  verifyButtonText: {
    fontFamily: typography.fonts.bold,
    fontSize: 16,
    color: colors.white,
  },
  actionsFooter: {
    alignItems: 'center',
    gap: 16,
  },
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resendNotice: {
    fontFamily: typography.fonts.regular,
    fontSize: 14,
    color: colors.textSecondary,
  },
  resendLink: {
    fontFamily: typography.fonts.bold,
    fontSize: 14,
    color: colors.buttonPrimary,
  },
  timerText: {
    fontFamily: typography.fonts.medium,
    fontSize: 14,
    color: colors.textMuted,
  },
  changeEmailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#F3EEFB',
  },
  changeEmailText: {
    fontFamily: typography.fonts.medium,
    fontSize: 13,
    color: colors.buttonPrimary,
  },
});

export default EmailVerificationScreen;
