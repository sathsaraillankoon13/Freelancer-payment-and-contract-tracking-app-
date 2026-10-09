import { ScreenBackdrop } from '@/components/ui/Surface';
import { MotionProgress, MotionTouchable as TouchableOpacity, MotionModal as Modal } from '@/components/ui/Motion';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  Share,
  Platform,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useAppContext } from '@/context/AppContext';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { router } from 'expo-router';
import { ProjectStatus } from '@/types';
import { pickImage } from '@/services/attachments';
import { DatePickerModal } from '@/components/common/DatePickerModal';

const PROJECT_STATUSES: ProjectStatus[] = [
  'Draft',
  'Pending',
  'In Progress',
  'Client Review',
  'Changes Requested',
  'Completed',
  'On Hold',
  'Cancelled',
];

export const ProjectDetailsModal: React.FC = () => {
  const insets = useSafeAreaInsets();
  const {
    activeModal,
    selectedProjectId,
    closeModal,
    projects,
    tasks,
    toggleTask,
    addTask,
    deleteTask,
    toggleMilestone,
    addMilestone,
    deleteMilestone,
    reviewMilestone,
    updateMilestone,
    openCreateInvoiceModal,
    currentUser,
    canManageFinances,
    openSubmitDeliverableModal,
    openReviewDeliverableModal,
    openMessagesThreadModal,
    openSubmitPaymentModal,
    requestScopeChange,
    respondScopeChange,
    deliverables,
    invoices,
    updateProject,
    updateProjectStatus,
    archiveProject,
    deleteProject,
    comments,
    addComment,
    deleteComment,
  } = useAppContext();

  const role = currentUser?.role || 'freelancer';
  const isVisible = activeModal === 'project_details' && !!selectedProjectId;
  const project = projects.find((p) => p.id === selectedProjectId) || projects[0];

  const [activeTab, setActiveTab] = useState<
    'overview' | 'scope' | 'tasks' | 'milestones' | 'deliverables' | 'comments' | 'invoices'
  >('overview');

  const [isEditProjectModalVisible, setIsEditProjectModalVisible] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editBudget, setEditBudget] = useState('');
  const [editDeadline, setEditDeadline] = useState('');
  const [editScopeNotes, setEditScopeNotes] = useState('');
  const [editCoverImage, setEditCoverImage] = useState<string | null>(null);
  const [showEditDatePicker, setShowEditDatePicker] = useState(false);

  const handleOpenEditProject = () => {
    if (!project) return;
    setEditTitle(project.title);
    setEditBudget(project.budget ? String(project.budget) : '');
    setEditDeadline(project.dueDate || '');
    setEditScopeNotes(project.scopeNotes || '');
    setEditCoverImage(project.coverImage || null);
    setIsEditProjectModalVisible(true);
  };

  const handlePickEditCover = async () => {
    try {
      const img = await pickImage();
      if (img) setEditCoverImage(img.uri);
    } catch (e) {
      Alert.alert('Cover Image', e instanceof Error ? e.message : 'Unable to select image.');
    }
  };

  const handleSaveProjectEdit = () => {
    if (!project) return;
    if (!editTitle.trim()) {
      Alert.alert('Required Field', 'Please enter a project name.');
      return;
    }
    const b = editBudget.trim() ? Number(editBudget) : project.budget;
    updateProject(project.id, {
      title: editTitle.trim(),
      budget: Number.isFinite(b) ? b : project.budget,
      dueDate: editDeadline.trim() || project.dueDate,
      scopeNotes: editScopeNotes.trim(),
      coverImage: editCoverImage || undefined,
    });
    setIsEditProjectModalVisible(false);
    Alert.alert('Project Updated', 'Project details saved successfully.');
  };
  const [showStatusPicker, setShowStatusPicker] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [taskPriority, setTaskPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [showAddTask, setShowAddTask] = useState(false);

  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [milestoneDesc, setMilestoneDesc] = useState('');
  const [showAddMilestone, setShowAddMilestone] = useState(false);

  // Comments state
  const [commentText, setCommentText] = useState('');
  const [commentVisibility, setCommentVisibility] = useState<'internal' | 'shared'>('internal');

  // Scope change state for Client
  const [showScopeChangeInput, setShowScopeChangeInput] = useState(false);
  const [scopeChangeText, setScopeChangeText] = useState('');

  if (!project) return null;

  const projectTasks = tasks.filter((t) => t.projectId === project.id);
  const projectMilestones = project.milestones || [];
  const projectDeliverables = deliverables.filter((d) => d.projectId === project.id);
  const projectInvoices = invoices.filter((i) => i.projectId === project.id);
  const projectComments = comments.filter(
    (c) => c.targetType === 'project' && c.targetId === project.id
  );

  const isClientRole = role === 'client';
  const isProvider = role === 'freelancer' || role === 'team';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft':
        return { bg: '#F3F4F6', text: '#6B7280' };
      case 'Pending':
        return { bg: '#FEF3C7', text: '#B45309' };
      case 'In Progress':
        return { bg: '#EDE9FE', text: '#6D28D9' };
      case 'Client Review':
        return { bg: '#DBEAFE', text: '#1D4ED8' };
      case 'Changes Requested':
        return { bg: '#FFEDD5', text: '#C2410C' };
      case 'Completed':
        return { bg: '#DCFCE7', text: '#15803D' };
      case 'On Hold':
        return { bg: '#F1F5F9', text: '#475569' };
      case 'Cancelled':
        return { bg: '#FEE2E2', text: '#B91C1C' };
      default:
        return { bg: '#EDE9FE', text: '#6D28D9' };
    }
  };

  const handleUpdateStatus = (newStatus: ProjectStatus) => {
    updateProjectStatus(project.id, newStatus);
    setShowStatusPicker(false);
  };

  const handleArchiveProject = () => {
    archiveProject(project.id, !project.isArchived);
  };

  const handleDeleteProject = () => {
    Alert.alert(
      'Delete Project',
      `Are you sure you want to delete "${project.title}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const res = deleteProject(project.id);
            if (!res.success) {
              Alert.alert(
                'Cannot Delete Project',
                `${res.reason}\n\nWould you like to archive this project instead to preserve history?`,
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Archive Project',
                    onPress: () => archiveProject(project.id, true),
                  },
                ]
              );
            } else {
              closeModal();
            }
          },
        },
      ]
    );
  };

  const handleAddTask = () => {
    const title = newTaskTitle.trim() || 'Project Task';
    addTask(project.id, title, '11:00 AM', undefined, taskPriority);
    setNewTaskTitle('');
    setShowAddTask(false);
  };

  const handleDeleteTask = (taskId: string) => {
    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteTask(taskId) },
    ]);
  };

  const handleAddMilestone = () => {
    if (!newMilestoneTitle.trim()) return;
    addMilestone(
      project.id,
      newMilestoneTitle.trim(),
      project.dueDate || '30 Oct 2026',
      milestoneDesc.trim() || undefined
    );
    setNewMilestoneTitle('');
    setMilestoneDesc('');
    setShowAddMilestone(false);
  };

  const handleDeleteMilestone = (milestoneId: string) => {
    Alert.alert(
      'Delete Milestone',
      'Are you sure you want to delete this milestone? Any linked tasks will be kept safely.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteMilestone(project.id, milestoneId),
        },
      ]
    );
  };

  const handlePostComment = () => {
    if (!commentText.trim()) return;
    addComment({
      targetType: 'project',
      targetId: project.id,
      text: commentText.trim(),
      visibility: isClientRole ? 'shared' : commentVisibility,
    });
    setCommentText('');
  };

  const handleSubmitScopeChange = () => {
    if (!scopeChangeText.trim()) return;
    requestScopeChange(project.id, scopeChangeText.trim());
    setScopeChangeText('');
    setShowScopeChangeInput(false);
    Alert.alert('Scope Revision Submitted', 'Your provider has been notified and will review your proposed changes.');
  };

  const handleAcceptScopeRevision = () => {
    respondScopeChange(project.id, true);
    Alert.alert('Scope Updated', 'The requested scope changes have been accepted and merged into the project scope.');
  };

  const handleDeclineScopeRevision = () => {
    respondScopeChange(project.id, false);
    Alert.alert('Scope Revision Declined', 'The proposed scope changes were declined.');
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
        {/* Top Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={closeModal}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather name="arrow-left" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {project.title}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            {isProvider && (
              <TouchableOpacity
                onPress={handleArchiveProject}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                style={{ padding: 4 }}
              >
                <Feather
                  name={project.isArchived ? 'rotate-ccw' : 'archive'}
                  size={18}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.headerRight} onPress={closeModal}>
              <Feather name="x" size={22} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom, 24) + 60 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Project Title Card */}
          <View style={styles.titleCard}>
            <View style={styles.titleHeaderRow}>
              <View style={styles.iconSquare}>
                <Ionicons name="folder-open" size={20} color={colors.buttonPrimary} />
              </View>
              <TouchableOpacity
                onPress={() => isProvider && setShowStatusPicker(!showStatusPicker)}
                style={[
                  styles.badgeStatus,
                  { backgroundColor: getStatusColor(project.status).bg },
                ]}
                disabled={!isProvider}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.badgeStatusText,
                    { color: getStatusColor(project.status).text },
                  ]}
                >
                  {project.status} {isProvider ? '▾' : ''}
                </Text>
              </TouchableOpacity>

              {isProvider && (
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 4,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderRadius: 20,
                    backgroundColor: '#F3EFFC',
                    borderWidth: 1,
                    borderColor: '#ECEAF5',
                    marginLeft: 8,
                  }}
                  onPress={handleOpenEditProject}
                  activeOpacity={0.7}
                >
                  <Feather name="edit-2" size={12} color={colors.buttonPrimary} />
                  <Text style={{ fontSize: 12, fontFamily: typography.fonts.semiBold, color: colors.buttonPrimary }}>
                    Edit
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Status Picker Carousel */}
            {showStatusPicker && isProvider && (
              <View style={styles.statusPickerBox}>
                <Text style={styles.statusPickerBoxLabel}>Change Status:</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={{ marginVertical: 6 }}
                >
                  {PROJECT_STATUSES.map((st) => (
                    <TouchableOpacity
                      key={st}
                      style={[
                        styles.statusPickerPill,
                        project.status === st && styles.statusPickerPillSelected,
                      ]}
                      onPress={() => handleUpdateStatus(st)}
                    >
                      <Text
                        style={[
                          styles.statusPickerPillText,
                          project.status === st && styles.statusPickerPillTextSelected,
                        ]}
                      >
                        {st}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {project.coverImage ? (
              <Image
                source={{ uri: project.coverImage }}
                style={{ width: '100%', height: 160, borderRadius: 16, marginBottom: 14, backgroundColor: '#F3F0FA' }}
                resizeMode="cover"
              />
            ) : null}
            <Text style={styles.projectTitle}>{project.title}</Text>
            <Text style={styles.projectScope} numberOfLines={3}>
              {project.scopeNotes || 'Comprehensive project execution and delivery scope.'}
            </Text>

            {/* Client Mini Card */}
            <View style={styles.clientCard}>
              <View style={styles.clientAvatar}>
                <Text style={styles.clientAvatarText}>
                  {project.clientInitials || 'CL'}
                </Text>
              </View>
              <View style={styles.clientInfo}>
                <Text style={styles.clientLabel}>
                  {isClientRole ? 'Provider / Agency' : 'Client'}
                </Text>
                <Text style={styles.clientName}>{project.clientName}</Text>
              </View>
              <TouchableOpacity
                style={styles.chatClientBtn}
                onPress={() => {
                  closeModal();
                  openMessagesThreadModal(project.clientId || 'cl_1');
                }}
              >
                <Feather name="message-square" size={15} color={colors.buttonPrimary} />
                <Text style={styles.chatClientBtnText}>Message</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Progress Overview Card */}
          <View style={styles.progressCard}>
            <View style={styles.progressHeaderRow}>
              <View style={styles.progressPctRow}>
                <Text style={styles.progressPctText}>{project.progressPercentage}%</Text>
                <Text style={styles.progressPctLabel}>completed</Text>
              </View>
              <View style={styles.onTrackBadge}>
                <Feather name="trending-up" size={14} color="#059669" />
                <Text style={styles.onTrackText}>On track</Text>
              </View>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressBarWrapper}>
              <MotionProgress style={styles.progressBarFill} value={project.progressPercentage} />
            </View>

            <View style={styles.progressMetricsRow}>
              <View style={styles.metricItem}>
                <Ionicons name="checkmark-circle-outline" size={16} color={colors.buttonPrimary} />
                <Text style={styles.metricText}>
                  {project.completedTasks} of {project.totalTasks} tasks completed
                </Text>
              </View>

              <View style={styles.metricItem}>
                <Feather name="flag" size={14} color={colors.buttonPrimary} />
                <Text style={styles.metricText}>
                  {project.milestones?.filter((m) => m.status === 'completed').length || 0} milestones approved
                </Text>
              </View>
            </View>
          </View>

          {/* Pending Scope Change Notice if any */}
          {project.proposedScopeChange && (
            <View
              style={[
                styles.scopeNoticeCard,
                project.proposedScopeChange.status === 'pending'
                  ? styles.scopeNoticePending
                  : project.proposedScopeChange.status === 'accepted'
                  ? styles.scopeNoticeAccepted
                  : styles.scopeNoticeDeclined,
              ]}
            >
              <View style={styles.scopeNoticeHeader}>
                <View style={styles.scopeNoticeHeaderLeft}>
                  <Ionicons
                    name="git-pull-request-outline"
                    size={18}
                    color={
                      project.proposedScopeChange.status === 'pending'
                        ? '#D97706'
                        : project.proposedScopeChange.status === 'accepted'
                        ? '#059669'
                        : '#DC2626'
                    }
                  />
                  <Text style={styles.scopeNoticeTitle}>
                    {project.proposedScopeChange.status === 'pending'
                      ? 'Proposed Scope Revision'
                      : project.proposedScopeChange.status === 'accepted'
                      ? 'Scope Revision Accepted'
                      : 'Scope Revision Declined'}
                  </Text>
                </View>
                <Text style={styles.scopeNoticeDate}>
                  {project.proposedScopeChange.requestedAt}
                </Text>
              </View>

              <Text style={styles.scopeNoticeBy}>
                Requested by: <Text style={styles.boldText}>{project.proposedScopeChange.requestedBy}</Text>
              </Text>
              <Text style={styles.scopeNoticeBody}>
                &ldquo;{project.proposedScopeChange.proposedNotes}&rdquo;
              </Text>

              {isProvider && project.proposedScopeChange.status === 'pending' && (
                <View style={styles.scopeActionRow}>
                  <TouchableOpacity
                    style={styles.scopeAcceptBtn}
                    onPress={handleAcceptScopeRevision}
                  >
                    <Ionicons name="checkmark" size={16} color={colors.white} />
                    <Text style={styles.scopeAcceptBtnText}>Accept Revision</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.scopeDeclineBtn}
                    onPress={handleDeclineScopeRevision}
                  >
                    <Ionicons name="close" size={16} color={colors.textSecondary} />
                    <Text style={styles.scopeDeclineBtnText}>Decline</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}

          {/* Quick Metrics Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statBoxLabel}>Start date</Text>
              <Text style={styles.statBoxValue}>{project.startDate || '16 Sep 2026'}</Text>
              <Text style={styles.statBoxSub}>Sprint initiated</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statBoxLabel}>Deadline</Text>
              <Text style={styles.statBoxValue}>{project.dueDate}</Text>
              <Text style={[styles.statBoxSub, { color: '#E11D48' }]}>
                {project.daysLeftText || 'Due soon'}
              </Text>
            </View>

            {canManageFinances && (
              <View style={styles.statBox}>
                <Text style={styles.statBoxLabel}>Budget</Text>
                <Text style={styles.statBoxValue}>
                  LKR {project.budget?.toLocaleString() || '180,000'}
                </Text>
                <Text style={styles.statBoxSub}>Project fee</Text>
              </View>
            )}

            <View style={styles.statBox}>
              <Text style={styles.statBoxLabel}>Priority</Text>
              <Text style={[styles.statBoxValue, { color: colors.buttonPrimary }]}>
                {project.priority || 'High'}
              </Text>
              <Text style={styles.statBoxSub}>Project tier</Text>
            </View>
          </View>

          {/* Segmented Tab Row */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tabScroll}
            contentContainerStyle={styles.tabScrollContent}
          >
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'scope', label: 'Scope' },
              { id: 'tasks', label: `Tasks (${projectTasks.length})` },
              { id: 'milestones', label: `Milestones (${projectMilestones.length})` },
              { id: 'deliverables', label: `Deliverables (${projectDeliverables.length})` },
              { id: 'comments', label: `Comments (${projectComments.length})` },
              { id: 'invoices', label: `Invoices (${projectInvoices.length})` },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <TouchableOpacity
                  key={tab.id}
                  style={[styles.subTabButton, isActive && styles.subTabButtonActive]}
                  onPress={() => setActiveTab(tab.id as any)}
                >
                  <Text
                    style={[
                      styles.subTabButtonText,
                      isActive && styles.subTabButtonTextActive,
                    ]}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Tab 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <View>
              {/* Quick Deliverable Card */}
              <View style={styles.sectionContainer}>
                <View style={styles.sectionHeaderRow}>
                  <Text style={styles.sectionTitle}>Deliverables</Text>
                  {isProvider ? (
                    <TouchableOpacity
                      onPress={() => {
                        closeModal();
                        openSubmitDeliverableModal(project.id);
                      }}
                      style={styles.addInlineBtn}
                    >
                      <Text style={styles.addInlineBtnText}>+ Submit deliverable</Text>
                    </TouchableOpacity>
                  ) : null}
                </View>

                {projectDeliverables.length === 0 ? (
                  <Text style={styles.emptyText}>No deliverables uploaded yet for this project.</Text>
                ) : (
                  projectDeliverables.map((del) => (
                    <View key={del.id} style={styles.deliverableItemRow}>
                      <View style={styles.deliverableIconBox}>
                        <Ionicons name="cube-outline" size={20} color={colors.buttonPrimary} />
                      </View>
                      <View style={styles.deliverableInfoCol}>
                        <Text style={styles.deliverableName}>{del.deliverableName}</Text>
                        <Text style={styles.deliverableFile}>{del.fileName} • {del.submittedText}</Text>
                      </View>
                      {isClientRole && del.status === 'action_required' ? (
                        <TouchableOpacity
                          style={styles.reviewBtn}
                          onPress={() => {
                            closeModal();
                            openReviewDeliverableModal(del.id);
                          }}
                        >
                          <Text style={styles.reviewBtnText}>Review</Text>
                        </TouchableOpacity>
                      ) : (
                        <View
                          style={[
                            styles.delStatusBadge,
                            del.status === 'approved'
                              ? styles.badgeApproved
                              : del.status === 'changes_requested'
                              ? styles.badgeChanges
                              : styles.badgeReview,
                          ]}
                        >
                          <Text
                            style={[
                              styles.delStatusBadgeText,
                              del.status === 'approved'
                                ? styles.textApproved
                                : del.status === 'changes_requested'
                                ? styles.textChanges
                                : styles.textReview,
                            ]}
                          >
                            {del.status === 'approved'
                              ? 'Approved'
                              : del.status === 'changes_requested'
                              ? 'Changes Requested'
                              : 'In Review'}
                          </Text>
                        </View>
                      )}
                    </View>
                  ))
                )}
              </View>

              {/* Milestones Card */}
              <View style={styles.sectionContainer}>
                <View style={styles.sectionHeaderRow}>
                  <Text style={styles.sectionTitle}>Milestones</Text>
                  {isProvider && (
                    <TouchableOpacity
                      onPress={() => setShowAddMilestone(true)}
                      style={styles.addInlineBtn}
                    >
                      <Text style={styles.addInlineBtnText}>+ Add milestone</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {projectMilestones.map((m) => {
                  const isCompleted = m.status === 'completed';
                  return (
                    <View key={m.id} style={styles.milestoneCard}>
                      <TouchableOpacity
                        style={styles.milestoneStatusToggle}
                        onPress={() => isProvider && toggleMilestone(project.id, m.id)}
                        disabled={!isProvider}
                      >
                        <Ionicons
                          name={isCompleted ? 'checkmark-circle' : 'ellipse-outline'}
                          size={22}
                          color={isCompleted ? colors.buttonPrimary : colors.textMuted}
                        />
                      </TouchableOpacity>
                      <View style={styles.milestoneDetails}>
                        <Text
                          style={[
                            styles.milestoneName,
                            isCompleted && styles.milestoneNameCompleted,
                          ]}
                        >
                          {m.title}
                        </Text>
                        <Text style={styles.milestoneDateText}>Due: {m.dueDate}</Text>
                      </View>
                      <View
                        style={[
                          styles.milestoneStatusBadge,
                          isCompleted ? styles.badgeCompleted : styles.badgeUpcoming,
                        ]}
                      >
                        <Text
                          style={[
                            styles.milestoneBadgeText,
                            isCompleted ? styles.badgeTextCompleted : styles.badgeTextUpcoming,
                          ]}
                        >
                          {isCompleted ? 'Completed' : 'Pending'}
                        </Text>
                      </View>
                    </View>
                  );
                })}

                {showAddMilestone && (
                  <View style={styles.inlineAddBox}>
                    <TextInput
                      style={styles.inlineInput}
                      placeholder="Milestone title..."
                      value={newMilestoneTitle}
                      onChangeText={setNewMilestoneTitle}
                      autoFocus
                    />
                    <View style={styles.inlineActions}>
                      <TouchableOpacity
                        style={styles.saveInlineBtn}
                        onPress={handleAddMilestone}
                      >
                        <Text style={styles.saveInlineBtnText}>Save</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.cancelInlineBtn}
                        onPress={() => setShowAddMilestone(false)}
                      >
                        <Text style={styles.cancelInlineBtnText}>Cancel</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Tab 2: SCOPE */}
          {activeTab === 'scope' && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Project Scope & Specifications</Text>
              <Text style={styles.scopeFullText}>
                {project.scopeNotes || 'Comprehensive project scope agreed upon at commencement.'}
              </Text>

              {isClientRole && (
                <View style={styles.scopeClientActionBox}>
                  {!showScopeChangeInput ? (
                    <TouchableOpacity
                      style={styles.requestScopeBtn}
                      onPress={() => setShowScopeChangeInput(true)}
                    >
                      <Ionicons name="create-outline" size={18} color={colors.buttonPrimary} />
                      <Text style={styles.requestScopeBtnText}>Request Scope Revision</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.scopeInputWrapper}>
                      <Text style={styles.scopeInputTitle}>Proposed Scope Changes</Text>
                      <Text style={styles.scopeInputSub}>
                        Describe new features, revisions, or timeline adjustments for your provider&apos;s review.
                      </Text>
                      <TextInput
                        style={styles.scopeTextInput}
                        placeholder="e.g. Add multi-currency payment checkout and 2 additional mobile screens..."
                        value={scopeChangeText}
                        onChangeText={setScopeChangeText}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                      />
                      <View style={styles.inlineActions}>
                        <TouchableOpacity
                          style={styles.saveInlineBtn}
                          onPress={handleSubmitScopeChange}
                        >
                          <Text style={styles.saveInlineBtnText}>Submit Request</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.cancelInlineBtn}
                          onPress={() => setShowScopeChangeInput(false)}
                        >
                          <Text style={styles.cancelInlineBtnText}>Cancel</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </View>
              )}
            </View>
          )}

          {/* Tab 3: TASKS */}
          {activeTab === 'tasks' && (
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>Tasks ({projectTasks.length})</Text>
                {isProvider && (
                  <TouchableOpacity
                    onPress={() => setShowAddTask(true)}
                    style={styles.addInlineBtn}
                  >
                    <Text style={styles.addInlineBtnText}>+ Add task</Text>
                  </TouchableOpacity>
                )}
              </View>

              {projectTasks.length === 0 ? (
                <Text style={styles.emptyText}>No tasks created yet for this project.</Text>
              ) : (
                projectTasks.map((t) => (
                  <View key={t.id} style={styles.taskCard}>
                    <TouchableOpacity
                      style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
                      activeOpacity={0.7}
                      onPress={() => toggleTask(t.id)}
                    >
                      <Ionicons
                        name={t.completed ? 'checkbox' : 'square-outline'}
                        size={22}
                        color={t.completed ? colors.buttonPrimary : colors.textMuted}
                      />
                      <View style={styles.taskTextWrapper}>
                        <Text
                          style={[
                            styles.taskTitle,
                            t.completed && styles.taskTitleCompleted,
                          ]}
                        >
                          {t.title}
                        </Text>
                        <Text style={styles.taskTime}>
                          {t.dueDate ? `Due ${t.dueDate}` : t.scheduledTime || 'Scheduled'} • Priority: {t.priority || 'Normal'}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    {isProvider && (
                      <TouchableOpacity
                        onPress={() => handleDeleteTask(t.id)}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        style={{ padding: 6 }}
                      >
                        <Feather name="trash-2" size={16} color={colors.textMuted} />
                      </TouchableOpacity>
                    )}
                  </View>
                ))
              )}

              {showAddTask && (
                <View style={styles.inlineAddBox}>
                  <TextInput
                    style={styles.inlineInput}
                    placeholder="Task title..."
                    value={newTaskTitle}
                    onChangeText={setNewTaskTitle}
                    returnKeyType="done"
                    onSubmitEditing={handleAddTask}
                    autoFocus
                  />
                  <View style={{ flexDirection: 'row', gap: 6, marginVertical: 8, alignItems: 'center' }}>
                    <Text style={{ fontSize: 12, fontFamily: typography.fonts.semiBold, color: colors.textSecondary }}>
                      Priority:
                    </Text>
                    {(['Low', 'Medium', 'High'] as const).map((p) => (
                      <TouchableOpacity
                        key={p}
                        style={[
                          styles.miniPriorityPill,
                          taskPriority === p && styles.miniPriorityPillSelected,
                        ]}
                        onPress={() => setTaskPriority(p)}
                      >
                        <Text
                          style={[
                            styles.miniPriorityText,
                            taskPriority === p && styles.miniPriorityTextSelected,
                          ]}
                        >
                          {p}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <View style={styles.inlineActions}>
                    <TouchableOpacity
                      style={styles.saveInlineBtn}
                      onPress={handleAddTask}
                    >
                      <Text style={styles.saveInlineBtnText}>Add Task</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.cancelInlineBtn}
                      onPress={() => setShowAddTask(false)}
                    >
                      <Text style={styles.cancelInlineBtnText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          )}

          {/* Tab: MILESTONES */}
          {activeTab === 'milestones' && (
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>Milestones ({projectMilestones.length})</Text>
                {isProvider && (
                  <TouchableOpacity
                    onPress={() => setShowAddMilestone(true)}
                    style={styles.addInlineBtn}
                  >
                    <Text style={styles.addInlineBtnText}>+ Add milestone</Text>
                  </TouchableOpacity>
                )}
              </View>

              {projectMilestones.length === 0 ? (
                <Text style={styles.emptyText}>No milestones set for this project.</Text>
              ) : (
                projectMilestones.map((m) => {
                  const isApproved = m.status === 'approved' || m.status === 'completed';
                  return (
                    <View key={m.id} style={styles.milestoneFullCard}>
                      <View style={styles.milestoneFullHeader}>
                        <TouchableOpacity
                          style={styles.milestoneStatusToggle}
                          onPress={() => isProvider && toggleMilestone(project.id, m.id)}
                          disabled={!isProvider}
                        >
                          <Ionicons
                            name={isApproved ? 'checkmark-circle' : 'ellipse-outline'}
                            size={22}
                            color={isApproved ? '#059669' : colors.buttonPrimary}
                          />
                        </TouchableOpacity>
                        <View style={{ flex: 1, marginLeft: 8 }}>
                          <Text style={[styles.milestoneName, isApproved && styles.milestoneNameCompleted]}>
                            {m.title}
                          </Text>
                          {m.description ? (
                            <Text style={styles.milestoneDescText}>{m.description}</Text>
                          ) : null}
                          <Text style={styles.milestoneDateText}>Due: {m.dueDate}</Text>
                        </View>
                        <View style={styles.milestoneRightCol}>
                          <View
                            style={[
                              styles.milestoneStatusBadge,
                              {
                                backgroundColor: getStatusColor(
                                  m.status === 'approved'
                                    ? 'Completed'
                                    : m.status === 'client_review'
                                    ? 'Client Review'
                                    : 'Pending'
                                ).bg,
                              },
                            ]}
                          >
                            <Text
                              style={[
                                styles.milestoneBadgeText,
                                {
                                  color: getStatusColor(
                                    m.status === 'approved'
                                      ? 'Completed'
                                      : m.status === 'client_review'
                                      ? 'Client Review'
                                      : 'Pending'
                                  ).text,
                                },
                              ]}
                            >
                              {m.status}
                            </Text>
                          </View>
                          {isProvider && (
                            <TouchableOpacity
                              onPress={() => handleDeleteMilestone(m.id)}
                              style={{ padding: 4, marginTop: 4, alignSelf: 'flex-end' }}
                            >
                              <Feather name="trash-2" size={16} color={colors.textMuted} />
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>

                      {/* Review history if any */}
                      {m.reviewHistory && m.reviewHistory.length > 0 && (
                        <View style={styles.reviewHistoryBox}>
                          <Text style={styles.reviewHistoryTitle}>Review History:</Text>
                          {m.reviewHistory.map((rev, rIdx) => (
                            <Text key={rIdx} style={styles.reviewHistoryItem}>
                              • {rev.date} - {rev.action.toUpperCase()} by {rev.userName}: {rev.note || 'No note'}
                            </Text>
                          ))}
                        </View>
                      )}

                      {/* Milestone Actions */}
                      <View style={styles.milestoneActionsRow}>
                        {isProvider && m.status !== 'approved' && m.status !== 'client_review' && (
                          <TouchableOpacity
                            style={styles.milestoneActionBtn}
                            onPress={() =>
                              updateMilestone(project.id, m.id, { status: 'client_review' })
                            }
                          >
                            <Feather name="send" size={14} color={colors.buttonPrimary} />
                            <Text style={styles.milestoneActionBtnText}>Submit for Review</Text>
                          </TouchableOpacity>
                        )}
                        {(isClientRole || isProvider) && m.status === 'client_review' && (
                          <View style={{ flexDirection: 'row', gap: 8, flex: 1 }}>
                            <TouchableOpacity
                              style={[styles.milestoneActionBtn, { backgroundColor: '#DCFCE7' }]}
                              onPress={() =>
                                reviewMilestone(
                                  project.id,
                                  m.id,
                                  'approved',
                                  'Milestone accepted and approved'
                                )
                              }
                            >
                              <Ionicons name="checkmark" size={16} color="#15803D" />
                              <Text style={[styles.milestoneActionBtnText, { color: '#15803D' }]}>
                                Approve
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={[styles.milestoneActionBtn, { backgroundColor: '#FFEDD5' }]}
                              onPress={() =>
                                reviewMilestone(
                                  project.id,
                                  m.id,
                                  'changes_requested',
                                  'Changes requested on milestone'
                                )
                              }
                            >
                              <Ionicons name="alert-circle-outline" size={16} color="#C2410C" />
                              <Text style={[styles.milestoneActionBtnText, { color: '#C2410C' }]}>
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

              {showAddMilestone && (
                <View style={styles.inlineAddBox}>
                  <Text style={styles.fieldLabel}>Milestone Title</Text>
                  <TextInput
                    style={styles.inlineInput}
                    placeholder="e.g. Design System & UI Mockups"
                    value={newMilestoneTitle}
                    onChangeText={setNewMilestoneTitle}
                    autoFocus
                  />
                  <Text style={styles.fieldLabel}>Description (optional)</Text>
                  <TextInput
                    style={styles.inlineInput}
                    placeholder="Deliverables and criteria for this milestone..."
                    value={milestoneDesc}
                    onChangeText={setMilestoneDesc}
                  />
                  <View style={styles.inlineActions}>
                    <TouchableOpacity
                      style={styles.saveInlineBtn}
                      onPress={handleAddMilestone}
                    >
                      <Text style={styles.saveInlineBtnText}>Save Milestone</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.cancelInlineBtn}
                      onPress={() => setShowAddMilestone(false)}
                    >
                      <Text style={styles.cancelInlineBtnText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          )}

          {/* Tab 4: DELIVERABLES */}
          {activeTab === 'deliverables' && (
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>Deliverables & Assets</Text>
                {isProvider && (
                  <TouchableOpacity
                    onPress={() => {
                      closeModal();
                      openSubmitDeliverableModal(project.id);
                    }}
                    style={styles.addInlineBtn}
                  >
                    <Text style={styles.addInlineBtnText}>+ Submit deliverable</Text>
                  </TouchableOpacity>
                )}
              </View>

              {projectDeliverables.length === 0 ? (
                <View style={styles.emptyCardBox}>
                  <Ionicons name="folder-open-outline" size={32} color={colors.textMuted} />
                  <Text style={styles.emptyTitle}>No deliverables uploaded yet</Text>
                  <Text style={styles.emptySubtitle}>
                    {isProvider
                      ? 'Upload deliverables or design assets to request client sign-off.'
                      : 'Deliverables uploaded by your provider will appear here for review.'}
                  </Text>
                </View>
              ) : (
                projectDeliverables.map((del) => (
                  <View key={del.id} style={styles.deliverableFullCard}>
                    <View style={styles.delCardHeader}>
                      <View style={styles.delCardHeaderLeft}>
                        <View style={styles.versionBadge}>
                          <Text style={styles.versionBadgeText}>{del.version}</Text>
                        </View>
                        <Text style={styles.delCardTitle}>{del.deliverableName}</Text>
                      </View>
                      <View
                        style={[
                          styles.delStatusBadge,
                          del.status === 'approved'
                            ? styles.badgeApproved
                            : del.status === 'changes_requested'
                            ? styles.badgeChanges
                            : styles.badgeReview,
                        ]}
                      >
                        <Text
                          style={[
                            styles.delStatusBadgeText,
                            del.status === 'approved'
                              ? styles.textApproved
                              : del.status === 'changes_requested'
                              ? styles.textChanges
                              : styles.textReview,
                          ]}
                        >
                          {del.status === 'approved'
                            ? 'Approved'
                            : del.status === 'changes_requested'
                            ? 'Changes Requested'
                            : 'Awaiting Review'}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.delFileRow}>
                      <Feather name="file" size={14} color={colors.buttonPrimary} />
                      <Text style={styles.delFileName}>{del.fileName}</Text>
                      <Text style={styles.delMetaText}>• By {del.author} • {del.submittedText}</Text>
                    </View>

                    {/* File Sharing Status & Quick Action (HCI Page 8) */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F8FAFC', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, marginTop: 8 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#15803D' }} />
                        <Text style={{ fontSize: 11, fontFamily: typography.fonts.medium, color: '#15803D' }}>Shared with Client</Text>
                      </View>
                      <TouchableOpacity
                        style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#EDE9FE', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}
                        onPress={async () => {
                          const link = `https://freelancer-app-d9103.web.app/deliverables/${del.id}`;
                          try {
                            await Share.share({
                              title: del.deliverableName,
                              message: `ISAACIFY Deliverable: "${del.deliverableName}" (${del.version || 'v1'}). Access link:\n${link}`,
                              url: link,
                            });
                          } catch {
                            Alert.alert('Share Link Ready', link);
                          }
                        }}
                      >
                        <Feather name="link" size={12} color={colors.buttonPrimary} />
                        <Text style={{ fontSize: 11, fontFamily: typography.fonts.bold, color: colors.buttonPrimary }}>Copy Link</Text>
                      </TouchableOpacity>
                    </View>

                    {del.authorNote ? (
                      <Text style={styles.delAuthorNote}>Note: &ldquo;{del.authorNote}&rdquo;</Text>
                    ) : null}

                    {del.clientFeedback ? (
                      <View style={styles.feedbackBox}>
                        <Text style={styles.feedbackTitle}>Client Feedback:</Text>
                        <Text style={styles.feedbackText}>&ldquo;{del.clientFeedback}&rdquo;</Text>
                      </View>
                    ) : null}

                    {isClientRole && del.status === 'action_required' && (
                      <TouchableOpacity
                        style={styles.reviewFullBtn}
                        onPress={() => {
                          closeModal();
                          openReviewDeliverableModal(del.id);
                        }}
                      >
                        <Ionicons name="checkmark-done" size={16} color={colors.white} />
                        <Text style={styles.reviewFullBtnText}>Review & Sign-Off</Text>
                      </TouchableOpacity>
                    )}

                    {isProvider && del.status === 'changes_requested' && (
                      <TouchableOpacity
                        style={styles.submitRevisionBtn}
                        onPress={() => {
                          closeModal();
                          openSubmitDeliverableModal(project.id);
                        }}
                      >
                        <Ionicons name="cloud-upload-outline" size={16} color={colors.buttonPrimary} />
                        <Text style={styles.submitRevisionBtnText}>Upload Revised Version</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))
              )}
            </View>
          )}

          {/* Tab: COMMENTS */}
          {activeTab === 'comments' && (
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>Comments ({projectComments.length})</Text>
              </View>

              {projectComments.length === 0 ? (
                <View style={styles.emptyCardBox}>
                  <Ionicons name="chatbubbles-outline" size={32} color={colors.textMuted} />
                  <Text style={styles.emptyTitle}>No comments yet</Text>
                  <Text style={styles.emptySubtitle}>
                    Leave project notes, updates, or instructions for collaborators.
                  </Text>
                </View>
              ) : (
                projectComments.map((comment) => {
                  const isAuthor = comment.authorId === currentUser?.id;
                  const canDelete =
                    isAuthor ||
                    role === 'freelancer' ||
                    currentUser?.teamRole === 'owner' ||
                    currentUser?.teamRole === 'admin';

                  return (
                    <View key={comment.id} style={styles.commentItemCard}>
                      <View style={styles.commentHeaderRow}>
                        <View style={styles.commentAuthorRow}>
                          <View style={styles.commentAvatar}>
                            <Text style={styles.commentAvatarText}>
                              {comment.authorName.slice(0, 2).toUpperCase()}
                            </Text>
                          </View>
                          <View>
                            <Text style={styles.commentAuthorName}>{comment.authorName}</Text>
                            <Text style={styles.commentTimestamp}>
                              {comment.createdAt} • {comment.authorRole}
                            </Text>
                          </View>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <View
                            style={[
                              styles.visibilityBadge,
                              comment.visibility === 'internal'
                                ? styles.visibilityInternal
                                : styles.visibilityShared,
                            ]}
                          >
                            <Text
                              style={[
                                styles.visibilityBadgeText,
                                comment.visibility === 'internal'
                                  ? styles.textInternal
                                  : styles.textShared,
                              ]}
                            >
                              {comment.visibility === 'internal' ? 'Internal' : 'Shared with Client'}
                            </Text>
                          </View>
                          {canDelete && (
                            <TouchableOpacity
                              onPress={() => deleteComment(comment.id)}
                              style={{ padding: 4 }}
                            >
                              <Feather name="trash-2" size={14} color={colors.textMuted} />
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>
                      <Text style={styles.commentBodyText}>{comment.text}</Text>
                    </View>
                  );
                })
              )}

              {/* Add Comment Box */}
              <View style={styles.addCommentBox}>
                <TextInput
                  style={styles.commentInput}
                  placeholder="Write a comment or project note..."
                  value={commentText}
                  onChangeText={setCommentText}
                  multiline
                />
                <View style={styles.commentBottomRow}>
                  {isProvider ? (
                    <View style={styles.visibilityToggleRow}>
                      <TouchableOpacity
                        style={[
                          styles.visibilityPill,
                          commentVisibility === 'internal' && styles.visibilityPillActive,
                        ]}
                        onPress={() => setCommentVisibility('internal')}
                      >
                        <Text
                          style={[
                            styles.visibilityPillText,
                            commentVisibility === 'internal' && styles.visibilityPillTextActive,
                          ]}
                        >
                          🔒 Internal
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.visibilityPill,
                          commentVisibility === 'shared' && styles.visibilityPillActive,
                        ]}
                        onPress={() => setCommentVisibility('shared')}
                      >
                        <Text
                          style={[
                            styles.visibilityPillText,
                            commentVisibility === 'shared' && styles.visibilityPillTextActive,
                          ]}
                        >
                          🌐 Shared with Client
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View />
                  )}
                  <TouchableOpacity
                    style={styles.postCommentBtn}
                    onPress={handlePostComment}
                  >
                    <Feather name="send" size={14} color={colors.white} />
                    <Text style={styles.postCommentBtnText}>Post</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {/* Tab 5: INVOICES */}
          {activeTab === 'invoices' && (
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>Invoices ({projectInvoices.length})</Text>
                {canManageFinances && (
                  <TouchableOpacity
                    onPress={() => {
                      closeModal();
                      openCreateInvoiceModal();
                    }}
                    style={styles.addInlineBtn}
                  >
                    <Text style={styles.addInlineBtnText}>+ Create invoice</Text>
                  </TouchableOpacity>
                )}
              </View>

              {projectInvoices.length === 0 ? (
                <View style={styles.emptyCardBox}>
                  <Ionicons name="receipt-outline" size={32} color={colors.textMuted} />
                  <Text style={styles.emptyTitle}>No invoices for this project</Text>
                  <Text style={styles.emptySubtitle}>
                    {canManageFinances
                      ? 'Create an invoice to bill for milestones or project completion.'
                      : 'Invoices issued by your provider will appear here.'}
                  </Text>
                </View>
              ) : (
                projectInvoices.map((inv) => (
                  <View key={inv.id} style={styles.invoiceItemCard}>
                    <View style={styles.invoiceItemHeader}>
                      <View>
                        <Text style={styles.invoiceItemNum}>{inv.invoiceNumber}</Text>
                        <Text style={styles.invoiceItemDue}>Due: {inv.dueDate}</Text>
                      </View>
                      <View style={styles.invoiceItemRight}>
                        <Text style={styles.invoiceItemAmount}>
                          LKR {inv.totalAmount.toLocaleString()}
                        </Text>
                        <View
                          style={[
                            styles.invoiceBadge,
                            inv.status === 'Paid'
                              ? styles.badgePaid
                              : inv.status === 'Partially Paid'
                              ? styles.badgePendingVerif
                              : styles.badgeSent,
                          ]}
                        >
                          <Text
                            style={[
                              styles.invoiceBadgeText,
                              inv.status === 'Paid'
                                ? styles.textPaid
                                : inv.status === 'Partially Paid'
                                ? styles.textPendingVerif
                                : styles.textSent,
                            ]}
                          >
                            {inv.status}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {isClientRole && inv.status !== 'Paid' && (
                      <TouchableOpacity
                        style={styles.payInvoiceBtn}
                        onPress={() => {
                          closeModal();
                          openSubmitPaymentModal(inv.id);
                        }}
                      >
                        <Ionicons name="card-outline" size={16} color={colors.white} />
                        <Text style={styles.payInvoiceBtnText}>Submit Payment Proof</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))
              )}
            </View>
          )}

          {/* Quick Invoice Action at bottom for Providers */}
          {canManageFinances && (
            <TouchableOpacity
              style={styles.quickInvoiceBtn}
              onPress={() => {
                closeModal();
                openCreateInvoiceModal();
              }}
            >
              <Feather name="file-text" size={18} color={colors.buttonPrimary} />
              <Text style={styles.quickInvoiceBtnText}>
                Create Invoice for this project
              </Text>
              <Feather name="arrow-right" size={16} color={colors.buttonPrimary} />
            </TouchableOpacity>
          )}

          {/* Project Agreements & Scope Shortcuts */}
          <View style={styles.projectWorkflowCard}>
            <Text style={styles.workflowSectionTitle}>Project Governance & Agreements</Text>
            <View style={styles.workflowButtonsRow}>
              <TouchableOpacity
                style={styles.workflowCardBtn}
                onPress={() => {
                  closeModal();
                  router.push('/tasks');
                }}
              >
                <Feather name="check-square" size={15} color={colors.buttonPrimary} />
                <Text style={styles.workflowCardBtnText}>Tasks Page</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.workflowCardBtn}
                onPress={() => {
                  closeModal();
                  router.push('/scope');
                }}
              >
                <Feather name="target" size={15} color={colors.buttonPrimary} />
                <Text style={styles.workflowCardBtnText}>Scope Page</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.workflowCardBtn}
                onPress={() => {
                  closeModal();
                  router.push('/contract-terms');
                }}
              >
                <Feather name="file-text" size={15} color={colors.buttonPrimary} />
                <Text style={styles.workflowCardBtnText}>Terms</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.workflowCardBtn}
                onPress={() => {
                  closeModal();
                  router.push('/contract-preview');
                }}
              >
                <Feather name="eye" size={15} color={colors.buttonPrimary} />
                <Text style={styles.workflowCardBtnText}>Contract</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.workflowCardBtn}
                onPress={() => {
                  closeModal();
                  router.push('/contract-review');
                }}
              >
                <Feather name="edit-3" size={15} color={colors.buttonPrimary} />
                <Text style={styles.workflowCardBtnText}>Sign</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Project Actions & Danger Zone for Providers */}
          {isProvider && (
            <View style={styles.projectDangerCard}>
              <Text style={styles.dangerZoneTitle}>Project Danger Zone</Text>
              <Text style={styles.dangerZoneSubtitle}>
                Projects with issued invoices or verified payments cannot be deleted to preserve financial audit history. You can archive them instead.
              </Text>
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    paddingVertical: 10,
                    borderRadius: 10,
                    backgroundColor: '#F3EFFC',
                    borderWidth: 1,
                    borderColor: '#ECEAF5',
                  }}
                  onPress={handleOpenEditProject}
                >
                  <Feather name="edit-2" size={15} color={colors.buttonPrimary} />
                  <Text style={{ fontSize: 13, fontFamily: typography.fonts.semiBold, color: colors.buttonPrimary }}>
                    Edit Details
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.archiveProjectBtn}
                  onPress={handleArchiveProject}
                >
                  <Feather
                    name={project.isArchived ? 'rotate-ccw' : 'archive'}
                    size={16}
                    color={colors.textSecondary}
                  />
                  <Text style={styles.archiveProjectBtnText}>
                    {project.isArchived ? 'Restore' : 'Archive'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteProjectBtn}
                  onPress={handleDeleteProject}
                >
                  <Feather name="trash-2" size={16} color="#DC2626" />
                  <Text style={styles.deleteProjectBtnText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
      </View>

      {/* Edit Project Modal */}
      <Modal
        visible={isEditProjectModalVisible}
        animationType="slide"
        presentationStyle={Platform.OS === 'ios' ? 'pageSheet' : 'fullScreen'}
        onRequestClose={() => setIsEditProjectModalVisible(false)}
      >
        <View style={[styles.container, { paddingTop: Math.max(insets.top, 16) }]}>
          <ScreenBackdrop />
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setIsEditProjectModalVisible(false)}>
              <Feather name="arrow-left" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Edit Project</Text>
            <TouchableOpacity onPress={() => setIsEditProjectModalVisible(false)}>
              <Feather name="x" size={22} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: 20, paddingBottom: Math.max(insets.bottom, 24) + 40 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Cover Image */}
            <Text style={[styles.fieldLabel, { marginBottom: 8 }]}>Cover & Branding</Text>
            {editCoverImage ? (
              <View style={{ marginBottom: 16 }}>
                <Image
                  source={{ uri: editCoverImage }}
                  style={{ width: '100%', height: 140, borderRadius: 14, backgroundColor: '#F3F0FA' }}
                  resizeMode="cover"
                />
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
                  <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, backgroundColor: '#FAF8FD', borderWidth: 1, borderColor: '#ECEAF5' }}
                    onPress={handlePickEditCover}
                  >
                    <Feather name="refresh-cw" size={13} color={colors.buttonPrimary} />
                    <Text style={{ fontSize: 12, color: colors.buttonPrimary, fontFamily: typography.fonts.semiBold }}>Change</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FCA5A5' }}
                    onPress={() => setEditCoverImage(null)}
                  >
                    <Feather name="trash-2" size={13} color="#DC2626" />
                    <Text style={{ fontSize: 12, color: '#DC2626', fontFamily: typography.fonts.semiBold }}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                style={{
                  padding: 16,
                  borderRadius: 14,
                  borderWidth: 1.5,
                  borderColor: '#D8D4E8',
                  borderStyle: 'dashed',
                  alignItems: 'center',
                  marginBottom: 16,
                  backgroundColor: '#FAF8FD',
                }}
                onPress={handlePickEditCover}
              >
                <Feather name="image" size={24} color={colors.buttonPrimary} />
                <Text style={{ fontSize: 13, fontFamily: typography.fonts.semiBold, color: colors.textPrimary, marginTop: 6 }}>
                  Upload Project Cover
                </Text>
                <Text style={{ fontSize: 11, color: colors.textMuted }}>PNG, JPG up to 5MB</Text>
              </TouchableOpacity>
            )}

            {/* Title */}
            <Text style={[styles.fieldLabel, { marginBottom: 6 }]}>Project Title *</Text>
            <TextInput
              style={{ backgroundColor: colors.white, borderWidth: 1, borderColor: '#ECEAF5', borderRadius: 12, padding: 12, fontSize: 14, color: colors.textPrimary, marginBottom: 16 }}
              value={editTitle}
              onChangeText={setEditTitle}
              placeholder="e.g. Website Redesign"
            />

            {/* Budget */}
            <Text style={[styles.fieldLabel, { marginBottom: 6 }]}>Budget (LKR)</Text>
            <TextInput
              style={{ backgroundColor: colors.white, borderWidth: 1, borderColor: '#ECEAF5', borderRadius: 12, padding: 12, fontSize: 14, color: colors.textPrimary, marginBottom: 16 }}
              value={editBudget}
              onChangeText={setEditBudget}
              keyboardType="numeric"
              placeholder="150000"
            />

            {/* Deadline */}
            <Text style={[styles.fieldLabel, { marginBottom: 6 }]}>Deadline</Text>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: colors.white,
                borderWidth: 1,
                borderColor: '#ECEAF5',
                borderRadius: 12,
                padding: 14,
                marginBottom: 16,
              }}
              onPress={() => setShowEditDatePicker(true)}
              activeOpacity={0.7}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Feather name="calendar" size={16} color={colors.buttonPrimary} />
                <Text style={{ fontSize: 14, color: editDeadline ? colors.textPrimary : colors.textMuted }}>
                  {editDeadline || 'Select Deadline'}
                </Text>
              </View>
              <Feather name="chevron-down" size={16} color={colors.textMuted} />
            </TouchableOpacity>

            {/* Scope Notes */}
            <Text style={[styles.fieldLabel, { marginBottom: 6 }]}>Scope & Notes</Text>
            <TextInput
              style={{
                backgroundColor: colors.white,
                borderWidth: 1,
                borderColor: '#ECEAF5',
                borderRadius: 12,
                padding: 12,
                fontSize: 14,
                color: colors.textPrimary,
                minHeight: 90,
                textAlignVertical: 'top',
                marginBottom: 24,
              }}
              value={editScopeNotes}
              onChangeText={setEditScopeNotes}
              placeholder="Project deliverables, scope notes..."
              multiline
            />

            {/* Buttons */}
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity
                style={{ flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: '#F3F0FA', alignItems: 'center' }}
                onPress={() => setIsEditProjectModalVisible(false)}
              >
                <Text style={{ fontFamily: typography.fonts.semiBold, fontSize: 14, color: colors.textSecondary }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ flex: 1.5, paddingVertical: 14, borderRadius: 12, backgroundColor: colors.buttonPrimary, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 6 }}
                onPress={handleSaveProjectEdit}
              >
                <Feather name="check" size={18} color={colors.white} />
                <Text style={{ fontFamily: typography.fonts.bold, fontSize: 14, color: colors.white }}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          <DatePickerModal
            visible={showEditDatePicker}
            onClose={() => setShowEditDatePicker(false)}
            onSelectDate={(d) => setEditDeadline(d)}
            initialDate={editDeadline}
            title="Select Project Deadline"
          />
        </View>
      </Modal>
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
    color: colors.textPrimary,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 12
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
  titleCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EDE7F6',
    marginBottom: 16,
  },
  titleHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  iconSquare: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#EDE7F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeStatus: {
    backgroundColor: '#EDE7F6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeStatusText: {
    fontSize: 11,
    fontFamily: typography.fonts.bold,
    color: colors.buttonPrimary,
  },
  projectTitle: {
    fontSize: 19,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary,
    marginBottom: 6,
  },
  projectScope: {
    fontSize: 13,
    fontFamily: typography.fonts.regular,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 14,
  },
  clientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF8FE',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#EDE7F6',
  },
  clientAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.buttonPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  clientAvatarText: {
    color: colors.white,
    fontSize: 12,
    fontFamily: typography.fonts.bold,
  },
  clientInfo: {
    flex: 1,
  },
  clientLabel: {
    fontSize: 10,
    fontFamily: typography.fonts.medium,
    color: colors.textMuted,
  },
  clientName: {
    fontSize: 13,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary,
  },
  chatClientBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F3EFFC',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  chatClientBtnText: {
    fontSize: 11,
    fontFamily: typography.fonts.bold,
    color: colors.buttonPrimary,
  },
  progressCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EDE7F6',
    marginBottom: 16,
  },
  progressHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  progressPctRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  progressPctText: {
    fontSize: 26,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary,
  },
  progressPctLabel: {
    fontSize: 13,
    fontFamily: typography.fonts.medium,
    color: colors.textSecondary,
  },
  onTrackBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  onTrackText: {
    fontSize: 11,
    fontFamily: typography.fonts.bold,
    color: '#059669',
  },
  progressBarWrapper: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 14,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.buttonPrimary,
    borderRadius: 4,
  },
  progressMetricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metricText: {
    fontSize: 11,
    fontFamily: typography.fonts.medium,
    color: colors.textSecondary,
  },
  scopeNoticeCard: {
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
  },
  scopeNoticePending: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
  },
  scopeNoticeAccepted: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  scopeNoticeDeclined: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  scopeNoticeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  scopeNoticeHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  scopeNoticeTitle: {
    fontSize: 13,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary,
  },
  scopeNoticeDate: {
    fontSize: 11,
    fontFamily: typography.fonts.regular,
    color: colors.textMuted,
  },
  scopeNoticeBy: {
    fontSize: 11,
    fontFamily: typography.fonts.regular,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  boldText: {
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary,
  },
  scopeNoticeBody: {
    fontSize: 12,
    fontFamily: typography.fonts.medium,
    color: colors.textPrimary,
    lineHeight: 18,
  },
  scopeActionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  scopeAcceptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#059669',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  scopeAcceptBtnText: {
    color: colors.white,
    fontSize: 12,
    fontFamily: typography.fonts.bold,
  },
  scopeDeclineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  scopeDeclineBtnText: {
    color: colors.textPrimary,
    fontSize: 12,
    fontFamily: typography.fonts.medium,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  statBox: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EDE7F6',
  },
  statBoxLabel: {
    fontSize: 11,
    fontFamily: typography.fonts.medium,
    color: colors.textMuted,
    marginBottom: 4,
  },
  statBoxValue: {
    fontSize: 14,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  statBoxSub: {
    fontSize: 10,
    fontFamily: typography.fonts.regular,
    color: colors.textSecondary,
  },
  tabScroll: {
    marginBottom: 16,
  },
  tabScrollContent: {
    backgroundColor: '#EDE7F6',
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  subTabButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  subTabButtonActive: {
    backgroundColor: colors.white,
  },
  subTabButtonText: {
    fontSize: 12,
    fontFamily: typography.fonts.medium,
    color: colors.textSecondary,
  },
  subTabButtonTextActive: {
    fontFamily: typography.fonts.bold,
    color: colors.buttonPrimary,
  },
  sectionContainer: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EDE7F6',
    marginBottom: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary,
  },
  addInlineBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  addInlineBtnText: {
    fontSize: 12,
    fontFamily: typography.fonts.bold,
    color: colors.buttonPrimary,
  },
  deliverableItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  deliverableIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#EDE7F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  deliverableInfoCol: {
    flex: 1,
  },
  deliverableName: {
    fontSize: 13,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary,
  },
  deliverableFile: {
    fontSize: 11,
    fontFamily: typography.fonts.regular,
    color: colors.textSecondary,
    marginTop: 2,
  },
  reviewBtn: {
    backgroundColor: colors.buttonPrimary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  reviewBtnText: {
    color: colors.white,
    fontSize: 11,
    fontFamily: typography.fonts.bold,
  },
  delStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeApproved: {
    backgroundColor: '#ECFDF5',
  },
  badgeChanges: {
    backgroundColor: '#FEF2F2',
  },
  badgeReview: {
    backgroundColor: '#FFFBEB',
  },
  delStatusBadgeText: {
    fontSize: 10,
    fontFamily: typography.fonts.bold,
  },
  textApproved: {
    color: '#059669',
  },
  textChanges: {
    color: '#DC2626',
  },
  textReview: {
    color: '#D97706',
  },
  milestoneCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  milestoneStatusToggle: {
    marginRight: 10,
  },
  milestoneDetails: {
    flex: 1,
  },
  milestoneName: {
    fontSize: 13,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary,
  },
  milestoneNameCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  milestoneDateText: {
    fontSize: 10,
    fontFamily: typography.fonts.medium,
    color: colors.textMuted,
    marginTop: 2,
  },
  milestoneStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeCompleted: {
    backgroundColor: '#EDE7F6',
  },
  badgeUpcoming: {
    backgroundColor: '#F3F4F6',
  },
  milestoneBadgeText: {
    fontSize: 10,
    fontFamily: typography.fonts.bold,
  },
  badgeTextCompleted: {
    color: colors.buttonPrimary,
  },
  badgeTextUpcoming: {
    color: colors.textSecondary,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  taskTextWrapper: {
    marginLeft: 10,
    flex: 1,
  },
  taskTitle: {
    fontSize: 13,
    fontFamily: typography.fonts.medium,
    color: colors.textPrimary,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  taskTime: {
    fontSize: 10,
    fontFamily: typography.fonts.regular,
    color: colors.textMuted,
    marginTop: 2,
  },
  emptyText: {
    fontSize: 12,
    fontFamily: typography.fonts.regular,
    color: colors.textMuted,
    paddingVertical: 8,
  },
  emptyCardBox: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyTitle: {
    fontSize: 14,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary,
    marginTop: 10,
  },
  emptySubtitle: {
    fontSize: 12,
    fontFamily: typography.fonts.regular,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 16,
    lineHeight: 18,
  },
  inlineAddBox: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 10,
    marginTop: 6,
  },
  inlineInput: {
    fontSize: 13,
    fontFamily: typography.fonts.medium,
    color: colors.textPrimary,
    backgroundColor: '#FAF8FE',
    borderWidth: 1,
    borderColor: '#EDE7F6',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 8,
  },
  inlineActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  saveInlineBtn: {
    backgroundColor: colors.buttonPrimary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  saveInlineBtnText: {
    color: colors.white,
    fontSize: 11,
    fontFamily: typography.fonts.bold,
  },
  cancelInlineBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  cancelInlineBtnText: {
    color: colors.textSecondary,
    fontSize: 11,
  },
  scopeFullText: {
    fontSize: 13,
    fontFamily: typography.fonts.regular,
    color: colors.textPrimary,
    lineHeight: 20,
    marginTop: 6,
    marginBottom: 16,
  },
  scopeClientActionBox: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 14,
  },
  requestScopeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F3EFFC',
    borderRadius: 10,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#DDD6FE',
  },
  requestScopeBtnText: {
    fontSize: 13,
    fontFamily: typography.fonts.bold,
    color: colors.buttonPrimary,
  },
  scopeInputWrapper: {
    backgroundColor: '#FAF8FE',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EDE7F6',
  },
  scopeInputTitle: {
    fontSize: 13,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  scopeInputSub: {
    fontSize: 11,
    fontFamily: typography.fonts.regular,
    color: colors.textSecondary,
    marginBottom: 10,
  },
  scopeTextInput: {
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 10,
    fontSize: 12,
    color: colors.textPrimary,
    marginBottom: 10,
    minHeight: 80,
  },
  deliverableFullCard: {
    backgroundColor: '#FAF8FE',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EDE7F6',
    marginBottom: 12,
  },
  delCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  delCardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  versionBadge: {
    backgroundColor: '#EDE7F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  versionBadgeText: {
    fontSize: 11,
    fontFamily: typography.fonts.bold,
    color: colors.buttonPrimary,
  },
  delCardTitle: {
    fontSize: 13,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary,
    flex: 1,
  },
  delFileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  delFileName: {
    fontSize: 12,
    fontFamily: typography.fonts.medium,
    color: colors.buttonPrimary,
  },
  delMetaText: {
    fontSize: 11,
    fontFamily: typography.fonts.regular,
    color: colors.textMuted,
  },
  delAuthorNote: {
    fontSize: 12,
    fontFamily: typography.fonts.regular,
    color: colors.textSecondary,
    marginBottom: 6,
    fontStyle: 'italic',
  },
  feedbackBox: {
    backgroundColor: '#FFFBEB',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  feedbackTitle: {
    fontSize: 11,
    fontFamily: typography.fonts.bold,
    color: '#D97706',
    marginBottom: 2,
  },
  feedbackText: {
    fontSize: 12,
    fontFamily: typography.fonts.medium,
    color: colors.textPrimary,
  },
  reviewFullBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.buttonPrimary,
    borderRadius: 8,
    paddingVertical: 8,
    marginTop: 4,
  },
  reviewFullBtnText: {
    color: colors.white,
    fontSize: 12,
    fontFamily: typography.fonts.bold,
  },
  submitRevisionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F3EFFC',
    borderWidth: 1,
    borderColor: '#DDD6FE',
    borderRadius: 8,
    paddingVertical: 8,
    marginTop: 4,
  },
  submitRevisionBtnText: {
    color: colors.buttonPrimary,
    fontSize: 12,
    fontFamily: typography.fonts.bold,
  },
  invoiceItemCard: {
    backgroundColor: '#FAF8FE',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EDE7F6',
    marginBottom: 10,
  },
  invoiceItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  invoiceItemNum: {
    fontSize: 13,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary,
  },
  invoiceItemDue: {
    fontSize: 11,
    fontFamily: typography.fonts.regular,
    color: colors.textMuted,
    marginTop: 2,
  },
  invoiceItemRight: {
    alignItems: 'flex-end',
  },
  invoiceItemAmount: {
    fontSize: 14,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  invoiceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgePaid: {
    backgroundColor: '#ECFDF5',
  },
  badgePendingVerif: {
    backgroundColor: '#EFF6FF',
  },
  badgeSent: {
    backgroundColor: '#FFFBEB',
  },
  invoiceBadgeText: {
    fontSize: 10,
    fontFamily: typography.fonts.bold,
  },
  textPaid: {
    color: '#059669',
  },
  textPendingVerif: {
    color: '#2563EB',
  },
  textSent: {
    color: '#D97706',
  },
  payInvoiceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.buttonPrimary,
    borderRadius: 8,
    paddingVertical: 8,
    marginTop: 10,
  },
  payInvoiceBtnText: {
    color: colors.white,
    fontSize: 12,
    fontFamily: typography.fonts.bold,
  },
  quickInvoiceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F3EFFC',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#DDD6FE',
  },
  quickInvoiceBtnText: {
    fontSize: 13,
    fontFamily: typography.fonts.bold,
    color: colors.buttonPrimary,
    flex: 1,
    marginLeft: 10,
  },
  statusPickerBox: {
    backgroundColor: '#F8F7FC',
    borderRadius: 12,
    padding: 10,
    marginTop: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ECEAF5',
  },
  fieldLabel: {
    fontFamily: typography.fonts.bold,
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
    marginTop: 6,
  },
  statusPickerBoxLabel: {
    fontFamily: typography.fonts.semiBold,
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  statusPickerPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#E2DFEC',
    marginRight: 6,
  },
  statusPickerPillSelected: {
    backgroundColor: colors.buttonPrimary,
    borderColor: colors.buttonPrimary,
  },
  statusPickerPillText: {
    fontFamily: typography.fonts.medium,
    fontSize: 12,
    color: colors.textPrimary,
  },
  statusPickerPillTextSelected: {
    color: colors.white,
    fontFamily: typography.fonts.bold,
  },
  miniPriorityPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
  },
  miniPriorityPillSelected: {
    backgroundColor: colors.buttonPrimary,
  },
  miniPriorityText: {
    fontSize: 11,
    fontFamily: typography.fonts.medium,
    color: colors.textSecondary,
  },
  miniPriorityTextSelected: {
    color: colors.white,
    fontFamily: typography.fonts.bold,
  },
  milestoneFullCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ECEAF5',
  },
  milestoneFullHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  milestoneDescText: {
    fontFamily: typography.fonts.regular,
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  milestoneRightCol: {
    alignItems: 'flex-end',
  },
  reviewHistoryBox: {
    backgroundColor: '#F9F8FD',
    borderRadius: 8,
    padding: 8,
    marginTop: 10,
  },
  reviewHistoryTitle: {
    fontFamily: typography.fonts.semiBold,
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  reviewHistoryItem: {
    fontFamily: typography.fonts.regular,
    fontSize: 11,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  milestoneActionsRow: {
    marginTop: 10,
    flexDirection: 'row',
    gap: 8,
  },
  milestoneActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#EDE9FE',
  },
  milestoneActionBtnText: {
    fontFamily: typography.fonts.semiBold,
    fontSize: 12,
    color: colors.buttonPrimary,
  },
  commentItemCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ECEAF5',
  },
  commentHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  commentAuthorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  commentAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.buttonPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  commentAvatarText: {
    color: colors.white,
    fontFamily: typography.fonts.bold,
    fontSize: 10,
  },
  commentAuthorName: {
    fontFamily: typography.fonts.semiBold,
    fontSize: 12,
    color: colors.textPrimary,
  },
  commentTimestamp: {
    fontFamily: typography.fonts.regular,
    fontSize: 10,
    color: colors.textSecondary,
  },
  visibilityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  visibilityInternal: {
    backgroundColor: '#FEF3C7',
  },
  visibilityShared: {
    backgroundColor: '#DBEAFE',
  },
  visibilityBadgeText: {
    fontSize: 10,
    fontFamily: typography.fonts.semiBold,
  },
  textInternal: {
    color: '#B45309',
  },
  textShared: {
    color: '#1D4ED8',
  },
  commentBodyText: {
    fontFamily: typography.fonts.regular,
    fontSize: 13,
    color: colors.textPrimary,
    lineHeight: 18,
  },
  addCommentBox: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ECEAF5',
    marginTop: 8,
  },
  commentInput: {
    minHeight: 60,
    fontFamily: typography.fonts.regular,
    fontSize: 13,
    color: colors.textPrimary,
    textAlignVertical: 'top',
  },
  commentBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F0FA',
    paddingTop: 8,
  },
  visibilityToggleRow: {
    flexDirection: 'row',
    gap: 6,
  },
  visibilityPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
  },
  visibilityPillActive: {
    backgroundColor: '#EDE9FE',
  },
  visibilityPillText: {
    fontSize: 11,
    fontFamily: typography.fonts.medium,
    color: colors.textSecondary,
  },
  visibilityPillTextActive: {
    color: colors.buttonPrimary,
    fontFamily: typography.fonts.bold,
  },
  postCommentBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.buttonPrimary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  postCommentBtnText: {
    color: colors.white,
    fontFamily: typography.fonts.bold,
    fontSize: 12,
  },
  projectDangerCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    marginTop: 14,
  },
  dangerZoneTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: 13,
    color: '#991B1B',
  },
  dangerZoneSubtitle: {
    fontFamily: typography.fonts.regular,
    fontSize: 11,
    color: '#7F1D1D',
    marginTop: 2,
    lineHeight: 16,
  },
  archiveProjectBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  archiveProjectBtnText: {
    fontFamily: typography.fonts.semiBold,
    fontSize: 12,
    color: colors.textSecondary,
  },
  deleteProjectBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  deleteProjectBtnText: {
    fontFamily: typography.fonts.semiBold,
    fontSize: 12,
    color: '#DC2626',
  },
  projectWorkflowCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EEE8F6',
    marginBottom: 16,
  },
  workflowSectionTitle: {
    fontSize: 14,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary,
  },
  workflowButtonsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  workflowCardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F7F5FC',
    borderWidth: 1,
    borderColor: '#E8E1F5',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  workflowCardBtnText: {
    fontSize: 12,
    fontFamily: typography.fonts.bold,
    color: colors.buttonPrimary,
  },
});
