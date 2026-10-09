import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { HeaderBack } from '@/components/ui/HeaderBack';
import { Button } from '@/components/ui/Button';
import { IsaacifyLogo } from '@/components/branding/IsaacifyLogo';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';

export type AccountTypeId = 'freelancer' | 'team' | 'client';

interface AccountOption {
  id: AccountTypeId;
  name: string;
  description: string;
  iconName: keyof typeof Feather.glyphMap;
}

const ACCOUNT_OPTIONS: AccountOption[] = [
  {
    id: 'freelancer',
    name: 'Individual Freelancer',
    description: 'Manage your clients, projects and payments.',
    iconName: 'user',
  },
  {
    id: 'team',
    name: 'Freelancer Company / Team',
    description: 'Manage client work and collaborate with your team.',
    iconName: 'users',
  },
  {
    id: 'client',
    name: 'Client',
    description: 'Track your projects, review work and manage payments.',
    iconName: 'briefcase',
  },
];

export const AccountTypeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  // Default to 'client' to match the active state in reference screenshot Image 2
  const [selectedType, setSelectedType] = useState<AccountTypeId>('client');
  const [showInviteInput, setShowInviteInput] = useState(false);
  const [inviteCode, setInviteCode] = useState('');

  const handleContinue = () => {
    const chosen = ACCOUNT_OPTIONS.find((opt) => opt.id === selectedType);
    router.push({
      pathname: '/auth/register',
      params: {
        accountTypeId: selectedType,
        accountTypeName: chosen?.name || 'Client',
      },
    });
  };

  const handleLogin = () => {
    router.push('/auth/login');
  };

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
        <View>
          <HeaderBack />

          {/* Official ISAACIFY Logo */}
          <View style={{ alignItems: 'center', marginVertical: 8 }}>
            <IsaacifyLogo size={56} />
          </View>

          {/* Heading */}
          <View style={styles.headingSection}>
            <Text style={styles.title}>Welcome to ISAACIFY</Text>
            <Text style={styles.subtitle}>Choose how you’ll use ISAACIFY Freelancer App.</Text>
          </View>

          {/* Options Cards */}
          <View style={styles.optionsList}>
            {ACCOUNT_OPTIONS.map((option) => {
              const isSelected = selectedType === option.id;

              return (
                <TouchableOpacity
                  key={option.id}
                  activeOpacity={0.8}
                  onPress={() => setSelectedType(option.id)}
                  style={[
                    styles.card,
                    isSelected ? styles.cardSelected : styles.cardDefault,
                  ]}
                >
                  {/* Icon */}
                  <View
                    style={[
                      styles.iconContainer,
                      isSelected
                        ? styles.iconContainerSelected
                        : styles.iconContainerDefault,
                    ]}
                  >
                    <Feather
                      name={option.iconName}
                      size={20}
                      color={isSelected ? colors.white : colors.iconColorDefault}
                    />
                  </View>

                  {/* Text details */}
                  <View style={styles.cardTextContainer}>
                    <Text style={styles.cardTitle}>{option.name}</Text>
                    <Text style={styles.cardDescription}>
                      {option.description}
                    </Text>
                  </View>

                  {/* Radio Button */}
                  <View
                    style={[
                      styles.radioOuter,
                      isSelected ? styles.radioOuterSelected : styles.radioOuterDefault,
                    ]}
                  >
                    {isSelected && <View style={styles.radioInner} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Invite Code Accordion/Link */}
          <View style={styles.inviteSection}>
            {!showInviteInput ? (
              <TouchableOpacity
                onPress={() => setShowInviteInput(true)}
                activeOpacity={0.7}
              >
                <Text style={styles.invitePromptText}>
                  Have an invitation?{' '}
                  <Text style={styles.inviteLink}>Enter invite code</Text>
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.inviteInputContainer}>
                <TextInput
                  style={styles.inviteInput}
                  placeholder="Enter 6-digit invite code"
                  placeholderTextColor={colors.textMuted}
                  value={inviteCode}
                  onChangeText={setInviteCode}
                  autoCapitalize="characters"
                />
              </View>
            )}
          </View>
        </View>

        {/* Bottom Actions */}
        <View style={styles.bottomSection}>
          <Button
            title="Continue"
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
  headingSection: {
    marginTop: 8,
    marginBottom: 24,
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
  optionsList: {
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    padding: 18,
  },
  cardDefault: {
    backgroundColor: colors.cardBackground,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
  },
  cardSelected: {
    backgroundColor: colors.cardBackgroundSelected,
    borderWidth: 2,
    borderColor: colors.cardBorderSelected,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainerDefault: {
    backgroundColor: colors.iconBackgroundDefault,
  },
  iconContainerSelected: {
    backgroundColor: colors.buttonPrimary,
  },
  cardTextContainer: {
    flex: 1,
    paddingHorizontal: 14,
  },
  cardTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  cardDescription: {
    fontFamily: typography.fonts.regular,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterDefault: {
    borderWidth: 2,
    borderColor: '#D1D5DB',
  },
  radioOuterSelected: {
    borderWidth: 2,
    borderColor: colors.buttonPrimary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.buttonPrimary,
  },
  inviteSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  invitePromptText: {
    fontFamily: typography.fonts.regular,
    fontSize: 14,
    color: colors.textSecondary,
  },
  inviteLink: {
    fontFamily: typography.fonts.medium,
    color: colors.buttonPrimary,
  },
  inviteInputContainer: {
    width: '100%',
  },
  inviteInput: {
    height: 48,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    borderRadius: 12,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    fontFamily: typography.fonts.medium,
    fontSize: 14,
    color: colors.textPrimary,
  },
  bottomSection: {
    width: '100%',
    alignItems: 'center',
    marginTop: 16,
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

export default AccountTypeScreen;
