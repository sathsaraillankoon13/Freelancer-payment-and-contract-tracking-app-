import { ScreenBackdrop } from '@/components/ui/Surface';
import { MotionTouchable as TouchableOpacity, MotionModal as Modal } from '@/components/ui/Motion';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useAppContext } from '@/context/AppContext';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { User } from '@/types';
import { BottomTabBar, TabName } from '@/components/navigation/BottomTabBar';

interface EditProfileContentProps {
  currentUser: User;
  closeModal: () => void;
}

const EditProfileContent: React.FC<EditProfileContentProps> = ({
  currentUser,
  closeModal,
}) => {
  const insets = useSafeAreaInsets();
  const { setActiveTab, updateProfile, updateCompanyDetails } = useAppContext();

  const [name, setName] = useState(currentUser.name || '');
  const [firstName, setFirstName] = useState(currentUser.firstName || '');
  const [email] = useState(currentUser.email || '');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [agencyName, setAgencyName] = useState(currentUser.agencyName || '');
  const [agencyLead, setAgencyLead] = useState(currentUser.agencyLead || '');
  const [avatarUrl] = useState(currentUser.avatarUrl || '');

  const isCompanyAdmin =
    currentUser.role === 'team' &&
    (currentUser.teamRole === 'owner' || currentUser.teamRole === 'admin');

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Full name is required.');
      return;
    }

    const calculatedFirstName =
      firstName.trim() || name.trim().split(' ')[0] || 'User';

    updateProfile({
      name: name.trim(),
      firstName: calculatedFirstName,
      phone: phone.trim() || undefined,
      avatarUrl: avatarUrl.trim() || undefined,
      agencyName: agencyName.trim() || undefined,
      agencyLead: agencyLead.trim() || undefined,
    });

    if (isCompanyAdmin && agencyName.trim()) {
      updateCompanyDetails({
        agencyName: agencyName.trim(),
        agencyLead: agencyLead.trim() || undefined,
        phone: phone.trim() || undefined,
        avatarUrl: avatarUrl.trim() || undefined,
      });
    }

    Alert.alert('Profile Saved', 'Your profile and business details have been updated.');
    closeModal();
  };

  const handleTabPress = (tab: TabName) => {
    closeModal();
    setActiveTab(tab);
  };

  const initials = (firstName || name || 'IS').slice(0, 2).toUpperCase();

  const roleLabel =
    currentUser.role === 'team'
      ? `Company ${currentUser.teamRole?.toUpperCase() || 'OWNER'}`
      : currentUser.role === 'client'
      ? 'Client Portal Account'
      : 'Individual Freelancer';

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 12) }]}>
      <ScreenBackdrop />

      {/* Modern Clean Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={closeModal}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
        >
          <Feather name="arrow-left" size={20} color={colors.textPrimary} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Profile & Details</Text>

        <TouchableOpacity
          style={styles.headerSaveBtn}
          onPress={handleSave}
          activeOpacity={0.7}
        >
          <Feather name="check" size={16} color={colors.buttonPrimary} />
          <Text style={styles.headerSaveText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Centered Avatar Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <View style={styles.cameraBadge}>
              <Feather name="camera" size={12} color={colors.white} />
            </View>
          </View>

          <Text style={styles.heroName}>{name || 'Your Name'}</Text>
          <Text style={styles.heroEmail}>{email}</Text>

          <View style={styles.rolePill}>
            <Text style={styles.rolePillText}>{roleLabel}</Text>
          </View>
        </View>

        {/* Personal Information Card */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Feather name="user" size={16} color={colors.buttonPrimary} />
            <Text style={styles.cardSectionTitle}>PERSONAL INFORMATION</Text>
          </View>

          {/* Full Name */}
          <Text style={styles.inputLabel}>Full Name *</Text>
          <View style={styles.inputRow}>
            <View style={styles.inputIconBox}>
              <Feather name="user" size={16} color={colors.buttonPrimary} />
            </View>
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              placeholder="e.g. Isaac Newton"
              placeholderTextColor={colors.textMuted}
            />
          </View>

          {/* Preferred First Name */}
          <Text style={styles.inputLabel}>Preferred First Name</Text>
          <View style={styles.inputRow}>
            <View style={styles.inputIconBox}>
              <Feather name="smile" size={16} color={colors.buttonPrimary} />
            </View>
            <TextInput
              style={styles.textInput}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="e.g. Isaac"
              placeholderTextColor={colors.textMuted}
            />
          </View>

          {/* Account Email (Read-Only) */}
          <Text style={styles.inputLabel}>Account Email</Text>
          <View style={[styles.inputRow, styles.inputRowDisabled]}>
            <View style={[styles.inputIconBox, { backgroundColor: '#ECE9F5' }]}>
              <Feather name="mail" size={16} color={colors.textSecondary} />
            </View>
            <TextInput
              style={[styles.textInput, { color: colors.textSecondary }]}
              value={email}
              editable={false}
              placeholder="user@example.com"
              placeholderTextColor={colors.textMuted}
            />
            <View style={styles.verifiedBadge}>
              <Feather name="shield" size={12} color="#059669" />
              <Text style={styles.verifiedBadgeText}>Verified</Text>
            </View>
          </View>

          {/* Phone Number */}
          <Text style={styles.inputLabel}>Phone Number</Text>
          <View style={styles.inputRow}>
            <View style={styles.inputIconBox}>
              <Feather name="phone" size={16} color={colors.buttonPrimary} />
            </View>
            <TextInput
              style={styles.textInput}
              value={phone}
              onChangeText={setPhone}
              placeholder="+94 77 123 4567"
              placeholderTextColor={colors.textMuted}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Company & Workspace Information */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Feather name="briefcase" size={16} color={colors.buttonPrimary} />
            <Text style={styles.cardSectionTitle}>
              {currentUser.role === 'team'
                ? 'COMPANY & WORKSPACE DETAILS'
                : 'BUSINESS & BRAND DETAILS'}
            </Text>
          </View>

          {/* Company / Agency Name */}
          <Text style={styles.inputLabel}>
            {currentUser.role === 'team' ? 'Company Name' : 'Agency / Brand Name'}
          </Text>
          <View style={styles.inputRow}>
            <View style={styles.inputIconBox}>
              <Feather name="briefcase" size={16} color={colors.buttonPrimary} />
            </View>
            <TextInput
              style={styles.textInput}
              value={agencyName}
              onChangeText={setAgencyName}
              placeholder="e.g. Studio Craft LK"
              placeholderTextColor={colors.textMuted}
            />
          </View>

          {/* Agency Lead / Role */}
          <Text style={styles.inputLabel}>
            {currentUser.role === 'team' ? 'Company Role / Title' : 'Agency Lead / Title'}
          </Text>
          <View style={styles.inputRow}>
            <View style={styles.inputIconBox}>
              <Feather name="award" size={16} color={colors.buttonPrimary} />
            </View>
            <TextInput
              style={styles.textInput}
              value={agencyLead}
              onChangeText={setAgencyLead}
              placeholder="e.g. Managing Director"
              placeholderTextColor={colors.textMuted}
            />
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleSave}
          activeOpacity={0.8}
        >
          <Feather name="check-circle" size={18} color={colors.white} />
          <Text style={styles.saveBtnText}>Save Profile Changes</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Persistent Bottom Navigation Bar */}
      <BottomTabBar activeTab="more" onTabPress={handleTabPress} />
    </View>
  );
};

export const EditProfileModal: React.FC = () => {
  const { activeModal, closeModal, currentUser } = useAppContext();
  const isVisible = activeModal === 'edit_profile';

  if (!currentUser) return null;

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={closeModal}
    >
      <EditProfileContent
        key={currentUser.id + (isVisible ? '-open' : '-closed')}
        currentUser={currentUser}
        closeModal={closeModal}
      />
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
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EFF6',
    backgroundColor: colors.white,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F3EEFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary,
  },
  headerSaveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F3EEFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  headerSaveText: {
    fontSize: 13,
    fontFamily: typography.fonts.bold,
    color: colors.buttonPrimary,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 18,
    gap: 16,
    paddingBottom: 28,
  },
  heroSection: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 22,
    paddingVertical: 22,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: '#EDE8F6',
    shadowColor: '#493068',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 10,
  },
  avatarCircle: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: colors.buttonPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.white,
    shadowColor: '#6C41B6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  avatarText: {
    fontSize: 28,
    fontFamily: typography.fonts.bold,
    color: colors.white,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#1E1235',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  heroName: {
    fontSize: 20,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  heroEmail: {
    fontSize: 13,
    fontFamily: typography.fonts.regular,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  rolePill: {
    backgroundColor: '#EDE8FD',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 12,
  },
  rolePillText: {
    fontSize: 12,
    fontFamily: typography.fonts.bold,
    color: colors.buttonPrimary,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#EDE8F6',
    shadowColor: '#493068',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F6F4FB',
  },
  cardSectionTitle: {
    fontSize: 12,
    fontFamily: typography.fonts.bold,
    color: '#7E7396',
    letterSpacing: 0.6,
  },
  inputLabel: {
    fontSize: 12,
    fontFamily: typography.fonts.medium,
    color: colors.textSecondary,
    marginBottom: 6,
    marginTop: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F8FD',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ECE7F6',
    paddingHorizontal: 10,
    height: 48,
    marginBottom: 10,
  },
  inputRowDisabled: {
    backgroundColor: '#F3F2F8',
    borderColor: '#E6E3EE',
  },
  inputIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#F3EEFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: typography.fonts.medium,
    color: colors.textPrimary,
    height: '100%',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
    marginLeft: 6,
  },
  verifiedBadgeText: {
    fontSize: 11,
    fontFamily: typography.fonts.bold,
    color: '#059669',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.buttonPrimary,
    borderRadius: 16,
    height: 52,
    marginTop: 6,
    marginBottom: 10,
    shadowColor: '#6C41B6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  saveBtnText: {
    fontSize: 15,
    fontFamily: typography.fonts.bold,
    color: colors.white,
  },
});
