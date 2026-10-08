import { ScreenBackdrop } from '@/components/ui/Surface';
import { MotionProgress, MotionTouchable as TouchableOpacity } from '@/components/ui/Motion';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useAppContext } from '@/context/AppContext';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { router } from 'expo-router';

export const ProjectsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const {
    projects,
    openCreateProjectModal,
    openProjectDetailsModal,
    currentUser,
  } = useAppContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'In Progress' | 'Under Review' | 'Completed'>('All');

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'All'
        ? true
        : statusFilter === 'Under Review'
        ? p.status === 'Under Review' || p.status === 'Client Review'
        : p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <View style={styles.container}>
      <ScreenBackdrop />
      {/* Top Header */}
      <View
        style={[
          styles.headerBar,
          { paddingTop: Math.max(insets.top, 12) },
        ]}
      >
        <View style={styles.headerLeft}>
          <View style={styles.companyAvatar}>
            <Text style={styles.companyAvatarText}>
              {currentUser?.firstName?.slice(0, 2).toUpperCase() || 'IS'}
            </Text>
          </View>
          <View>
            <Text style={styles.headerSubtitle}>
              {currentUser?.agencyName || currentUser?.name || 'Workspace'}
            </Text>
            <Text style={styles.headerTitle}>Projects</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.newProjectButton}
          onPress={openCreateProjectModal}
          activeOpacity={0.8}
        >
          <Feather name="plus" size={16} color={colors.white} />
          <Text style={styles.newProjectButtonText}>New</Text>
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
            placeholder="Search projects or clients..."
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

        {/* Workflow Shortcuts Bar */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.workflowRow}
        >
          <TouchableOpacity
            style={styles.workflowPill}
            onPress={() => router.push('/tasks')}
          >
            <Feather name="check-square" size={13} color={colors.buttonPrimary} />
            <Text style={styles.workflowPillText}>Tasks</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.workflowPill}
            onPress={() => router.push('/scope')}
          >
            <Feather name="target" size={13} color={colors.buttonPrimary} />
            <Text style={styles.workflowPillText}>Scope</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.workflowPill}
            onPress={() => router.push('/contract-terms')}
          >
            <Feather name="file-text" size={13} color={colors.buttonPrimary} />
            <Text style={styles.workflowPillText}>Terms</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.workflowPill}
            onPress={() => router.push('/contract-preview')}
          >
            <Feather name="eye" size={13} color={colors.buttonPrimary} />
            <Text style={styles.workflowPillText}>Preview Contract</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.workflowPill}
            onPress={() => router.push('/contract-review')}
          >
            <Feather name="edit-3" size={13} color={colors.buttonPrimary} />
            <Text style={styles.workflowPillText}>Review & Sign</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Filter Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterRow}
          contentContainerStyle={styles.filterContent}
        >
          {(['All', 'In Progress', 'Under Review', 'Completed'] as const).map(
            (status) => {
              const isSelected = statusFilter === status;
              return (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.filterPill,
                    isSelected && styles.filterPillActive,
                  ]}
                  onPress={() => setStatusFilter(status)}
                >
                  <Text
                    style={[
                      styles.filterPillText,
                      isSelected && styles.filterPillTextActive,
                    ]}
                  >
                    {status}
                  </Text>
                </TouchableOpacity>
              );
            }
          )}
        </ScrollView>

        {/* Project Count Summary */}
        <View style={styles.countSummaryRow}>
          <Text style={styles.countSummaryText}>
            {filteredProjects.length}{' '}
            {filteredProjects.length === 1 ? 'project' : 'projects'} found
          </Text>
        </View>

        {/* Projects Cards List */}
        {filteredProjects.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconBox}>
              <Feather name="folder" size={32} color={colors.buttonPrimary} />
            </View>
            <Text style={styles.emptyTitle}>No projects found</Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery
                ? 'Try a different search query'
                : 'Create your first project to get started.'}
            </Text>
            <TouchableOpacity
              style={styles.emptyCreateBtn}
              onPress={openCreateProjectModal}
            >
              <Text style={styles.emptyCreateBtnText}>+ Create Project</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredProjects.map((project) => (
            <TouchableOpacity
              key={project.id}
              style={styles.projectCard}
              activeOpacity={0.8}
              onPress={() => openProjectDetailsModal(project.id)}
            >
              {/* Card Header: Client & Status */}
              <View style={styles.cardHeader}>
                <View style={styles.clientGroup}>
                  <View style={styles.clientAvatarMini}>
                    <Text style={styles.clientAvatarText}>
                      {project.clientInitials || 'CL'}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.cardClientName}>{project.clientName}</Text>
                    <Text style={styles.cardMilestoneText}>
                      {project.currentMilestone || 'Active phase'}
                    </Text>
                  </View>
                </View>

                <View
                  style={[
                    styles.statusBadge,
                    project.status === 'Completed'
                      ? styles.statusBadgeCompleted
                      : project.status === 'Under Review'
                      ? styles.statusBadgeReview
                      : styles.statusBadgeInProgress,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusBadgeText,
                      project.status === 'Completed'
                        ? styles.statusBadgeTextCompleted
                        : project.status === 'Under Review'
                        ? styles.statusBadgeTextReview
                        : styles.statusBadgeTextInProgress,
                    ]}
                  >
                    {project.status}
                  </Text>
                </View>
              </View>

              {/* Title & Notes */}
              <Text style={styles.cardTitle}>{project.title}</Text>
              {project.scopeNotes ? (
                <Text style={styles.cardScope} numberOfLines={2}>
                  {project.scopeNotes}
                </Text>
              ) : null}

              {/* Progress Section */}
              <View style={styles.cardProgressSection}>
                <View style={styles.cardProgressTextRow}>
                  <Text style={styles.progressLabel}>Project Progress</Text>
                  <Text style={styles.progressPercentage}>
                    {project.progressPercentage}%
                  </Text>
                </View>
                <View style={styles.progressBarWrapper}>
                  <MotionProgress style={styles.progressBarFill} value={project.progressPercentage} />
                </View>
              </View>

              {/* Card Footer: Deadline, Budget, Action */}
              <View style={styles.cardFooter}>
                <View style={styles.footerInfoItem}>
                  <Feather name="calendar" size={13} color={colors.textMuted} />
                  <Text style={styles.footerDateText}>{project.dueDate}</Text>
                </View>

                {project.budget ? (
                  <View style={styles.budgetTag}>
                    <Text style={styles.budgetTagText}>
                      LKR {project.budget.toLocaleString()}
                    </Text>
                  </View>
                ) : null}

                <View style={styles.detailsLink}>
                  <Text style={styles.detailsLinkText}>View</Text>
                  <Feather
                    name="arrow-right"
                    size={14}
                    color={colors.buttonPrimary}
                  />
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 18,
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
    borderBottomColor: '#F0EFF6'
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
    fontSize: 24,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary
  },
  newProjectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.buttonPrimary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  newProjectButtonText: {
    color: colors.white,
    fontSize: 13,
    fontFamily: typography.fonts.bold,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 18,
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 36
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
    marginBottom: 14,
  },
  filterContent: {
    gap: 8,
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
  countSummaryRow: {
    marginBottom: 12,
  },
  countSummaryText: {
    fontSize: 12,
    fontFamily: typography.fonts.medium,
    color: colors.textMuted,
  },
  projectCard: {
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  clientGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  clientAvatarMini: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EDE7F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clientAvatarText: {
    color: colors.buttonPrimary,
    fontSize: 11,
    fontFamily: typography.fonts.bold,
  },
  cardClientName: {
    fontSize: 13,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary,
  },
  cardMilestoneText: {
    fontSize: 11,
    fontFamily: typography.fonts.regular,
    color: colors.textMuted,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeInProgress: {
    backgroundColor: '#EDE7F6',
  },
  statusBadgeReview: {
    backgroundColor: '#FEF3C7',
  },
  statusBadgeCompleted: {
    backgroundColor: '#ECFDF5',
  },
  statusBadgeText: {
    fontSize: 11,
    fontFamily: typography.fonts.bold,
  },
  statusBadgeTextInProgress: {
    color: colors.buttonPrimary,
  },
  statusBadgeTextReview: {
    color: '#D97706',
  },
  statusBadgeTextCompleted: {
    color: '#059669',
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  cardScope: {
    fontSize: 12,
    fontFamily: typography.fonts.regular,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 12,
  },
  cardProgressSection: {
    marginTop: 4,
    marginBottom: 12,
  },
  cardProgressTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 11,
    fontFamily: typography.fonts.medium,
    color: colors.textSecondary,
  },
  progressPercentage: {
    fontSize: 11,
    fontFamily: typography.fonts.bold,
    color: colors.buttonPrimary,
  },
  progressBarWrapper: {
    height: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.buttonPrimary,
    borderRadius: 3,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 10,
  },
  footerInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerDateText: {
    fontSize: 11,
    fontFamily: typography.fonts.medium,
    color: colors.textSecondary,
  },
  budgetTag: {
    backgroundColor: '#FAF8FE',
    borderWidth: 1,
    borderColor: '#EDE7F6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  budgetTagText: {
    fontSize: 11,
    fontFamily: typography.fonts.bold,
    color: colors.buttonPrimary,
  },
  detailsLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailsLinkText: {
    fontSize: 12,
    fontFamily: typography.fonts.bold,
    color: colors.buttonPrimary,
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
  emptyCreateBtn: {
    backgroundColor: colors.buttonPrimary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
  },
  emptyCreateBtnText: {
    color: colors.white,
    fontSize: 13,
    fontFamily: typography.fonts.bold,
  },
  workflowRow: {
    gap: 8,
    paddingBottom: 12,
  },
  workflowPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#EEE8F6',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 7,
    shadowColor: '#493068',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  workflowPillText: {
    fontSize: 12,
    fontFamily: typography.fonts.bold,
    color: colors.buttonPrimary,
  },
});

export default ProjectsScreen;
