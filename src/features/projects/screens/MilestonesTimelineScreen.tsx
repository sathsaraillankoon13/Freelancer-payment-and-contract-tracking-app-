import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useAppContext } from '@/context/AppContext';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';
import type { Milestone, Project } from '@/types';

export const MilestonesTimelineScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const {
    projects,
    updateMilestone,
    toggleMilestone,
    deleteMilestone,
    reviewMilestone,
    currentUser,
  } = useAppContext();

  // Default to first active project
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    projects[0]?.id || ''
  );
  const activeProject: Project | undefined =
    projects.find((p) => p.id === selectedProjectId) || projects[0];

  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDueDate, setNewDueDate] = useState('');

  const milestones: Milestone[] = activeProject?.milestones || [];
  const totalCount = milestones.length;
  const completedCount = milestones.filter(
    (m) => m.status === 'completed' || m.status === 'approved'
  ).length;
  const inReviewCount = milestones.filter(
    (m) => m.status === 'client_review'
  ).length;
  const pendingCount = totalCount - completedCount - inReviewCount;
  const progressPercent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const isClientRole = currentUser?.role === 'client';
  const isProvider = !isClientRole;

  const handleAddMilestone = () => {
    if (!newTitle.trim()) {
      Alert.alert('Required', 'Please enter a title for the milestone.');
      return;
    }
    if (!activeProject) return;

    const newMilestone: Milestone = {
      id: `ms_${Date.now()}`,
      title: newTitle.trim(),
      description: newDesc.trim() || undefined,
      dueDate: newDueDate.trim() || new Date().toISOString().split('T')[0],
      status: 'pending',
    };

    const updated = [...(activeProject.milestones || []), newMilestone];
    // update project through context
    updateMilestone(activeProject.id, newMilestone.id, newMilestone);
    setNewTitle('');
    setNewDesc('');
    setNewDueDate('');
    setShowAddForm(false);
    Alert.alert('Success', 'Milestone added successfully.');
  };

  const getStatusBadge = (status: Milestone['status']) => {
    switch (status) {
      case 'approved':
      case 'completed':
        return { bg: '#DCFCE7', text: '#15803D', label: 'Approved' };
      case 'client_review':
        return { bg: '#FEF3C7', text: '#B45309', label: 'Client Review' };
      case 'changes_requested':
        return { bg: '#FEE2E2', text: '#B91C1C', label: 'Changes Requested' };
      default:
        return { bg: '#F1F5F9', text: '#475569', label: 'Pending' };
    }
  };

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 16) }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSubtitle}>Milestone & Approval</Text>
          <Text style={styles.headerTitle}>Milestones & Timeline</Text>
        </View>
        {isProvider && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddForm(!showAddForm)}
          >
            <Feather
              name={showAddForm ? 'x' : 'plus'}
              size={18}
              color="#FFFFFF"
            />
            <Text style={styles.addButtonText}>
              {showAddForm ? 'Cancel' : 'New Milestone'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 24) + 60 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Project Selector Chips */}
        {projects.length > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.projectChipsScroll}
          >
            {projects.map((p) => {
              const isSelected = p.id === activeProject?.id;
              return (
                <TouchableOpacity
                  key={p.id}
                  style={[
                    styles.projectChip,
                    isSelected && styles.projectChipSelected,
                  ]}
                  onPress={() => setSelectedProjectId(p.id)}
                >
                  <Text
                    style={[
                      styles.projectChipText,
                      isSelected && styles.projectChipTextSelected,
                    ]}
                  >
                    {p.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}

        {/* Overview Stats Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryTopRow}>
            <Text style={styles.summaryCardTitle}>Overall Progress</Text>
            <Text style={styles.summaryCardPercent}>{progressPercent}%</Text>
          </View>
          <View style={styles.progressBarTrack}>
            <View
              style={[styles.progressBarFill, { width: `${progressPercent}%` }]}
            />
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{totalCount}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: '#15803D' }]}>
                {completedCount}
              </Text>
              <Text style={styles.statLabel}>Approved</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: '#B45309' }]}>
                {inReviewCount}
              </Text>
              <Text style={styles.statLabel}>In Review</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: '#475569' }]}>
                {pendingCount}
              </Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
          </View>
        </View>

        {/* Inline Add Milestone Form */}
        {showAddForm && (
          <View style={styles.addFormCard}>
            <Text style={styles.addFormTitle}>Add New Milestone</Text>
            <Text style={styles.inputLabel}>Milestone Title *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. Phase 2: Design System & Mockups"
              placeholderTextColor="#94A3B8"
              value={newTitle}
              onChangeText={setNewTitle}
            />
            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={[styles.textInput, { height: 72 }]}
              placeholder="Deliverables and criteria for this milestone..."
              placeholderTextColor="#94A3B8"
              value={newDesc}
              onChangeText={setNewDesc}
              multiline
            />
            <Text style={styles.inputLabel}>Due Date (YYYY-MM-DD)</Text>
            <TextInput
              style={styles.textInput}
              placeholder="2026-11-15"
              placeholderTextColor="#94A3B8"
              value={newDueDate}
              onChangeText={setNewDueDate}
            />
            <TouchableOpacity
              style={styles.saveMilestoneBtn}
              onPress={handleAddMilestone}
            >
              <Feather name="check" size={16} color="#FFFFFF" />
              <Text style={styles.saveMilestoneBtnText}>Save Milestone</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Milestones Timeline List */}
        <Text style={styles.sectionHeader}>
          Milestones Timeline ({milestones.length})
        </Text>

        {milestones.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Feather name="flag" size={40} color="#CBD5E1" />
            <Text style={styles.emptyText}>No milestones set for this project.</Text>
          </View>
        ) : (
          milestones.map((m, index) => {
            const isApproved =
              m.status === 'approved' || m.status === 'completed';
            const badge = getStatusBadge(m.status);

            return (
              <View key={m.id} style={styles.milestoneCard}>
                <View style={styles.milestoneHeader}>
                  <TouchableOpacity
                    style={styles.checkboxToggle}
                    disabled={!isProvider}
                    onPress={() =>
                      activeProject && toggleMilestone(activeProject.id, m.id)
                    }
                  >
                    <Ionicons
                      name={isApproved ? 'checkmark-circle' : 'ellipse-outline'}
                      size={24}
                      color={isApproved ? '#059669' : colors.buttonPrimary}
                    />
                  </TouchableOpacity>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text
                      style={[
                        styles.milestoneTitle,
                        isApproved && styles.milestoneTitleCompleted,
                      ]}
                    >
                      {m.title}
                    </Text>
                    {m.description ? (
                      <Text style={styles.milestoneDesc}>{m.description}</Text>
                    ) : null}
                    <View style={styles.dueDateRow}>
                      <Feather name="calendar" size={12} color="#64748B" />
                      <Text style={styles.dueDateText}>Due: {m.dueDate}</Text>
                    </View>
                  </View>
                  <View style={styles.badgeColumn}>
                    <View
                      style={[styles.badgeContainer, { backgroundColor: badge.bg }]}
                    >
                      <Text style={[styles.badgeText, { color: badge.text }]}>
                        {badge.label}
                      </Text>
                    </View>
                    {isProvider && (
                      <TouchableOpacity
                        onPress={() =>
                          activeProject && deleteMilestone(activeProject.id, m.id)
                        }
                        style={styles.deleteIcon}
                      >
                        <Feather name="trash-2" size={14} color="#94A3B8" />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>

                {/* Review History */}
                {m.reviewHistory && m.reviewHistory.length > 0 && (
                  <View style={styles.historyContainer}>
                    <Text style={styles.historyHeading}>Review History:</Text>
                    {m.reviewHistory.map((rev, rIdx) => (
                      <Text key={rIdx} style={styles.historyItem}>
                        • {rev.date} - {rev.action.toUpperCase()} by{' '}
                        {rev.userName}: {rev.note || 'No note'}
                      </Text>
                    ))}
                  </View>
                )}

                {/* Action Buttons */}
                <View style={styles.actionRow}>
                  {isProvider &&
                    m.status !== 'approved' &&
                    m.status !== 'client_review' && (
                      <TouchableOpacity
                        style={styles.submitReviewBtn}
                        onPress={() =>
                          activeProject &&
                          updateMilestone(activeProject.id, m.id, {
                            status: 'client_review',
                          })
                        }
                      >
                        <Feather name="send" size={14} color="#4F46E5" />
                        <Text style={styles.submitReviewBtnText}>
                          Submit for Review
                        </Text>
                      </TouchableOpacity>
                    )}

                  {(isClientRole || isProvider) &&
                    m.status === 'client_review' && (
                      <View style={styles.clientActionButtons}>
                        <TouchableOpacity
                          style={styles.approveBtn}
                          onPress={() =>
                            activeProject &&
                            reviewMilestone(
                              activeProject.id,
                              m.id,
                              'approved',
                              'Milestone accepted and approved'
                            )
                          }
                        >
                          <Ionicons name="checkmark" size={16} color="#15803D" />
                          <Text style={styles.approveBtnText}>Approve</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.requestChangesBtn}
                          onPress={() =>
                            activeProject &&
                            reviewMilestone(
                              activeProject.id,
                              m.id,
                              'changes_requested',
                              'Revisions requested on milestone'
                            )
                          }
                        >
                          <Ionicons
                            name="alert-circle-outline"
                            size={16}
                            color="#C2410C"
                          />
                          <Text style={styles.requestChangesBtnText}>
                            Request Changes
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerSubtitle: {
    fontSize: 12,
    fontFamily: typography.semiBold,
    color: '#6366F1',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: typography.bold,
    color: '#0F172A',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366F1',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontFamily: typography.semiBold,
    fontSize: 13,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  projectChipsScroll: {
    marginBottom: 16,
  },
  projectChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  projectChipSelected: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  projectChipText: {
    fontSize: 13,
    fontFamily: typography.medium,
    color: '#64748B',
  },
  projectChipTextSelected: {
    color: '#FFFFFF',
    fontFamily: typography.semiBold,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  summaryTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryCardTitle: {
    fontSize: 14,
    fontFamily: typography.semiBold,
    color: '#0F172A',
  },
  summaryCardPercent: {
    fontSize: 16,
    fontFamily: typography.bold,
    color: '#6366F1',
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#6366F1',
    borderRadius: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontFamily: typography.bold,
    color: '#0F172A',
  },
  statLabel: {
    fontSize: 11,
    fontFamily: typography.medium,
    color: '#64748B',
    marginTop: 2,
  },
  addFormCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  addFormTitle: {
    fontSize: 15,
    fontFamily: typography.bold,
    color: '#0F172A',
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 12,
    fontFamily: typography.medium,
    color: '#475569',
    marginBottom: 4,
    marginTop: 8,
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: typography.regular,
    color: '#0F172A',
  },
  saveMilestoneBtn: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 16,
    gap: 8,
  },
  saveMilestoneBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: typography.semiBold,
  },
  sectionHeader: {
    fontSize: 16,
    fontFamily: typography.bold,
    color: '#0F172A',
    marginBottom: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: typography.regular,
    color: '#94A3B8',
    marginTop: 10,
  },
  milestoneCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  milestoneHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkboxToggle: {
    paddingTop: 2,
  },
  milestoneTitle: {
    fontSize: 15,
    fontFamily: typography.semiBold,
    color: '#0F172A',
  },
  milestoneTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },
  milestoneDesc: {
    fontSize: 13,
    fontFamily: typography.regular,
    color: '#64748B',
    marginTop: 4,
  },
  dueDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  dueDateText: {
    fontSize: 12,
    fontFamily: typography.regular,
    color: '#64748B',
  },
  badgeColumn: {
    alignItems: 'flex-end',
    marginLeft: 8,
  },
  badgeContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontFamily: typography.semiBold,
  },
  deleteIcon: {
    marginTop: 8,
    padding: 4,
  },
  historyContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 10,
    marginTop: 12,
  },
  historyHeading: {
    fontSize: 11,
    fontFamily: typography.bold,
    color: '#475569',
    marginBottom: 4,
  },
  historyItem: {
    fontSize: 11,
    fontFamily: typography.regular,
    color: '#64748B',
    lineHeight: 16,
  },
  actionRow: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  submitReviewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF2FF',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  submitReviewBtnText: {
    fontSize: 13,
    fontFamily: typography.semiBold,
    color: '#4F46E5',
  },
  clientActionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  approveBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DCFCE7',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  approveBtnText: {
    fontSize: 13,
    fontFamily: typography.semiBold,
    color: '#15803D',
  },
  requestChangesBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFEDD5',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  requestChangesBtnText: {
    fontSize: 13,
    fontFamily: typography.semiBold,
    color: '#C2410C',
  },
});

export default MilestonesTimelineScreen;
