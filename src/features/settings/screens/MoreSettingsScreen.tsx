import { ScreenBackdrop } from '@/components/ui/Surface';
import { MotionTouchable as TouchableOpacity } from '@/components/ui/Motion';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAppContext } from '@/context/AppContext';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';

export const MoreSettingsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const {
    currentUser,
    metrics,
    openAddClientModal,
    openCreateProjectModal,
    openCreateInvoiceModal,
    openTeamManagementModal,
    openClientsDirectoryModal,
    canManageTeam,
    canManageClients,
    canCreateProjects,
    canManageFinances,
    openEditProfileModal,
    openRemindersModal,
    updateProfile,
    logout,
  } = useAppContext();

  const [reducedMotion, setReducedMotion] = useState(currentUser?.reducedMotion || false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    currentUser?.notificationsEnabled !== false
  );

  const isClient = currentUser?.role === 'client';

  const handleToggleReducedMotion = (val: boolean) => {
    setReducedMotion(val);
    updateProfile({ reducedMotion: val });
  };

  const handleToggleNotifications = (val: boolean) => {
    setNotificationsEnabled(val);
    updateProfile({ notificationsEnabled: val });
  };

  const handleChangeCurrency = () => {
    Alert.alert('Workspace Currency', 'Select default operating currency:', [
      { text: 'LKR (Sri Lankan Rupee)', onPress: () => updateProfile({ currency: 'LKR' }) },
      { text: 'USD ($)', onPress: () => updateProfile({ currency: 'USD' }) },
      { text: 'EUR (€)', onPress: () => updateProfile({ currency: 'EUR' }) },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleShowTerms = () => {
    Alert.alert(
      'Terms & Conditions',
      'ISAACIFY CRM Manager Client & Service Provider Terms.\n\nAll invoices, deliverables, and milestone agreements are strictly managed between the respective provider and authorized client.\nVersion 1.0.0.',
      [{ text: 'Close' }]
    );
  };

  const handleShowPrivacy = () => {
    Alert.alert(
      'Privacy Policy',
      'ISAACIFY protects confidential project deliverables, financial records, and communication.\nWorkspace data and selected files are stored on this device. Local passwords are salted and hashed; native sessions use encrypted device storage. Cloud synchronization and verified email recovery are not connected yet.',
      [{ text: 'Close' }]
    );
  };

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out of ISAACIFY?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/auth/login');
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScreenBackdrop />
      {/* Top Header */}
      <View style={[styles.headerBar, { paddingTop: Math.max(insets.top, 12) }]}>
        <Text style={styles.headerTitle}>Account & Settings</Text>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 20) + 70 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* User / Company Profile Card */}
        <TouchableOpacity
          style={styles.profileCard}
          activeOpacity={0.7}
          onPress={openEditProfileModal}
        >
          <View style={styles.profileAvatarBox}>
            <Text style={styles.profileAvatarText}>
              {(currentUser?.firstName || 'IS').slice(0, 2).toUpperCase()}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={styles.profileName}>{currentUser?.name || 'ISAACIFY User'}</Text>
              <Feather name="edit-2" size={14} color={colors.buttonPrimary} />
            </View>
            <Text style={styles.profileEmail}>{currentUser?.email}</Text>
            <View style={styles.roleTag}>
              <Text style={styles.roleTagText}>
                {currentUser?.role === 'team'
                  ? `Freelancer Company (${currentUser.teamRole?.toUpperCase() || 'OWNER'})`
                  : currentUser?.role === 'client'
                  ? 'Client Portal Account'
                  : 'Individual Freelancer'}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Quick Stats Grid */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statVal}>{metrics.activeProjectsCount}</Text>
            <Text style={styles.statSub}>Active Projects</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statVal}>{metrics.totalClientsCount}</Text>
            <Text style={styles.statSub}>{isClient ? 'Providers' : 'Total Clients'}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statVal}>{metrics.pendingTasksCount}</Text>
            <Text style={styles.statSub}>Pending Tasks</Text>
          </View>
        </View>

        {/* Quick Actions (only for providers) */}
        {!isClient && (
          <>
            <Text style={styles.sectionHeader}>Quick Actions</Text>
            <View style={styles.menuCard}>
              {canCreateProjects && (
                <TouchableOpacity style={styles.menuItem} onPress={openCreateProjectModal}>
                  <View style={styles.menuItemLeft}>
                    <View style={[styles.menuIconBox, { backgroundColor: '#EDE7F6' }]}>
                      <Feather name="folder-plus" size={18} color={colors.buttonPrimary} />
                    </View>
                    <Text style={styles.menuItemText}>Create New Project</Text>
                  </View>
                  <Feather name="chevron-right" size={18} color={colors.textMuted} />
                </TouchableOpacity>
              )}

              {canManageClients && (
                <>
                  <TouchableOpacity style={styles.menuItem} onPress={openClientsDirectoryModal}>
                    <View style={styles.menuItemLeft}>
                      <View style={[styles.menuIconBox, { backgroundColor: '#F3EEFF' }]}>
                        <Feather name="users" size={18} color={colors.buttonPrimary} />
                      </View>
                      <View>
                        <Text style={styles.menuItemText}>Clients Directory</Text>
                        <Text style={styles.menuItemSub}>Browse, manage & archive client records</Text>
                      </View>
                    </View>
                    <Feather name="chevron-right" size={18} color={colors.textMuted} />
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.menuItem} onPress={() => openAddClientModal()}>
                    <View style={styles.menuItemLeft}>
                      <View style={[styles.menuIconBox, { backgroundColor: '#FEF3E8' }]}>
                        <Feather name="user-plus" size={18} color="#B45309" />
                      </View>
                      <Text style={styles.menuItemText}>Add Client Contact</Text>
                    </View>
                    <Feather name="chevron-right" size={18} color={colors.textMuted} />
                  </TouchableOpacity>
                </>
              )}

              {canManageFinances && (
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={openCreateInvoiceModal}
                >
                  <View style={styles.menuItemLeft}>
                    <View style={[styles.menuIconBox, { backgroundColor: '#ECFDF5' }]}>
                      <Ionicons name="receipt-outline" size={18} color="#059669" />
                    </View>
                    <Text style={styles.menuItemText}>Generate New Invoice</Text>
                  </View>
                  <Feather name="chevron-right" size={18} color={colors.textMuted} />
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/tasks')}
              >
                <View style={styles.menuItemLeft}>
                  <View style={[styles.menuIconBox, { backgroundColor: '#EDE7F6' }]}>
                    <Feather name="check-square" size={18} color={colors.buttonPrimary} />
                  </View>
                  <View>
                    <Text style={styles.menuItemText}>Tasks Management</Text>
                    <Text style={styles.menuItemSub}>Task details, status updates & delete</Text>
                  </View>
                </View>
                <Feather name="chevron-right" size={18} color={colors.textMuted} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/scope')}
              >
                <View style={styles.menuItemLeft}>
                  <View style={[styles.menuIconBox, { backgroundColor: '#ECFDF5' }]}>
                    <Feather name="target" size={18} color="#059669" />
                  </View>
                  <View>
                    <Text style={styles.menuItemText}>Project Scope</Text>
                    <Text style={styles.menuItemSub}>Deliverables baseline & change requests</Text>
                  </View>
                </View>
                <Feather name="chevron-right" size={18} color={colors.textMuted} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/contract-terms')}
              >
                <View style={styles.menuItemLeft}>
                  <View style={[styles.menuIconBox, { backgroundColor: '#F3EEFB' }]}>
                    <Feather name="file-text" size={18} color={colors.buttonPrimary} />
                  </View>
                  <View>
                    <Text style={styles.menuItemText}>Contract Terms & Clauses</Text>
                    <Text style={styles.menuItemSub}>Edit & add clauses, penalties & IP</Text>
                  </View>
                </View>
                <Feather name="chevron-right" size={18} color={colors.textMuted} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/contract-preview')}
              >
                <View style={styles.menuItemLeft}>
                  <View style={[styles.menuIconBox, { backgroundColor: '#FEF3E8' }]}>
                    <Feather name="eye" size={18} color="#D97706" />
                  </View>
                  <View>
                    <Text style={styles.menuItemText}>Preview Legal Contract</Text>
                    <Text style={styles.menuItemSub}>Formal service agreement document</Text>
                  </View>
                </View>
                <Feather name="chevron-right" size={18} color={colors.textMuted} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/contract-review')}
              >
                <View style={styles.menuItemLeft}>
                  <View style={[styles.menuIconBox, { backgroundColor: '#EDE9FE' }]}>
                    <Feather name="edit-3" size={18} color={colors.buttonPrimary} />
                  </View>
                  <View>
                    <Text style={styles.menuItemText}>Contract Review & Sign</Text>
                    <Text style={styles.menuItemSub}>Review checklist & digital signature</Text>
                  </View>
                </View>
                <Feather name="chevron-right" size={18} color={colors.textMuted} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.menuItem, { borderBottomWidth: 0 }]}
                onPress={() => router.push('/onboarding')}
              >
                <View style={styles.menuItemLeft}>
                  <View style={[styles.menuIconBox, { backgroundColor: '#F0FDF4' }]}>
                    <Feather name="compass" size={18} color="#16A34A" />
                  </View>
                  <View>
                    <Text style={styles.menuItemText}>Onboarding Walkthrough</Text>
                    <Text style={styles.menuItemSub}>Explore intro slides & features</Text>
                  </View>
                </View>
                <Feather name="chevron-right" size={18} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Team Management (Company Owners/Admins) */}
        {canManageTeam && (
          <>
            <Text style={styles.sectionHeader}>Team Administration</Text>
            <View style={styles.menuCard}>
              <TouchableOpacity
                style={[styles.menuItem, { borderBottomWidth: 0 }]}
                onPress={openTeamManagementModal}
              >
                <View style={styles.menuItemLeft}>
                  <View style={[styles.menuIconBox, { backgroundColor: '#F3EEFF' }]}>
                    <Feather name="users" size={18} color={colors.buttonPrimary} />
                  </View>
                  <View>
                    <Text style={styles.menuItemText}>Manage Team & Invitations</Text>
                    <Text style={styles.menuItemSub}>Invite admins, designers & developers</Text>
                  </View>
                </View>
                <Feather name="chevron-right" size={18} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Schedule & Workspace */}
        <Text style={styles.sectionHeader}>Schedule & Workspace</Text>
        <View style={styles.menuCard}>
          <TouchableOpacity style={styles.menuItem} onPress={openRemindersModal}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIconBox, { backgroundColor: '#EDE7F6' }]}>
                <Feather name="calendar" size={18} color={colors.buttonPrimary} />
              </View>
              <View>
                <Text style={styles.menuItemText}>Reminders & Calendar</Text>
                <Text style={styles.menuItemSub}>Personal reminders & project deadlines</Text>
              </View>
            </View>
            <Feather name="chevron-right" size={18} color={colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={openEditProfileModal}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIconBox, { backgroundColor: '#FEF3E8' }]}>
                <Feather name="user-check" size={18} color="#D97706" />
              </View>
              <View>
                <Text style={styles.menuItemText}>Profile & Business Details</Text>
                <Text style={styles.menuItemSub}>Contact details, brand identity & logo</Text>
              </View>
            </View>
            <Feather name="chevron-right" size={18} color={colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { borderBottomWidth: 0 }]}
            onPress={() =>
              router.push({
                pathname: '/auth/email-verification',
                params: { email: currentUser?.email },
              })
            }
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIconBox, { backgroundColor: '#F3EEFB' }]}>
                <Feather name="shield" size={18} color={colors.buttonPrimary} />
              </View>
              <View>
                <Text style={styles.menuItemText}>Email Verification (6 OTP Boxes)</Text>
                <Text style={styles.menuItemSub}>Member 1 security & onboarding check</Text>
              </View>
            </View>
            <Feather name="chevron-right" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Preferences */}
        <Text style={styles.sectionHeader}>Preferences & Accessibility</Text>
        <View style={styles.menuCard}>
          <TouchableOpacity style={styles.menuItem} onPress={handleChangeCurrency}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIconBox, { backgroundColor: '#F3F4F6' }]}>
                <Ionicons name="cash-outline" size={18} color={colors.textPrimary} />
              </View>
              <Text style={styles.menuItemText}>Operating Currency</Text>
            </View>
            <Text style={styles.infoValue}>{currentUser?.currency || 'LKR'}</Text>
          </TouchableOpacity>

          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIconBox, { backgroundColor: '#F3F4F6' }]}>
                <Feather name="bell" size={18} color={colors.textPrimary} />
              </View>
              <Text style={styles.menuItemText}>In-app Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleToggleNotifications}
              trackColor={{ false: '#E5E7EB', true: colors.buttonPrimary }}
            />
          </View>

          <View style={[styles.menuItem, { borderBottomWidth: 0 }]}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIconBox, { backgroundColor: '#F3F4F6' }]}>
                <Feather name="zap" size={18} color={colors.textPrimary} />
              </View>
              <Text style={styles.menuItemText}>Reduced Motion</Text>
            </View>
            <Switch
              value={reducedMotion}
              onValueChange={handleToggleReducedMotion}
              trackColor={{ false: '#E5E7EB', true: colors.buttonPrimary }}
            />
          </View>
        </View>

        {/* Legal & App Info */}
        <Text style={styles.sectionHeader}>About & Legal</Text>
        <View style={styles.menuCard}>
          <TouchableOpacity style={styles.menuItem} onPress={handleShowTerms}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIconBox, { backgroundColor: '#F3F4F6' }]}>
                <Feather name="file-text" size={18} color={colors.textSecondary} />
              </View>
              <Text style={styles.menuItemText}>Terms & Conditions</Text>
            </View>
            <Feather name="chevron-right" size={18} color={colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleShowPrivacy}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIconBox, { backgroundColor: '#F3F4F6' }]}>
                <Feather name="shield" size={18} color={colors.textSecondary} />
              </View>
              <Text style={styles.menuItemText}>Privacy Policy</Text>
            </View>
            <Feather name="chevron-right" size={18} color={colors.textMuted} />
          </TouchableOpacity>

          <View style={[styles.menuItem, { borderBottomWidth: 0 }]}>
            <Text style={styles.infoLabel}>App Version</Text>
            <Text style={styles.infoValue}>v1.0.0 (Production)</Text>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Feather name="log-out" size={18} color="#E11D48" />
          <Text style={styles.logoutBtnText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  headerBar: {
    paddingHorizontal: 20,
    paddingBottom: 18,
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
    borderBottomColor: '#F0EFF6'
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 36
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
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
  profileAvatarBox: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.buttonPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  profileAvatarText: {
    fontSize: 18,
    fontFamily: typography.fonts.bold,
    color: colors.white,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary,
  },
  profileEmail: {
    fontSize: 13,
    fontFamily: typography.fonts.regular,
    color: colors.textSecondary,
    marginTop: 2,
  },
  roleTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#F3EEFF',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 6,
  },
  roleTagText: {
    fontSize: 11,
    fontFamily: typography.fonts.medium,
    color: colors.buttonPrimary,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 22,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEE8F6',
    shadowColor: '#493068',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3
  },
  statVal: {
    fontSize: 20,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary,
  },
  statSub: {
    fontSize: 11,
    fontFamily: typography.fonts.regular,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  sectionHeader: {
    fontSize: 15,
    fontFamily: typography.fonts.bold,
    color: colors.textSecondary,
    marginBottom: 14,
    marginTop: 8
  },
  menuCard: {
    backgroundColor: colors.white,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#EEE8F6',
    marginBottom: 20,
    overflow: 'visible',
    shadowColor: '#493068',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    minHeight: 66
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  menuIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemText: {
    fontSize: 14,
    fontFamily: typography.fonts.medium,
    color: colors.textPrimary,
  },
  menuItemSub: {
    fontSize: 11,
    fontFamily: typography.fonts.regular,
    color: colors.textMuted,
    marginTop: 2,
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: typography.fonts.regular,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FEE2E2',
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 8,
    marginBottom: 20,
  },
  logoutBtnText: {
    fontSize: 14,
    fontFamily: typography.fonts.bold,
    color: '#E11D48',
  },
});
