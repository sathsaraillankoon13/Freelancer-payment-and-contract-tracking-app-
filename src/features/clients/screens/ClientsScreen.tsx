import { MotionTouchable as TouchableOpacity } from '@/components/ui/Motion';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useAppContext } from '@/context/AppContext';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { BottomTabBar } from '@/components/navigation/BottomTabBar';

import { router } from 'expo-router';

interface ClientsScreenProps {
  onBack?: () => void;
}

export const ClientsScreen: React.FC<ClientsScreenProps> = ({ onBack }) => {
  const insets = useSafeAreaInsets();
  const {
    clients,
    projects,
    openAddClientModal,
    openClientDetailsModal,
    openCreateProjectModal,
    openProjectDetailsModal,
    openMessagesThreadModal,
    currentUser,
    setActiveTab,
  } = useAppContext();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/');
    }
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'All' | 'Active' | 'Archived'>('Active');

  const filteredClients = clients.filter((c) => {
    const matchesQuery =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.companyName.toLowerCase().includes(searchQuery.toLowerCase());
    const isArchived = !!c.isArchived || c.status === 'archived';
    const matchesFilter =
      filter === 'All' ? true : filter === 'Active' ? !isArchived : isArchived;
    return matchesQuery && matchesFilter;
  });

  const getClientActiveProject = (clientId: string) => {
    return projects.find((p) => p.clientId === clientId);
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View
        style={[
          styles.headerBar,
          { paddingTop: Math.max(insets.top, 12) },
        ]}
      >
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={handleBack} style={{ marginRight: 12 }}>
            <Feather name="arrow-left" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerSubtitle}>
              {currentUser?.agencyName || currentUser?.name || 'Workspace'}
            </Text>
            <Text style={styles.headerTitle}>Clients Directory</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.bellButton}
          onPress={() => openAddClientModal()}
          activeOpacity={0.7}
        >
          <Feather name="user-plus" size={20} color={colors.buttonPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 20) + 70 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <View style={styles.searchBarContainer}>
          <Feather name="search" size={18} color={colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search clients or companies..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Feather name="x" size={16} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Pills */}
        <View style={styles.filterRow}>
          {(['All', 'Active', 'Archived'] as const).map((item) => {
            const isSelected = filter === item;
            return (
              <TouchableOpacity
                key={item}
                style={[
                  styles.filterPill,
                  isSelected && styles.filterPillActive,
                ]}
                onPress={() => setFilter(item)}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    isSelected && styles.filterPillTextActive,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}

          <TouchableOpacity
            style={styles.addClientPill}
            onPress={() => openAddClientModal()}
          >
            <Feather name="plus" size={14} color={colors.white} />
            <Text style={styles.addClientPillText}>Add client</Text>
          </TouchableOpacity>
        </View>

        {/* Clients List */}
        {filteredClients.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconBox}>
              <Feather name="users" size={32} color={colors.buttonPrimary} />
            </View>
            <Text style={styles.emptyTitle}>No clients found</Text>
            <Text style={styles.emptySubtitle}>
              Add your first client to start creating projects and invoices.
            </Text>
            <TouchableOpacity
              style={styles.emptyAddBtn}
              onPress={() => openAddClientModal()}
            >
              <Text style={styles.emptyAddBtnText}>+ Add Client</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredClients.map((client) => {
            const activeProject = getClientActiveProject(client.id);
            const hasOutstanding = (client.outstandingBalance || 0) > 0;

            return (
              <View key={client.id} style={styles.clientCard}>
                {/* Top Info */}
                <TouchableOpacity
                  style={styles.cardHeaderRow}
                  onPress={() => openClientDetailsModal(client.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.clientAvatarBox}>
                    <Text style={styles.clientAvatarText}>
                      {client.initials || client.name.slice(0, 2).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.clientNameCol}>
                    <Text style={styles.clientNameText}>{client.name}</Text>
                    <View style={styles.companyRow}>
                      <Feather name="briefcase" size={12} color={colors.textMuted} />
                      <Text style={styles.companyNameText}>{client.companyName}</Text>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.activeBadge,
                      (client.isArchived || client.status === 'archived') && {
                        backgroundColor: '#F3F4F6',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.activeBadgeText,
                        (client.isArchived || client.status === 'archived') && {
                          color: '#6B7280',
                        },
                      ]}
                    >
                      {client.isArchived || client.status === 'archived'
                        ? 'Archived'
                        : 'Active'}
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Linked Project Row */}
                <View style={styles.projectInfoRow}>
                  <View style={styles.projectLeftCol}>
                    <Feather name="folder" size={14} color={colors.buttonPrimary} />
                    <Text style={styles.projectTitleText} numberOfLines={1}>
                      {activeProject ? activeProject.title : 'Direct Client Account'}
                    </Text>
                  </View>
                  <Text style={styles.projectCountText}>
                    {activeProject ? '1 active project' : '0 active projects'}
                  </Text>
                </View>

                {/* Financial Status & Actions */}
                <View style={styles.cardBottomRow}>
                  {hasOutstanding ? (
                    <View style={styles.outstandingBadge}>
                      <Ionicons name="alert-circle-outline" size={14} color="#B45309" />
                      <Text style={styles.outstandingBadgeText}>
                        LKR {client.outstandingBalance?.toLocaleString()} outstanding
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.noInvoicesBadge}>
                      <Ionicons name="checkmark-circle-outline" size={14} color={colors.buttonPrimary} />
                      <Text style={styles.noInvoicesBadgeText}>
                        No outstanding invoices
                      </Text>
                    </View>
                  )}

                  <View style={styles.actionsGroup}>
                    <TouchableOpacity
                      style={styles.iconActionBtn}
                      onPress={() => openMessagesThreadModal(client.id)}
                    >
                      <Feather name="message-square" size={16} color={colors.buttonPrimary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.iconActionBtn}
                      onPress={() => {
                        if (activeProject) {
                          openProjectDetailsModal(activeProject.id);
                        } else {
                          openCreateProjectModal();
                        }
                      }}
                    >
                      <Feather name="chevron-right" size={18} color={colors.textSecondary} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Persistent Bottom Navigation Bar when opened as full-screen modal */}
      {onBack && (
        <BottomTabBar
          activeTab="more"
          onTabPress={(tab) => {
            onBack();
            setActiveTab(tab);
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9FD',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EFF6',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  companyAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#6D4BCB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  companyAvatarText: {
    color: colors.white,
    fontFamily: typography.fonts.bold,
    fontSize: 13,
  },
  headerSubtitle: {
    fontSize: 11,
    fontFamily: typography.fonts.medium,
    color: colors.textMuted,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary,
  },
  bellButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F3EFFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 18,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
    marginBottom: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontFamily: typography.fonts.medium,
    color: colors.textPrimary,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterPillActive: {
    backgroundColor: colors.buttonPrimary,
    borderColor: colors.buttonPrimary,
  },
  filterPillText: {
    fontSize: 12,
    fontFamily: typography.fonts.medium,
    color: colors.textSecondary,
  },
  filterPillTextActive: {
    color: colors.white,
    fontFamily: typography.fonts.bold,
  },
  addClientPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: 'auto',
    backgroundColor: colors.buttonPrimary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
  },
  addClientPillText: {
    color: colors.white,
    fontSize: 12,
    fontFamily: typography.fonts.bold,
  },
  clientCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 14,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  clientAvatarBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FAF5FF',
    borderWidth: 1,
    borderColor: '#E9D5FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  clientAvatarText: {
    fontSize: 15,
    fontFamily: typography.fonts.bold,
    color: colors.buttonPrimary,
  },
  clientNameCol: {
    flex: 1,
  },
  clientNameText: {
    fontSize: 15,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  companyNameText: {
    fontSize: 12,
    fontFamily: typography.fonts.regular,
    color: colors.textSecondary,
  },
  activeBadge: {
    backgroundColor: '#F3EFFC',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeBadgeText: {
    fontSize: 11,
    fontFamily: typography.fonts.bold,
    color: colors.buttonPrimary,
  },
  projectInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FAF9FD',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  projectLeftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    paddingRight: 8,
  },
  projectTitleText: {
    fontSize: 12,
    fontFamily: typography.fonts.medium,
    color: colors.textPrimary,
  },
  projectCountText: {
    fontSize: 11,
    fontFamily: typography.fonts.regular,
    color: colors.textMuted,
  },
  cardBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  outstandingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF3E8',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  outstandingBadgeText: {
    fontSize: 11,
    fontFamily: typography.fonts.bold,
    color: '#B45309',
  },
  noInvoicesBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F3EFFC',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  noInvoicesBadgeText: {
    fontSize: 11,
    fontFamily: typography.fonts.bold,
    color: colors.buttonPrimary,
  },
  actionsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconActionBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FAF9FD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EDE7F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 13,
    fontFamily: typography.fonts.regular,
    color: colors.textMuted,
    marginBottom: 16,
    textAlign: 'center',
  },
  emptyAddBtn: {
    backgroundColor: colors.buttonPrimary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
  },
  emptyAddBtnText: {
    color: colors.white,
    fontSize: 13,
    fontFamily: typography.fonts.bold,
  },
});

export default ClientsScreen;
