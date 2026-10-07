import { ScreenBackdrop } from '@/components/ui/Surface';
import { MotionTouchable as TouchableOpacity, MotionModal as Modal } from '@/components/ui/Motion';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useAppContext } from '@/context/AppContext';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';

export const AddClientModal: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { activeModal, closeModal, addClient } = useAppContext();

  const isVisible = activeModal === 'add_client';

  const [clientName, setClientName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [clientType, setClientType] = useState<'app' | 'invite'>('app');
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!clientName.trim()) {
      setError('Please enter client name');
      Alert.alert('Missing Name', 'Please enter a name for the client.');
      return;
    }

    const newClient = addClient({
      name: clientName.trim(),
      companyName: companyName.trim() || `${clientName.trim()} Company`,
      phone: phone.trim().startsWith('+') ? phone.trim() : `+94 ${phone.trim() || '77 123 4567'}`,
      email: email.trim() || `${clientName.trim().toLowerCase().replace(/\s+/g, '')}@example.com`,
    });

    closeModal();
    setClientName('');
    setCompanyName('');
    setPhone('');
    setEmail('');
    setError('');
    Alert.alert('Client Added', `"${newClient.name}" has been added to your client list!`);
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle={Platform.OS === 'ios' ? 'pageSheet' : 'fullScreen'}
      onRequestClose={closeModal}
    >
      <View style={[styles.container, { paddingTop: Math.max(insets.top, 16) }]}>
        <ScreenBackdrop />
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={closeModal}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather name="arrow-left" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Client</Text>
          <TouchableOpacity style={styles.headerRight} onPress={closeModal}>
            <Feather name="x" size={22} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom, 24) + 80 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Client Profile Card */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.cardHeaderLeft}>
                <Ionicons name="person-add" size={18} color={colors.buttonPrimary} />
                <Text style={styles.cardHeaderTitle}>Client Profile</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setClientName('Apex Media');
                  setCompanyName('Apex Media Group');
                  setEmail('contact@apexmedia.lk');
                  setPhone('77 456 7890');
                }}
              >
                <Text style={{ fontSize: 12, color: colors.buttonPrimary, fontFamily: typography.fonts.bold }}>
                  ⚡ Quick Fill
                </Text>
              </TouchableOpacity>
            </View>

            {/* Client Name */}
            <Text style={styles.fieldLabel}>
              Client Name <Text style={styles.asterisk}>*</Text>
            </Text>
            <View style={[styles.inputBox, error ? styles.inputBoxError : null]}>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Senuri Perera"
                placeholderTextColor={colors.textMuted}
                value={clientName}
                onChangeText={(text) => {
                  setClientName(text);
                  if (error) setError('');
                }}
              />
              <Feather name="user" size={18} color={colors.textMuted} />
            </View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {/* Company Name */}
            <Text style={styles.fieldLabel}>Company (Optional)</Text>
            <View style={styles.inputBox}>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. CeylonBites Gourmet Ltd"
                placeholderTextColor={colors.textMuted}
                value={companyName}
                onChangeText={setCompanyName}
              />
              <Feather name="briefcase" size={18} color={colors.textMuted} />
            </View>

            {/* Mobile Number */}
            <Text style={styles.fieldLabel}>
              Mobile Number <Text style={styles.asterisk}>*</Text>
            </Text>
            <View style={styles.phoneInputRow}>
              <View style={styles.countryCodeBadge}>
                <Text style={styles.flagText}>🇱🇰</Text>
                <Text style={styles.countryCodeText}>+94</Text>
                <Feather name="chevron-down" size={14} color={colors.textSecondary} />
              </View>
              <View style={[styles.inputBox, styles.phoneInputBox]}>
                <TextInput
                  style={styles.textInput}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  placeholder="77 123 4567"
                  placeholderTextColor={colors.textMuted}
                />
                <Ionicons
                  name="checkmark-circle"
                  size={18}
                  color={colors.buttonPrimary}
                />
              </View>
            </View>

            {/* Email Address */}
            <Text style={styles.fieldLabel}>Email Address</Text>
            <View style={styles.inputBox}>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. senuri@ceylonbites.lk"
                placeholderTextColor={colors.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <Feather name="mail" size={18} color={colors.textMuted} />
            </View>
          </View>

          {/* Does this client use ISAACIFY? */}
          <View style={styles.usageSection}>
            <Text style={styles.usageTitle}>Does this client use ISAACIFY?</Text>
            <Text style={styles.usageSubtitle}>
              We use their verified mobile phone number to find existing workspaces.
            </Text>

            <TouchableOpacity
              style={[
                styles.usageOptionCard,
                clientType === 'app' && styles.usageOptionCardActive,
              ]}
              onPress={() => setClientType('app')}
              activeOpacity={0.8}
            >
              <Ionicons
                name={clientType === 'app' ? 'radio-button-on' : 'radio-button-off'}
                size={20}
                color={colors.buttonPrimary}
              />
              <View style={styles.usageOptionInfo}>
                <Text style={styles.usageOptionTitle}>Already using the app</Text>
                <Text style={styles.usageOptionSub}>
                  Instantly connect accounts via phone matching
                </Text>
              </View>
              <Feather name="share-2" size={18} color={colors.buttonPrimary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.usageOptionCard,
                clientType === 'invite' && styles.usageOptionCardActive,
              ]}
              onPress={() => setClientType('invite')}
              activeOpacity={0.8}
            >
              <Ionicons
                name={clientType === 'invite' ? 'radio-button-on' : 'radio-button-off'}
                size={20}
                color={colors.buttonPrimary}
              />
              <View style={styles.usageOptionInfo}>
                <Text style={styles.usageOptionTitle}>Not using the app yet</Text>
                <Text style={styles.usageOptionSub}>
                  Send a personalized invite link to collaborate
                </Text>
              </View>
              <Feather name="mail" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Auto-matched Preview Card */}
          {clientName.trim() ? (
            <View style={styles.previewMatchCard}>
              <View style={styles.verifiedRow}>
                <Ionicons name="checkmark-circle" size={14} color="#059669" />
                <Text style={styles.verifiedText}>Verified ISAACIFY User</Text>
              </View>
              <View style={styles.matchedUserInfo}>
                <View style={styles.matchedAvatar}>
                  <Text style={styles.matchedAvatarText}>
                    {clientName.slice(0, 2).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.matchedTextCol}>
                  <Text style={styles.matchedName}>{clientName}</Text>
                  <Text style={styles.matchedCompany}>
                    {companyName || 'Verified Client Contact'}
                  </Text>
                </View>
              </View>
            </View>
          ) : null}
        </ScrollView>

        {/* Bottom Button */}
        <View
          style={[
            styles.bottomBar,
            { paddingBottom: Math.max(insets.bottom, 16) },
          ]}
        >
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSave}
            activeOpacity={0.8}
          >
            <Feather name="user-plus" size={18} color={colors.white} />
            <Text style={styles.submitButtonText}>Add to client list</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9FD',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EFF6',
    backgroundColor: colors.white,
    paddingBottom: 16,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary
  },
  headerRight: {
    padding: 4,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: '#EEE8F6',
    marginBottom: 20,
    shadowColor: '#493068',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardHeaderTitle: {
    fontSize: 14,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary,
  },
  cardStepText: {
    fontSize: 12,
    fontFamily: typography.fonts.medium,
    color: colors.textMuted,
  },
  fieldLabel: {
    fontSize: 12,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary,
    marginBottom: 6,
    marginTop: 10,
  },
  asterisk: {
    color: '#E11D48',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF8FE',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  inputBoxError: {
    borderColor: '#E11D48',
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: typography.fonts.medium,
    color: colors.textPrimary,
  },
  errorText: {
    fontSize: 11,
    color: '#E11D48',
    marginTop: 4,
  },
  phoneInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  countryCodeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FAF8FE',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 10,
  },
  flagText: {
    fontSize: 14,
  },
  countryCodeText: {
    fontSize: 13,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary,
  },
  phoneInputBox: {
    flex: 1,
  },
  usageSection: {
    marginBottom: 20,
  },
  usageTitle: {
    fontSize: 15,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  usageSubtitle: {
    fontSize: 12,
    fontFamily: typography.fonts.regular,
    color: colors.textSecondary,
    marginBottom: 12,
    lineHeight: 18,
  },
  usageOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    gap: 12,
  },
  usageOptionCardActive: {
    borderColor: colors.buttonPrimary,
    backgroundColor: '#FAF8FE',
  },
  usageOptionInfo: {
    flex: 1,
  },
  usageOptionTitle: {
    fontSize: 13,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  usageOptionSub: {
    fontSize: 11,
    fontFamily: typography.fonts.regular,
    color: colors.textSecondary,
  },
  previewMatchCard: {
    backgroundColor: '#F3EFFC',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#DDD6FE',
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  verifiedText: {
    fontSize: 11,
    fontFamily: typography.fonts.bold,
    color: '#059669',
  },
  matchedUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  matchedAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.buttonPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  matchedAvatarText: {
    color: colors.white,
    fontFamily: typography.fonts.bold,
    fontSize: 13,
  },
  matchedTextCol: {
    flex: 1,
  },
  matchedName: {
    fontSize: 14,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary,
  },
  matchedCompany: {
    fontSize: 12,
    fontFamily: typography.fonts.regular,
    color: colors.textSecondary,
  },
  bottomBar: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: '#F0EFF6',
    paddingHorizontal: 20,
    paddingTop: 14,
    shadowColor: '#493068',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.buttonPrimary,
    borderRadius: 24,
    paddingVertical: 14,
  },
  submitButtonText: {
    fontSize: 14,
    fontFamily: typography.fonts.bold,
    color: colors.white,
  },
});
