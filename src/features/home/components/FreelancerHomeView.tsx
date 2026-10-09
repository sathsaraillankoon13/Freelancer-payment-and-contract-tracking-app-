import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAppContext } from '@/context/AppContext';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';

interface FreelancerHomeViewProps {
  onNavigateToProjects?: () => void;
  onNavigateToFinance?: () => void;
  onNavigateToMessages?: () => void;
}

export const FreelancerHomeView: React.FC<FreelancerHomeViewProps> = ({
  onNavigateToProjects,
  onNavigateToFinance,
  onNavigateToMessages,
}) => {
  const {
    currentUser,
    projects,
    tasks,
    deliverables,
    meetings,
    toggleTask,
    addTask,
    financialSummary,
    metrics,
    activeMeeting,
    openCreateProjectModal,
    openAddClientModal,
    openProjectDetailsModal,
    openCreateInvoiceModal,
    openReviewDeliverableModal,
  } = useAppContext();

  const activeProject = projects[0];
  const pendingFeedbackDeliverable = deliverables.find(
    (d) => d.status === 'action_required' || !!d.clientFeedback
  );

  const handleNewProject = () => {
    openCreateProjectModal();
  };

  const handleAddClient = () => {
    openAddClientModal();
  };

  const handleInvoiceAction = () => {
    openCreateInvoiceModal();
  };

  const handleReviewFeedback = () => {
    if (pendingFeedbackDeliverable) {
      openReviewDeliverableModal(pendingFeedbackDeliverable.id);
    } else {
      openReviewDeliverableModal();
    }
  };

  const handleJoinCall = () => {
    if (!activeMeeting) return;
    Alert.alert(
      'Join Meeting',
      `Launching Google Meet for ${activeMeeting.title}...`,
      [{ text: 'Close' }]
    );
  };

  const handleAddTaskPrompt = () => {
    if (Alert.prompt) {
      Alert.prompt('New Task', 'Enter task title:', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Add',
          onPress: (text?: string) => {
            if (text && text.trim()) {
              addTask(text.trim(), activeProject?.title, 'Today');
            }
          },
        },
      ]);
    } else {
      addTask('Project deliverable review task', activeProject?.title, 'Today');
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Greeting Section */}
      <View style={styles.greetingSection}>
        <Text style={styles.greetingTitle}>Hello {currentUser.firstName}!</Text>
        <Text style={styles.greetingSubtitle}>Here&apos;s your work overview.</Text>

        <View style={styles.pillsRow}>
          <View style={[styles.pillBadge, styles.pillPurple]}>
            <View style={[styles.pillDot, { backgroundColor: colors.buttonPrimary }]} />
            <Text style={styles.pillPurpleText}>
              {metrics.activeProjectsCount} active {metrics.activeProjectsCount === 1 ? 'project' : 'projects'}
            </Text>
          </View>

          <View style={[styles.pillBadge, styles.pillPeach]}>
            <View style={[styles.pillDot, { backgroundColor: colors.pillPeachText }]} />
            <Text style={styles.pillPeachText}>
              {metrics.upcomingDeadlinesCount} upcoming deadlines
            </Text>
          </View>
        </View>
      </View>

      {/* Cashflow Card */}
      <View style={styles.cardContainer}>
        <View style={styles.cashflowHeaderRow}>
          <View style={styles.cashflowDateRow}>
            <Feather name="calendar" size={14} color={colors.buttonPrimary} />
            <Text style={styles.cashflowDateText}>
              Financial Overview • Cashflow status
            </Text>
          </View>
          <Text style={styles.cashflowStatusText}>
            {financialSummary.cashflowStatus}
          </Text>
        </View>

        <View style={styles.cashflowMetricsRow}>
          {/* Received Column */}
          <View style={styles.cashflowColumn}>
            <View style={styles.metricLabelRow}>
              <Text style={styles.metricLabel}>Received</Text>
              <Feather name="trending-up" size={14} color={colors.buttonPrimary} />
            </View>
            <Text style={styles.metricAmountPrimary}>
              LKR {financialSummary.received.toLocaleString()}
            </Text>
            <View style={styles.receivedUnderline} />
          </View>

          {/* Outstanding Column */}
          <View style={styles.cashflowColumn}>
            <View style={styles.metricLabelRow}>
              <Text style={styles.metricLabel}>Outstanding</Text>
              <Feather name="clock" size={14} color={colors.buttonPrimary} />
            </View>
            <Text style={styles.metricAmountPurple}>
              LKR {financialSummary.outstanding.toLocaleString()}
            </Text>
            <View style={styles.outstandingUnderline} />
          </View>
        </View>
      </View>

      {/* Action / Notification Banner */}
      {pendingFeedbackDeliverable && (
        <TouchableOpacity
          style={styles.notificationBanner}
          activeOpacity={0.8}
          onPress={handleReviewFeedback}
        >
          <View style={styles.notificationIconBox}>
            <Feather name="message-square" size={18} color={colors.buttonPrimary} />
          </View>
          <View style={styles.notificationTextBox}>
            <Text style={styles.notificationTitle}>{pendingFeedbackDeliverable.deliverableName}</Text>
            <Text style={styles.notificationSubtitle}>
              {pendingFeedbackDeliverable.clientFeedback
                ? 'Client feedback received'
                : pendingFeedbackDeliverable.projectTitle}
            </Text>
          </View>
          <View style={styles.reviewFeedbackRow}>
            <Text style={styles.reviewFeedbackText}>Review feedback</Text>
            <Feather name="chevron-right" size={14} color={colors.buttonPrimary} />
          </View>
        </TouchableOpacity>
      )}

      {/* Quick Action Buttons Row */}
      <View style={styles.quickActionsRow}>
        <TouchableOpacity
          style={styles.primaryActionButton}
          activeOpacity={0.85}
          onPress={handleNewProject}
        >
          <Feather name="plus" size={16} color={colors.white} style={styles.buttonIcon} />
          <Text style={styles.primaryActionText}>New project</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryActionButton}
          activeOpacity={0.85}
          onPress={handleAddClient}
        >
          <Feather name="user-plus" size={15} color={colors.buttonPrimary} style={styles.buttonIcon} />
          <Text style={styles.secondaryActionText}>Add client</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryActionButton}
          activeOpacity={0.85}
          onPress={handleInvoiceAction}
        >
          <Feather name="file-text" size={15} color={colors.buttonPrimary} style={styles.buttonIcon} />
          <Text style={styles.secondaryActionText}>Invoice</Text>
        </TouchableOpacity>
      </View>

      {/* Direct Module Navigation Bar */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.workflowRow}
      >
        <TouchableOpacity
          style={styles.workflowPill}
          onPress={() => router.push('/tasks')}
        >
          <Feather name="check-square" size={14} color={colors.buttonPrimary} />
          <Text style={styles.workflowPillText}>Tasks</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.workflowPill}
          onPress={() => router.push('/scope')}
        >
          <Feather name="target" size={14} color={colors.buttonPrimary} />
          <Text style={styles.workflowPillText}>Scope</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.workflowPill}
          onPress={() => router.push('/contract-terms')}
        >
          <Feather name="file-text" size={14} color={colors.buttonPrimary} />
          <Text style={styles.workflowPillText}>Terms</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.workflowPill}
          onPress={() => router.push('/contract-preview')}
        >
          <Feather name="eye" size={14} color={colors.buttonPrimary} />
          <Text style={styles.workflowPillText}>Contract</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.workflowPill}
          onPress={() => router.push('/contract-review')}
        >
          <Feather name="edit-3" size={14} color={colors.buttonPrimary} />
          <Text style={styles.workflowPillText}>Review & Sign</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.workflowPill}
          onPress={() => router.push('/onboarding')}
        >
          <Feather name="compass" size={14} color={colors.buttonPrimary} />
          <Text style={styles.workflowPillText}>Onboarding</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Active Project Section */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Active project</Text>
        {projects.length > 0 && (
          <TouchableOpacity onPress={onNavigateToProjects}>
            <Text style={styles.sectionLink}>View all</Text>
          </TouchableOpacity>
        )}
      </View>

      {activeProject ? (
        <TouchableOpacity
          style={styles.projectCard}
          activeOpacity={0.85}
          onPress={() => openProjectDetailsModal(activeProject.id)}
        >
          <View style={styles.projectTopRow}>
            <View style={styles.projectAvatarBox}>
              <Text style={styles.projectAvatarText}>
                {activeProject.clientInitials || 'PR'}
              </Text>
            </View>

            <View style={styles.projectTitleBox}>
              <Text style={styles.projectName} numberOfLines={1}>
                {activeProject.title}
              </Text>
              <View style={styles.clientRow}>
                <View style={styles.smallAvatar}>
                  <Text style={styles.smallAvatarText}>{activeProject.clientInitials || 'CL'}</Text>
                </View>
                <Text style={styles.clientName}>{activeProject.clientName}</Text>
              </View>
            </View>

            <Text style={styles.projectStatusBadge}>
              {activeProject.status}
            </Text>
          </View>

          <View style={styles.progressSection}>
            <View style={styles.progressHeaderRow}>
              <Text style={styles.progressLabel}>Progress</Text>
              <Text style={styles.progressValue}>
                {activeProject.progressPercentage}% ({activeProject.completedTasks} of {activeProject.totalTasks} tasks)
              </Text>
            </View>
            <View style={styles.progressBarTrack}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${activeProject.progressPercentage}%` },
                ]}
              />
            </View>
          </View>

          <View style={styles.projectFooterRow}>
            <View style={styles.dueDateRow}>
              <Feather name="calendar" size={13} color={colors.buttonPrimary} />
              <Text style={styles.dueDateText}>Due: {activeProject.dueDate}</Text>
            </View>
            <Text style={styles.daysLeftText}>{activeProject.daysLeftText}</Text>
          </View>
        </TouchableOpacity>
      ) : (
        <View style={[styles.projectCard, { alignItems: 'center', justifyContent: 'center', paddingVertical: 24 }]}>
          <Feather name="folder-plus" size={32} color={colors.buttonPrimary} style={{ marginBottom: 8 }} />
          <Text style={[styles.projectName, { textAlign: 'center', marginBottom: 4 }]}>No active projects yet</Text>
          <Text style={[styles.clientName, { textAlign: 'center', marginBottom: 14 }]}>Create your first project to get started</Text>
          <TouchableOpacity
            style={[styles.primaryActionButton, { paddingHorizontal: 16 }]}
            onPress={handleNewProject}
          >
            <Feather name="plus" size={14} color={colors.white} style={{ marginRight: 6 }} />
            <Text style={styles.primaryActionText}>Create Project</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Upcoming Meeting Section */}
      {meetings.length > 0 && activeMeeting && (
        <>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Upcoming meeting</Text>
          </View>

          <View style={styles.meetingCard}>
            <View style={styles.meetingIconBox}>
              <Feather name="calendar" size={20} color={colors.buttonPrimary} />
            </View>

            <View style={styles.meetingInfoBox}>
              <Text style={styles.meetingTitle}>{activeMeeting.title}</Text>
              <Text style={styles.meetingTimeText}>{activeMeeting.timeText}</Text>
            </View>

            <TouchableOpacity
              style={styles.joinCallButton}
              activeOpacity={0.8}
              onPress={handleJoinCall}
            >
              <Text style={styles.joinCallText}>Join call</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* Today's Tasks Section */}
      <View style={styles.sectionHeaderRow}>
        <View style={styles.tasksTitleWithBadge}>
          <Text style={styles.sectionTitle}>Today&apos;s tasks</Text>
          <View style={styles.pendingBadge}>
            <Text style={styles.pendingBadgeText}>
              {metrics.pendingTasksCount} pending
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={handleAddTaskPrompt}>
          <Text style={styles.sectionLink}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tasksContainer}>
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TouchableOpacity
              key={task.id}
              style={styles.taskRow}
              activeOpacity={0.7}
              onPress={() => toggleTask(task.id)}
            >
              <View
                style={[
                  styles.taskCheckbox,
                  task.completed && styles.taskCheckboxCompleted,
                ]}
              >
                {task.completed && (
                  <Feather name="check" size={14} color={colors.white} />
                )}
              </View>

              <View style={styles.taskTextBox}>
                <Text
                  style={[
                    styles.taskTitle,
                    task.completed && styles.taskTitleCompleted,
                  ]}
                >
                  {task.title}
                </Text>
                <Text style={styles.taskMeta}>
                  {task.projectTitle} • {task.scheduledTime}
                </Text>
              </View>

              <MaterialCommunityIcons
                name="drag-vertical"
                size={20}
                color="#D1D5DB"
              />
            </TouchableOpacity>
          ))
        ) : (
          <View style={[styles.taskRow, { justifyContent: 'center', paddingVertical: 18 }]}>
            <Text style={{ fontFamily: typography.fonts.regular, fontSize: 13, color: colors.textSecondary }}>
              No tasks scheduled. Tap + Add to add a task.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: 8,
    paddingBottom: 28,
  },
  greetingSection: {
    marginBottom: 20,
  },
  greetingTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: 26,
    color: colors.textPrimary,
    lineHeight: 32,
    marginBottom: 4,
  },
  greetingSubtitle: {
    fontFamily: typography.fonts.regular,
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: 14,
  },
  pillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pillPurple: {
    backgroundColor: colors.pillPurpleBg,
  },
  pillPeach: {
    backgroundColor: colors.pillPeachBg,
  },
  pillDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  pillPurpleText: {
    fontFamily: typography.fonts.medium,
    fontSize: 13,
    color: colors.pillPurpleText,
  },
  pillPeachText: {
    fontFamily: typography.fonts.medium,
    fontSize: 13,
    color: colors.pillPeachText,
  },
  cardContainer: {
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#EFEFF5',
    padding: 18,
    marginBottom: 14,
  },
  cashflowHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cashflowDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cashflowDateText: {
    fontFamily: typography.fonts.regular,
    fontSize: 13,
    color: colors.textSecondary,
  },
  cashflowStatusText: {
    fontFamily: typography.fonts.bold,
    fontSize: 13,
    color: colors.buttonPrimary,
  },
  cashflowMetricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cashflowColumn: {
    flex: 1,
  },
  metricLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  metricLabel: {
    fontFamily: typography.fonts.regular,
    fontSize: 13,
    color: colors.textSecondary,
  },
  metricAmountPrimary: {
    fontFamily: typography.fonts.bold,
    fontSize: 20,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  metricAmountPurple: {
    fontFamily: typography.fonts.bold,
    fontSize: 20,
    color: colors.buttonPrimary,
    marginBottom: 8,
  },
  receivedUnderline: {
    width: 60,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.buttonPrimary,
  },
  outstandingUnderline: {
    width: 90,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.buttonPrimary,
  },
  notificationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EFEFF5',
    padding: 14,
    marginBottom: 16,
  },
  notificationIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: colors.pillPurpleBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notificationTextBox: {
    flex: 1,
  },
  notificationTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: 14,
    color: colors.textPrimary,
  },
  notificationSubtitle: {
    fontFamily: typography.fonts.regular,
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  reviewFeedbackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  reviewFeedbackText: {
    fontFamily: typography.fonts.medium,
    fontSize: 13,
    color: colors.buttonPrimary,
  },
  quickActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 24,
  },
  primaryActionButton: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.buttonPrimary,
    height: 46,
    borderRadius: 14,
    shadowColor: colors.buttonPrimary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  primaryActionText: {
    fontFamily: typography.fonts.bold,
    fontSize: 14,
    color: colors.white,
  },
  secondaryActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    height: 46,
    borderRadius: 14,
  },
  secondaryActionText: {
    fontFamily: typography.fonts.bold,
    fontSize: 13,
    color: colors.buttonPrimary,
  },
  buttonIcon: {
    marginRight: 6,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 4,
  },
  sectionTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: 18,
    color: colors.textPrimary,
  },
  sectionLink: {
    fontFamily: typography.fonts.medium,
    fontSize: 13,
    color: colors.buttonPrimary,
  },
  projectCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#EFEFF5',
    padding: 16,
    marginBottom: 20,
  },
  projectTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  projectAvatarBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FDEFD6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  projectAvatarText: {
    fontFamily: typography.fonts.bold,
    fontSize: 16,
    color: '#D97706',
  },
  projectTitleBox: {
    flex: 1,
  },
  projectName: {
    fontFamily: typography.fonts.bold,
    fontSize: 15,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  clientRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallAvatar: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#EDE7FB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  smallAvatarText: {
    fontSize: 9,
    fontFamily: typography.fonts.bold,
    color: colors.buttonPrimary,
  },
  clientName: {
    fontFamily: typography.fonts.regular,
    fontSize: 12,
    color: colors.textSecondary,
  },
  projectStatusBadge: {
    fontFamily: typography.fonts.bold,
    fontSize: 12,
    color: colors.buttonPrimary,
  },
  progressSection: {
    marginBottom: 14,
  },
  progressHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontFamily: typography.fonts.regular,
    fontSize: 13,
    color: colors.textSecondary,
  },
  progressValue: {
    fontFamily: typography.fonts.bold,
    fontSize: 13,
    color: colors.textPrimary,
  },
  progressBarTrack: {
    height: 7,
    backgroundColor: '#EAE9F2',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.buttonPrimary,
    borderRadius: 4,
  },
  projectFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F5F5FA',
  },
  dueDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dueDateText: {
    fontFamily: typography.fonts.regular,
    fontSize: 12,
    color: colors.textSecondary,
  },
  daysLeftText: {
    fontFamily: typography.fonts.medium,
    fontSize: 12,
    color: colors.buttonPrimary,
  },
  meetingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#EFEFF5',
    padding: 16,
    marginBottom: 20,
  },
  meetingIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.pillPurpleBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  meetingInfoBox: {
    flex: 1,
  },
  meetingTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: 15,
    color: colors.textPrimary,
    marginBottom: 3,
  },
  meetingTimeText: {
    fontFamily: typography.fonts.regular,
    fontSize: 12,
    color: colors.textSecondary,
  },
  joinCallButton: {
    backgroundColor: colors.buttonPrimary,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
  },
  joinCallText: {
    fontFamily: typography.fonts.bold,
    fontSize: 13,
    color: colors.white,
  },
  tasksTitleWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pendingBadge: {
    backgroundColor: colors.pillPurpleBg,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  pendingBadgeText: {
    fontFamily: typography.fonts.bold,
    fontSize: 11,
    color: colors.buttonPrimary,
  },
  tasksContainer: {
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#EFEFF5',
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5FA',
  },
  taskCheckbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#F3E8FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  taskCheckboxCompleted: {
    backgroundColor: colors.statusGreen,
  },
  taskTextBox: {
    flex: 1,
  },
  taskTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  taskMeta: {
    fontFamily: typography.fonts.regular,
    fontSize: 12,
    color: colors.textSecondary,
  },
  workflowRow: {
    gap: 8,
    paddingVertical: 12,
  },
  workflowPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#EEE8F6',
    borderRadius: 20,
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

export default FreelancerHomeView;
