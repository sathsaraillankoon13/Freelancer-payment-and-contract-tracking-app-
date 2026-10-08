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
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useAppContext } from '@/context/AppContext';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';
import { TeamMemberRole } from '@/types';
import { BottomTabBar, TabName } from '@/components/navigation/BottomTabBar';

export const TeamManagementModal: React.FC = () => {
  const insets = useSafeAreaInsets();
  const {
    activeModal,
    closeModal,
    teamMembers,
    inviteTeamMember,
    removeTeamMember,
    currentUser,
    canManageTeam,
    setActiveTab,
  } = useAppContext();

  const handleTabPress = (tab: TabName) => {
    closeModal();
    setActiveTab(tab);
  };

  const isVisible = activeModal === 'team_management';

  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<TeamMemberRole>('member');
  const [error, setError] = useState('');

  if (!canManageTeam && isVisible) {
    return (
      <Modal visible={isVisible} animationType="slide" onRequestClose={closeModal}>
        <View style={[styles.container, { paddingTop: Math.max(insets.top, 24), padding: 20 }]}>
        <ScreenBackdrop />
          <Text style={styles.headerTitle}>Access Restricted</Text>
          <Text style={styles.unauthorizedText}>
            Team management is restricted to Company Owners and Workspace Admins.
          </Text>
          <TouchableOpacity style={styles.closeBtnSimple} onPress={closeModal}>
            <Text style={styles.closeBtnSimpleText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  const handleInvite = () => {
    if (!inviteName.trim()) {
      setError('Please enter member name');
      return;
    }
    if (!inviteEmail.trim() || !/\S+@\S+\.\S+/.test(inviteEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    if (teamMembers.some(m => m.email.toLowerCase() === inviteEmail.trim().toLowerCase())) { setError('This email is already on the team roster.'); return; }
    inviteTeamMember(inviteName.trim(), inviteEmail.trim(), inviteRole);
    setInviteName('');
    setInviteEmail('');
    setError('');

    Alert.alert(
      'Invitation Sent',
      `${inviteEmail.trim()} was added to the local roster as pending. Email delivery and acceptance require the account service.`,
      [{ text: 'OK' }]
    );
  };

  const handleRemove = (memberId: string, memberName: string, role: TeamMemberRole) => {
    if (role === 'owner') {
      Alert.alert('Action Prohibited', 'The workspace Owner cannot be removed.');
      return;
    }

    Alert.alert(
      'Remove Member',
      `Are you sure you want to remove ${memberName} from this workspace?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeTeamMember(memberId),
        },
      ]
    );
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle={Platform.OS === 'ios' ? 'pageSheet' : 'fullScreen'}
      onRequestClose={closeModal}
    >
      <View style={[styles.container, { paddingTop: Math.max(insets.top, 16) }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={closeModal} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Team & Members</Text>
          <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
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
          {/* Workspace Info */}
          <View style={styles.workspaceBanner}>
            <Text style={styles.workspaceLabel}>WORKSPACE</Text>
            <Text style={styles.workspaceName}>{currentUser?.workspaceName || 'ISAACIFY'}</Text>
            <Text style={styles.workspaceSub}>
              {teamMembers.length} active team {teamMembers.length === 1 ? 'member' : 'members'}
            </Text>
          </View>

          {/* Members List */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Current Team Roster</Text>
            {teamMembers.map((member) => (
              <View key={member.id} style={styles.memberRow}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {member.name
                      .split(' ')
                      .map((p) => p[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()}
                  </Text>
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <View style={styles.nameRow}>
                    <Text style={styles.memberName}>{member.name}</Text>
                    <View
                      style={[
                        styles.roleBadge,
                        member.role === 'owner'
                          ? styles.roleOwner
                          : member.role === 'admin'
                          ? styles.roleAdmin
                          : styles.roleMember,
                      ]}
                    >
                      <Text
                        style={[
                          styles.roleBadgeText,
                          member.role === 'owner'
                            ? styles.roleOwnerText
                            : member.role === 'admin'
                            ? styles.roleAdminText
                            : styles.roleMemberText,
                        ]}
                      >
                        {member.role.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.memberEmail}>{member.email}</Text>
                </View>
                {member.role !== 'owner' && (
                  <TouchableOpacity
                    onPress={() => handleRemove(member.id, member.name, member.role)}
                    style={styles.removeBtn}
                  >
                    <Feather name="trash-2" size={16} color="#DC2626" />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>

          {/* Invite Form */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Invite New Member</Text>

            <Text style={styles.fieldLabel}>Full Name *</Text>
            <View style={styles.inputBox}>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Priyantha Silva"
                placeholderTextColor={colors.textMuted}
                value={inviteName}
                onChangeText={(t) => {
                  setInviteName(t);
                  if (error) setError('');
                }}
              />
            </View>

            <Text style={styles.fieldLabel}>Email Address *</Text>
            <View style={styles.inputBox}>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. priyantha@isaacify.io"
                placeholderTextColor={colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                value={inviteEmail}
                onChangeText={(t) => {
                  setInviteEmail(t);
                  if (error) setError('');
                }}
              />
            </View>

            <Text style={styles.fieldLabel}>Assigned Role</Text>
            <View style={styles.rolesRow}>
              {(['member', 'admin'] as const).map((r) => (
                <TouchableOpacity
                  key={r}
                  style={[styles.rolePill, inviteRole === r && styles.rolePillActive]}
                  onPress={() => setInviteRole(r)}
                >
                  <Text style={[styles.rolePillText, inviteRole === r && styles.rolePillTextActive]}>
                    {r === 'admin' ? 'Admin (Finances & Team)' : 'Member (Assigned Tasks Only)'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity gradient style={styles.inviteBtn} onPress={handleInvite} activeOpacity={0.8}>
              <Feather name="user-plus" size={18} color={colors.white} />
              <Text style={styles.inviteBtnText}>Save pending invitation</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <BottomTabBar activeTab="more" onTabPress={handleTabPress} />
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
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EDF7',
    backgroundColor: colors.white,
    paddingBottom: 16,
  },
  backButton: { padding: 6 },
  closeButton: { padding: 6 },
  headerTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: 22,
    color: colors.textPrimary
  },
  scrollArea: { flex: 1 },
  scrollContent: { padding: spacing.lg },
  workspaceBanner: {
    backgroundColor: '#F3EEFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },
  workspaceLabel: {
    fontFamily: typography.fonts.medium,
    fontSize: 11,
    color: colors.buttonPrimary,
    letterSpacing: 0.5,
  },
  workspaceName: {
    fontFamily: typography.fonts.bold,
    fontSize: 20,
    color: colors.textPrimary,
    marginTop: 2,
  },
  workspaceSub: {
    fontFamily: typography.fonts.regular,
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: '#EEE8F6',
    marginBottom: 16,
    shadowColor: '#493068',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3
  },
  cardTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 14,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F6F4FB',
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.buttonPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: typography.fonts.bold,
    fontSize: 13,
    color: colors.white,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  memberName: {
    fontFamily: typography.fonts.bold,
    fontSize: 14,
    color: colors.textPrimary,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  roleBadgeText: {
    fontSize: 10,
    fontFamily: typography.fonts.bold,
  },
  roleOwner: { backgroundColor: '#F1EAFD' },
  roleOwnerText: { color: colors.buttonPrimary, fontSize: 10, fontFamily: typography.fonts.bold },
  roleAdmin: { backgroundColor: '#FEF3E8' },
  roleAdminText: { color: '#B45309', fontSize: 10, fontFamily: typography.fonts.bold },
  roleMember: { backgroundColor: '#F3F4F6' },
  roleMemberText: { color: '#4B5563', fontSize: 10, fontFamily: typography.fonts.bold },
  memberEmail: {
    fontFamily: typography.fonts.regular,
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  removeBtn: {
    padding: 8,
  },
  fieldLabel: {
    fontFamily: typography.fonts.medium,
    fontSize: 13,
    color: colors.textPrimary,
    marginBottom: 6,
    marginTop: 12,
  },
  inputBox: {
    backgroundColor: '#FAF9FD',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2D9F3',
    paddingHorizontal: 12,
    height: 48,
    justifyContent: 'center',
  },
  textInput: {
    fontFamily: typography.fonts.regular,
    fontSize: 14,
    color: colors.textPrimary,
  },
  rolesRow: {
    gap: 8,
    marginTop: 6,
    marginBottom: 16,
  },
  rolePill: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#FAF9FD',
    borderWidth: 1,
    borderColor: '#E2D9F3',
  },
  rolePillActive: {
    backgroundColor: '#F1EAFD',
    borderColor: colors.buttonPrimary,
  },
  rolePillText: {
    fontFamily: typography.fonts.medium,
    fontSize: 12,
    color: colors.textSecondary,
  },
  rolePillTextActive: {
    color: colors.buttonPrimary,
    fontFamily: typography.fonts.bold,
  },
  errorText: {
    fontFamily: typography.fonts.medium,
    fontSize: 13,
    color: '#DC2626',
    marginBottom: 10,
  },
  inviteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.buttonPrimary,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 6,
  },
  inviteBtnText: {
    fontFamily: typography.fonts.bold,
    fontSize: 14,
    color: colors.white,
  },
  unauthorizedText: {
    fontFamily: typography.fonts.regular,
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 12,
    marginBottom: 20,
  },
  closeBtnSimple: {
    backgroundColor: colors.buttonPrimary,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeBtnSimpleText: {
    color: colors.white,
    fontFamily: typography.fonts.bold,
  },
});
