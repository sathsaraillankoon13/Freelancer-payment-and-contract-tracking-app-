import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
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
    toggleTask,
    financialSummary,
    metrics,
    activeMeeting,
  } = useAppContext();

  const activeProject = projects[0];

  const handleNewProject = () => {
    Alert.alert(
      'New Project',
      'Create Project flow will be launched in the next step.',
      [{ text: 'OK' }]
    );
  };

  const handleAddClient = () => {
    Alert.alert(
      'Add Client',
      'Client Contact onboarding will be opened.',
      [{ text: 'OK' }]
    );
  };

  const handleInvoiceAction = () => {
    if (onNavigateToFinance) {
      onNavigateToFinance();
    } else {
      Alert.alert('Invoice', 'Navigate to Invoices and Finance management.');
    }
  };

  const handleReviewFeedback = () => {
    if (onNavigateToMessages) {
      onNavigateToMessages();
    } else {
      Alert.alert(
        'Homepage Feedback',
        'Senuri Perera left notes on the homepage deliverable.'
      );
    }
  };

  const handleJoinCall = () => {
    Alert.alert(
      'Join Meeting',
      `Launching Google Meet for ${activeMeeting.title}...`,
      [{ text: 'Close' }]
    );
  };

  const handleAddTaskPrompt = () => {
    Alert.alert(
      'Add Task',
      'Quick task creation dialog.',
      [{ text: 'Cancel', style: 'cancel' }, { text: 'Add' }]
    );
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
        <Text style={styles.greetingSubtitle}>Here's your work overview.</Text>

        <View style={styles.pillsRow}>
          <View style={[styles.pillBadge, styles.pillPurple]}>
            <View style={[styles.pillDot, { backgroundColor: colors.buttonPrimary }]} />
            <Text style={styles.pillPurpleText}>
              {metrics.activeProjectsCount} active projects
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
              September 2026 • Cashflow status
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
      <TouchableOpacity
        style={styles.notificationBanner}
        activeOpacity={0.8}
        onPress={handleReviewFeedback}
      >
        <View style={styles.notificationIconBox}>
          <Feather name="message-square" size={18} color={colors.buttonPrimary} />
        </View>
        <View style={styles.notificationTextBox}>
          <Text style={styles.notificationTitle}>Homepage feedback</Text>
          <Text style={styles.notificationSubtitle}>Senuri Perera • CeylonBites</Text>
        </View>
        <View style={styles.reviewFeedbackRow}>
          <Text style={styles.reviewFeedbackText}>Review feedback</Text>
          <Feather name="chevron-right" size={14} color={colors.buttonPrimary} />
        </View>
      </TouchableOpacity>

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

      {/* Active Project Section */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Active project</Text>
        <TouchableOpacity onPress={onNavigateToProjects}>
          <Text style={styles.sectionLink}>View all</Text>
        </TouchableOpacity>
      </View>

      {activeProject && (
        <View style={styles.projectCard}>
          <View style={styles.projectTopRow}>
            <View style={styles.projectAvatarBox}>
              <Text style={styles.projectAvatarText}>
                {activeProject.clientInitials}
              </Text>
            </View>

            <View style={styles.projectTitleBox}>
              <Text style={styles.projectName} numberOfLines={1}>
                {activeProject.title}
              </Text>
              <View style={styles.clientRow}>
                <View style={styles.smallAvatar}>
                  <Text style={styles.smallAvatarText}>SP</Text>
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
        </View>
      )}

      {/* Upcoming Meeting Section */}
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

      {/* Today's Tasks Section */}
      <View style={styles.sectionHeaderRow}>
        <View style={styles.tasksTitleWithBadge}>
          <Text style={styles.sectionTitle}>Today's tasks</Text>
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
        {tasks.map((task) => (
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
        ))}
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
});

export default FreelancerHomeView;
