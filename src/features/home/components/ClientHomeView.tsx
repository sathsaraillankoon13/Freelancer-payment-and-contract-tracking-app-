import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Feather, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useAppContext } from '@/context/AppContext';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';

interface ClientHomeViewProps {
  onNavigateToProjects?: () => void;
  onNavigateToFinance?: () => void;
  onNavigateToMessages?: () => void;
}

export const ClientHomeView: React.FC<ClientHomeViewProps> = ({
  onNavigateToProjects,
  onNavigateToFinance,
  onNavigateToMessages,
}) => {
  const {
    currentUser,
    projects,
    financialSummary,
    activeMeeting,
    deliverable,
    recentActivity,
  } = useAppContext();

  const activeProject = projects[0];

  const handleReviewDeliverable = () => {
    Alert.alert(
      'Review Deliverable',
      'Opening Homepage Design v2 review workspace with feedback annotations.',
      [{ text: 'OK' }]
    );
  };

  const handleMessageAgency = () => {
    if (onNavigateToMessages) {
      onNavigateToMessages();
    } else {
      Alert.alert('Message Lead', 'Opening direct conversation with Kasun.');
    }
  };

  const handleViewMeeting = () => {
    Alert.alert(
      'Meeting Details',
      `Google Meet link for ${activeMeeting.title}\nTime: ${activeMeeting.timeText}\nParticipants: ${activeMeeting.participants}`,
      [{ text: 'Join Google Meet' }, { text: 'Cancel', style: 'cancel' }]
    );
  };

  const handleViewInvoice = () => {
    if (onNavigateToFinance) {
      onNavigateToFinance();
    } else {
      Alert.alert(
        'Invoice INV-2026-014',
        `Outstanding: LKR ${financialSummary.outstanding.toLocaleString()}\nTotal: LKR ${financialSummary.total.toLocaleString()}\nPaid: LKR ${financialSummary.received.toLocaleString()}\nDue Date: 30 Sep 2026`
      );
    }
  };

  const handleDownloadFile = (fileName: string) => {
    Alert.alert('Download', `Downloading ${fileName}...`, [{ text: 'OK' }]);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Greeting */}
      <View style={styles.greetingHeader}>
        <View style={styles.greetingLeft}>
          <Text style={styles.greetingTitle}>Hello {currentUser.firstName} 👋</Text>
          <Text style={styles.greetingSubtitle}>Here's the latest on your projects.</Text>
        </View>
        <View style={styles.clientPortalBadge}>
          <View style={styles.portalDot} />
          <Text style={styles.clientPortalText}>Client Portal</Text>
        </View>
      </View>

      {/* Agency Provider Card */}
      <View style={styles.agencyCard}>
        <View style={styles.agencyIconBox}>
          <Feather name="box" size={22} color={colors.buttonPrimary} />
        </View>

        <View style={styles.agencyInfo}>
          <View style={styles.agencyTitleRow}>
            <Text style={styles.agencyName}>ISAACIFY Creative</Text>
            <MaterialIcons name="verified" size={16} color={colors.buttonPrimary} />
          </View>
          <Text style={styles.agencyLead}>Design Agency • Lead: Kasun</Text>
        </View>

        <TouchableOpacity
          style={styles.messageAgencyButton}
          activeOpacity={0.7}
          onPress={handleMessageAgency}
        >
          <Feather name="message-square" size={18} color={colors.buttonPrimary} />
        </TouchableOpacity>
      </View>

      {/* Summary Metrics Row */}
      <View style={styles.metricsRow}>
        <View style={styles.metricCard}>
          <View style={styles.metricIconCircle}>
            <Feather name="layers" size={18} color={colors.buttonPrimary} />
          </View>
          <View style={styles.metricTextWrapper}>
            <Text style={styles.metricNumber}>1</Text>
            <Text style={styles.metricLabel}>Active project</Text>
          </View>
        </View>

        <View style={styles.metricCard}>
          <View style={[styles.metricIconCircle, { position: 'relative' }]}>
            <Feather name="file-text" size={18} color={colors.buttonPrimary} />
            <View style={styles.metricRedDot} />
          </View>
          <View style={styles.metricTextWrapper}>
            <Text style={styles.metricNumber}>1</Text>
            <Text style={styles.metricLabel}>Awaiting review</Text>
          </View>
        </View>
      </View>

      {/* Action Required Banner */}
      <View style={styles.actionBanner}>
        <View style={styles.actionBannerTopRow}>
          <View style={styles.actionRequiredBadge}>
            <View style={styles.actionRedDot} />
            <Text style={styles.actionRequiredText}>ACTION REQUIRED</Text>
          </View>
          <Text style={styles.actionTimestampText}>{deliverable.submittedText}</Text>
        </View>

        <Text style={styles.actionTitle}>Your homepage is ready to review</Text>
        <Text style={styles.actionSubtitle}>
          {deliverable.projectTitle} • {deliverable.deliverableName}
        </Text>

        {/* Attachment Card */}
        <View style={styles.attachmentCard}>
          <View style={styles.attachmentThumbnail}>
            <Feather name="image" size={18} color={colors.buttonPrimary} />
          </View>
          <View style={styles.attachmentInfo}>
            <Text style={styles.attachmentFileName} numberOfLines={1}>
              {deliverable.fileName}
            </Text>
            <Text style={styles.attachmentAuthorNote} numberOfLines={1}>
              {deliverable.author}: “{deliverable.authorNote}”
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.reviewButton}
          activeOpacity={0.85}
          onPress={handleReviewDeliverable}
        >
          <Text style={styles.reviewButtonText}>Review deliverable</Text>
          <Feather name="arrow-right" size={16} color={colors.white} style={styles.buttonArrow} />
        </TouchableOpacity>
      </View>

      {/* Active Project Card */}
      {activeProject && (
        <View style={styles.activeProjectCard}>
          <View style={styles.projectHeaderRow}>
            <Text style={styles.projectTagLabel}>ACTIVE PROJECT</Text>
            <View style={styles.milestoneBadge}>
              <Text style={styles.milestoneBadgeText}>
                Milestone {activeProject.milestoneRatio}
              </Text>
            </View>
          </View>

          <Text style={styles.projectTitleText}>{activeProject.title}</Text>

          <View style={styles.progressRow}>
            <Text style={styles.projectProgressLabel}>Project Progress</Text>
            <Text style={styles.projectProgressPercent}>
              {activeProject.progressPercentage}% ({activeProject.completedTasks} of {activeProject.totalTasks} tasks)
            </Text>
          </View>

          <View style={styles.projectProgressBarTrack}>
            <View
              style={[
                styles.projectProgressBarFill,
                { width: `${activeProject.progressPercentage}%` },
              ]}
            />
          </View>

          {/* Sub Date Box */}
          <View style={styles.projectMetaSubCard}>
            <View style={styles.projectMetaItem}>
              <Feather name="calendar" size={14} color={colors.buttonPrimary} />
              <View style={styles.projectMetaTexts}>
                <Text style={styles.metaSubLabel}>Deadline</Text>
                <Text style={styles.metaSubValue}>{activeProject.dueDate}</Text>
              </View>
            </View>

            <View style={styles.metaDivider} />

            <View style={styles.projectMetaItem}>
              <Feather name="clock" size={14} color={colors.buttonPrimary} />
              <View style={styles.projectMetaTexts}>
                <Text style={styles.metaSubLabel}>Remaining</Text>
                <Text style={styles.metaSubValue}>14 days left</Text>
              </View>
            </View>
          </View>

          <View style={styles.currentFocusRow}>
            <View style={styles.currentFocusLeft}>
              <View style={styles.focusDot} />
              <Text style={styles.focusText}>
                Current: {activeProject.currentFocus}
              </Text>
            </View>
            <TouchableOpacity onPress={onNavigateToProjects}>
              <Text style={styles.viewProjectLink}>View project &gt;</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Meeting Card */}
      <View style={styles.meetingCard}>
        <View style={styles.meetingTopRow}>
          <View style={styles.meetingCameraBox}>
            <Feather name="video" size={20} color={colors.white} />
          </View>

          <View style={styles.meetingInfoBox}>
            <Text style={styles.meetingName}>CeylonBites Review Call</Text>
            <Text style={styles.meetingTime}>Today, 2:30 PM • 30 min</Text>
          </View>

          <View style={styles.googleMeetBadge}>
            <Text style={styles.googleMeetText}>Google Meet</Text>
          </View>
        </View>

        <View style={styles.meetingFooterRow}>
          <View style={styles.participantsRow}>
            <View style={[styles.avatarCircle, { backgroundColor: '#E9D5FF' }]}>
              <Text style={styles.avatarCircleText}>KF</Text>
            </View>
            <View style={[styles.avatarCircle, { backgroundColor: '#FED7AA', marginLeft: -8 }]}>
              <Text style={styles.avatarCircleText}>SP</Text>
            </View>
            <Text style={styles.participantsNamesText}>Kasun &amp; Senuri</Text>
          </View>

          <TouchableOpacity
            style={styles.viewMeetingButton}
            activeOpacity={0.8}
            onPress={handleViewMeeting}
          >
            <Text style={styles.viewMeetingText}>View meeting</Text>
            <Feather name="external-link" size={13} color={colors.buttonPrimary} style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Invoice & Balance Card */}
      <View style={styles.invoiceCard}>
        <View style={styles.invoiceHeaderRow}>
          <View style={styles.invoiceTitleRow}>
            <Feather name="file-text" size={16} color={colors.textPrimary} />
            <Text style={styles.invoiceTitle}>Invoice &amp; Balance</Text>
          </View>
          <Text style={styles.invoiceNumber}>INV-2026-014</Text>
        </View>

        {/* Inner grey surface */}
        <View style={styles.invoiceInnerSurface}>
          <View style={styles.balanceAmountsRow}>
            <Text style={styles.outstandingLabel}>Outstanding Balance</Text>
            <Text style={styles.outstandingValue}>
              LKR {financialSummary.outstanding.toLocaleString()}
            </Text>
          </View>

          <View style={styles.totalAndPaidRow}>
            <Text style={styles.totalVolumeText}>
              Total: LKR {financialSummary.total.toLocaleString()}
            </Text>
            <Text style={styles.paidVolumeText}>
              ✓ LKR {financialSummary.received.toLocaleString()} Paid
            </Text>
          </View>

          <View style={styles.invoiceProgressTrack}>
            <View
              style={[
                styles.invoiceProgressFill,
                { width: '40%' },
              ]}
            />
          </View>
        </View>

        <View style={styles.invoiceFooterRow}>
          <Text style={styles.invoiceDueDate}>Due date: 30 Sep 2026</Text>
          <TouchableOpacity
            style={styles.viewInvoiceButton}
            activeOpacity={0.8}
            onPress={handleViewInvoice}
          >
            <Feather name="file-text" size={13} color={colors.buttonPrimary} style={{ marginRight: 5 }} />
            <Text style={styles.viewInvoiceText}>View invoice</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.activityHeaderRow}>
        <Text style={styles.activityTitle}>Recent Activity</Text>
        <Text style={styles.autoUpdatedText}>Auto-updated</Text>
      </View>

      {recentActivity.map((item) => (
        <View key={item.id} style={styles.activityCard}>
          <View style={styles.pdfIconBox}>
            <Feather name="file" size={18} color={colors.buttonPrimary} />
          </View>
          <View style={styles.activityInfo}>
            <Text style={styles.activityAuthorText}>
              Kasun shared{' '}
              <Text style={{ color: colors.buttonPrimary }}>{item.fileName}</Text>
            </Text>
            <Text style={styles.activityMetaText}>
              {item.fileSize} • {item.timeAgo}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.downloadCircle}
            activeOpacity={0.7}
            onPress={() => handleDownloadFile(item.fileName)}
          >
            <Feather name="download" size={16} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
      ))}
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
  greetingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  greetingLeft: {
    flex: 1,
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
    fontSize: 14,
    color: colors.textSecondary,
  },
  clientPortalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.pillPurpleBg,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 4,
  },
  portalDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.buttonPrimary,
    marginRight: 6,
  },
  clientPortalText: {
    fontFamily: typography.fonts.medium,
    fontSize: 12,
    color: colors.buttonPrimary,
  },
  agencyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#EFEFF5',
    padding: 14,
    marginBottom: 14,
  },
  agencyIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.pillPurpleBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  agencyInfo: {
    flex: 1,
  },
  agencyTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  agencyName: {
    fontFamily: typography.fonts.bold,
    fontSize: 15,
    color: colors.textPrimary,
  },
  agencyLead: {
    fontFamily: typography.fonts.regular,
    fontSize: 12,
    color: colors.textSecondary,
  },
  messageAgencyButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: colors.pillPurpleBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EFEFF5',
    padding: 14,
  },
  metricIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.pillPurpleBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  metricRedDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  metricTextWrapper: {
    flex: 1,
  },
  metricNumber: {
    fontFamily: typography.fonts.bold,
    fontSize: 18,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  metricLabel: {
    fontFamily: typography.fonts.regular,
    fontSize: 11,
    color: colors.textSecondary,
  },
  actionBanner: {
    backgroundColor: '#F3EEFB',
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
  },
  actionBannerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionRequiredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  actionRedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#DC2626',
    marginRight: 6,
  },
  actionRequiredText: {
    fontFamily: typography.fonts.bold,
    fontSize: 11,
    color: '#DC2626',
    letterSpacing: 0.3,
  },
  actionTimestampText: {
    fontFamily: typography.fonts.regular,
    fontSize: 12,
    color: colors.textSecondary,
  },
  actionTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: 4,
    lineHeight: 24,
  },
  actionSubtitle: {
    fontFamily: typography.fonts.medium,
    fontSize: 13,
    color: colors.buttonPrimary,
    marginBottom: 14,
  },
  attachmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
  },
  attachmentThumbnail: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.pillPurpleBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  attachmentInfo: {
    flex: 1,
  },
  attachmentFileName: {
    fontFamily: typography.fonts.bold,
    fontSize: 13,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  attachmentAuthorNote: {
    fontFamily: typography.fonts.regular,
    fontSize: 11,
    color: colors.textSecondary,
  },
  reviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.buttonPrimary,
    height: 48,
    borderRadius: 14,
  },
  reviewButtonText: {
    fontFamily: typography.fonts.bold,
    fontSize: 15,
    color: colors.white,
  },
  buttonArrow: {
    marginLeft: 8,
  },
  activeProjectCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#EFEFF5',
    padding: 16,
    marginBottom: 20,
  },
  projectHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  projectTagLabel: {
    fontFamily: typography.fonts.bold,
    fontSize: 11,
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  milestoneBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  milestoneBadgeText: {
    fontFamily: typography.fonts.medium,
    fontSize: 12,
    color: colors.textSecondary,
  },
  projectTitleText: {
    fontFamily: typography.fonts.bold,
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: 14,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  projectProgressLabel: {
    fontFamily: typography.fonts.regular,
    fontSize: 13,
    color: colors.textSecondary,
  },
  projectProgressPercent: {
    fontFamily: typography.fonts.bold,
    fontSize: 13,
    color: colors.buttonPrimary,
  },
  projectProgressBarTrack: {
    height: 7,
    backgroundColor: '#EAE9F2',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 14,
  },
  projectProgressBarFill: {
    height: '100%',
    backgroundColor: colors.buttonPrimary,
    borderRadius: 4,
  },
  projectMetaSubCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },
  projectMetaItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  projectMetaTexts: {
    flex: 1,
  },
  metaSubLabel: {
    fontFamily: typography.fonts.regular,
    fontSize: 11,
    color: colors.textSecondary,
  },
  metaSubValue: {
    fontFamily: typography.fonts.bold,
    fontSize: 13,
    color: colors.textPrimary,
    marginTop: 1,
  },
  metaDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 12,
  },
  currentFocusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  currentFocusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  focusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.buttonPrimary,
  },
  focusText: {
    fontFamily: typography.fonts.regular,
    fontSize: 13,
    color: colors.textSecondary,
  },
  viewProjectLink: {
    fontFamily: typography.fonts.medium,
    fontSize: 13,
    color: colors.buttonPrimary,
  },
  meetingCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#EFEFF5',
    padding: 16,
    marginBottom: 20,
  },
  meetingTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  meetingCameraBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.buttonPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  meetingInfoBox: {
    flex: 1,
  },
  meetingName: {
    fontFamily: typography.fonts.bold,
    fontSize: 15,
    color: colors.textPrimary,
    marginBottom: 3,
  },
  meetingTime: {
    fontFamily: typography.fonts.regular,
    fontSize: 12,
    color: colors.textSecondary,
  },
  googleMeetBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  googleMeetText: {
    fontFamily: typography.fonts.medium,
    fontSize: 11,
    color: colors.textSecondary,
  },
  meetingFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F5F5FA',
  },
  participantsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.white,
  },
  avatarCircleText: {
    fontFamily: typography.fonts.bold,
    fontSize: 9,
    color: colors.textPrimary,
  },
  participantsNamesText: {
    fontFamily: typography.fonts.regular,
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  viewMeetingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.pillPurpleBg,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  viewMeetingText: {
    fontFamily: typography.fonts.bold,
    fontSize: 12,
    color: colors.buttonPrimary,
  },
  invoiceCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#EFEFF5',
    padding: 16,
    marginBottom: 20,
  },
  invoiceHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  invoiceTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  invoiceTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: 16,
    color: colors.textPrimary,
  },
  invoiceNumber: {
    fontFamily: typography.fonts.regular,
    fontSize: 13,
    color: colors.textSecondary,
  },
  invoiceInnerSurface: {
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
  },
  balanceAmountsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 6,
  },
  outstandingLabel: {
    fontFamily: typography.fonts.regular,
    fontSize: 13,
    color: colors.textSecondary,
  },
  outstandingValue: {
    fontFamily: typography.fonts.bold,
    fontSize: 18,
    color: colors.textPrimary,
  },
  totalAndPaidRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  totalVolumeText: {
    fontFamily: typography.fonts.regular,
    fontSize: 12,
    color: colors.textSecondary,
  },
  paidVolumeText: {
    fontFamily: typography.fonts.medium,
    fontSize: 12,
    color: colors.buttonPrimary,
  },
  invoiceProgressTrack: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  invoiceProgressFill: {
    height: '100%',
    backgroundColor: colors.buttonPrimary,
    borderRadius: 3,
  },
  invoiceFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  invoiceDueDate: {
    fontFamily: typography.fonts.regular,
    fontSize: 13,
    color: colors.textSecondary,
  },
  viewInvoiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.pillPurpleBg,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  viewInvoiceText: {
    fontFamily: typography.fonts.bold,
    fontSize: 12,
    color: colors.buttonPrimary,
  },
  activityHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  activityTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: 17,
    color: colors.textPrimary,
  },
  autoUpdatedText: {
    fontFamily: typography.fonts.regular,
    fontSize: 12,
    color: colors.textSecondary,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EFEFF5',
    padding: 14,
    marginBottom: 10,
  },
  pdfIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.pillPurpleBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityAuthorText: {
    fontFamily: typography.fonts.bold,
    fontSize: 13,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  activityMetaText: {
    fontFamily: typography.fonts.regular,
    fontSize: 12,
    color: colors.textSecondary,
  },
  downloadCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ClientHomeView;
