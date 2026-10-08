import { ScreenBackdrop } from '@/components/ui/Surface';
import { openAttachment } from '@/services/attachments';
import { MotionTouchable as TouchableOpacity, MotionModal as Modal } from '@/components/ui/Motion';
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
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppContext } from '@/context/AppContext';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';

export const ReviewDeliverableModal: React.FC = () => {
  const insets = useSafeAreaInsets();
  const {
    activeModal,
    closeModal,
    selectedDeliverableId,
    deliverables,
    reviewDeliverable,
    currentUser,
    canReviewDeliverables,
  } = useAppContext();

  const isVisible = activeModal === 'review_deliverable';
  const deliverable = deliverables.find((d) => d.id === selectedDeliverableId) || deliverables[0];

  const [feedbackText, setFeedbackText] = useState('');
  const [showFeedbackInput, setShowFeedbackInput] = useState(false);

  if (!deliverable) return null;

  const handleShareDeliverableLink = async () => {
    const link = `https://freelancer-app-d9103.web.app/deliverables/${deliverable.id}`;
    try {
      await Share.share({
        title: deliverable.deliverableName,
        message: `ISAACIFY Deliverable: "${deliverable.deliverableName}" (${deliverable.version || 'v1'}). Review and sign-off at:\n${link}`,
        url: link,
      });
    } catch {
      Alert.alert('Share Link Ready', `Deliverable Access Link:\n${link}`);
    }
  };

  const handleApprove = () => {
    reviewDeliverable(deliverable.id, 'approved', 'Looks great! Approved for final deployment.');
    Alert.alert('Deliverable Approved', 'You have approved this deliverable. Your provider has been notified.', [
      { text: 'OK', onPress: closeModal },
    ]);
  };

  const handleRequestChanges = () => {
    if (!showFeedbackInput) {
      setShowFeedbackInput(true);
      return;
    }

    if (!feedbackText.trim()) {
      Alert.alert('Feedback Required', 'Please explain what revisions are needed.');
      return;
    }

    reviewDeliverable(deliverable.id, 'changes_requested', feedbackText.trim());
    setShowFeedbackInput(false);
    setFeedbackText('');
    Alert.alert('Changes Requested', 'Your revision feedback has been sent to your service provider.', [
      { text: 'OK', onPress: closeModal },
    ]);
  };

  const isAwaitingReview = deliverable.status === 'action_required';

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle={Platform.OS === 'ios' ? 'pageSheet' : 'fullScreen'}
      onRequestClose={closeModal}
    >
      <View style={[styles.container, { paddingTop: Math.max(insets.top, 16) }]}>
        <ScreenBackdrop />
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={closeModal} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Reviews</Text>
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
          {/* Client Review Portal Banner */}
          <View style={styles.portalBanner}>
            <View style={styles.portalLeft}>
              <View style={styles.portalAvatar}>
                <Text style={styles.portalAvatarText}>
                  {currentUser?.name?.slice(0, 2).toUpperCase() || 'CR'}
                </Text>
              </View>
              <View>
                <Text style={styles.portalLabel}>CLIENT REVIEW PORTAL</Text>
                <Text style={styles.portalClientName}>{currentUser?.name || 'Client'}</Text>
              </View>
            </View>
            <View style={styles.liveSessionBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveSessionText}>Live Session</Text>
            </View>
          </View>

          {/* Main Info Card */}
          <View style={styles.card}>
            <View style={styles.cardTopRow}>
              <View style={styles.projectTag}>
                <Feather name="folder" size={14} color={colors.buttonPrimary} />
                <Text style={styles.projectTagText}>{deliverable.projectTitle}</Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  deliverable.status === 'approved'
                    ? styles.statusApproved
                    : deliverable.status === 'changes_requested'
                    ? styles.statusChanges
                    : styles.statusAwaiting,
                ]}
              >
                <Text
                  style={[
                    styles.statusBadgeText,
                    deliverable.status === 'approved'
                      ? styles.statusApprovedText
                      : deliverable.status === 'changes_requested'
                      ? styles.statusChangesText
                      : styles.statusAwaitingText,
                  ]}
                >
                  {deliverable.status === 'approved'
                    ? '✓ Approved'
                    : deliverable.status === 'changes_requested'
                    ? 'Changes requested'
                    : '⏳ Awaiting review'}
                </Text>
              </View>
            </View>

            <Text style={styles.deliverableTitle}>{deliverable.deliverableName}</Text>

            <View style={styles.milestonePill}>
              <Feather name="flag" size={13} color={colors.buttonPrimary} />
              <Text style={styles.milestonePillText}>Milestone: {deliverable.deliverableName}</Text>
            </View>

            <View style={styles.authorBox}>
              <View style={styles.authorRow}>
                <Feather name="send" size={13} color={colors.textSecondary} />
                <Text style={styles.authorRowText}>
                  Submitted by <Text style={styles.boldText}>{deliverable.author}</Text>
                </Text>
              </View>
              <View style={[styles.authorRow, { marginTop: 6 }]}>
                <Feather name="calendar" size={13} color={colors.textSecondary} />
                <Text style={styles.authorRowText}>{deliverable.submittedText}</Text>
              </View>
              {deliverable.authorNote ? (
                <View style={styles.authorNoteBox}>
                  <Text style={styles.authorNoteLabel}>Note from author:</Text>
                  <Text style={styles.authorNoteContent}>&ldquo;{deliverable.authorNote}&rdquo;</Text>
                </View>
              ) : null}
            </View>
          </View>

          {/* File Sharing Section (HCI Page 8: Simple file list with clear sharing status) */}
          <View style={styles.card}>
            <View style={styles.fileCardHeader}>
              <View style={styles.fileTitleRow}>
                <Feather name="share-2" size={16} color={colors.buttonPrimary} />
                <Text style={styles.fileSectionTitle}>Shared Files & Access</Text>
              </View>
              <View style={styles.sharingStatusBadge}>
                <View style={styles.sharingStatusDot} />
                <Text style={styles.sharingStatusText}>Shared with Client</Text>
              </View>
            </View>

            <View style={styles.fileListCard}>
              <View style={styles.fileListLeft}>
                <View style={styles.fileListIconBox}>
                  <MaterialCommunityIcons name="file-document-outline" size={28} color={colors.buttonPrimary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.fileListName} numberOfLines={1}>
                    {deliverable.fileName}
                  </Text>
                  <Text style={styles.fileListMeta}>
                    {deliverable.fileSize || '3.2 MB'} • {(deliverable.version || 'v1').toUpperCase()} • Active Link
                  </Text>
                </View>
              </View>

              <View style={styles.fileQuickActionsRow}>
                <TouchableOpacity
                  style={styles.fileQuickActionBtn}
                  onPress={() => {
                    void openAttachment(deliverable.attachment).catch((error) =>
                      Alert.alert('File unavailable', error.message)
                    );
                  }}
                >
                  <Feather name="eye" size={13} color={colors.textPrimary} />
                  <Text style={styles.fileQuickActionText}>Open File</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.fileQuickActionBtn, { backgroundColor: colors.primarySoft }]}
                  onPress={handleShareDeliverableLink}
                >
                  <Feather name="link" size={13} color={colors.buttonPrimary} />
                  <Text style={[styles.fileQuickActionText, { color: colors.buttonPrimary }]}>
                    Copy Share Link
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Submission Timeline */}
          <View style={styles.card}>
            <View style={styles.timelineHeader}>
              <Text style={styles.timelineTitle}>Submission Timeline</Text>
              <Text style={styles.timelineCount}>
                {(deliverable.history?.length || 0) + 1} Events
              </Text>
            </View>

            <View style={styles.timelineItem}>
              <View style={styles.timelineBulletActive} />
              <View style={styles.timelineContent}>
                <View style={styles.timelineContentRow}>
                  <Text style={styles.timelineItemTitle}>Version {deliverable.version} submitted</Text>
                  <Text style={styles.timelineItemDate}>Today</Text>
                </View>
                <Text style={styles.timelineItemSub}>By {deliverable.author}</Text>
              </View>
            </View>

            {(deliverable.history || []).map((h, i) => (
              <View key={i} style={styles.timelineItem}>
                <View style={styles.timelineBulletPast} />
                <View style={styles.timelineContent}>
                  <View style={styles.timelineContentRow}>
                    <Text style={styles.timelineItemTitle}>
                      {h.status === 'approved' ? 'Approved' : 'Changes requested'} ({h.version})
                    </Text>
                    <Text style={styles.timelineItemDate}>{h.submittedAt}</Text>
                  </View>
                  {h.clientFeedback ? (
                    <View style={styles.historyFeedbackBox}>
                      <Text style={styles.historyFeedbackText}>&ldquo;{h.clientFeedback}&rdquo;</Text>
                    </View>
                  ) : null}
                </View>
              </View>
            ))}
          </View>

          {/* Request Changes Input Box (Toggled on request changes) */}
          {showFeedbackInput && (
            <View style={styles.feedbackInputCard}>
              <Text style={styles.feedbackLabel}>Revision Feedback for Provider:</Text>
              <TextInput
                style={styles.feedbackTextInput}
                placeholder="Explain what needs to be changed (e.g. Adjust banner layout and typography)..."
                placeholderTextColor={colors.textMuted}
                multiline
                numberOfLines={3}
                value={feedbackText}
                onChangeText={setFeedbackText}
              />
            </View>
          )}
        </ScrollView>

        {/* Bottom Review Actions (Only for clients) */}
        {canReviewDeliverables && isAwaitingReview && (
          <View style={[styles.bottomBar, { paddingBottom: 10 }]}>
            <TouchableOpacity
              style={styles.requestChangesBtn}
              onPress={handleRequestChanges}
              activeOpacity={0.8}
            >
              <Feather name="edit-3" size={16} color={colors.buttonPrimary} />
              <Text style={styles.requestChangesText}>
                {showFeedbackInput ? 'Send Revisions' : 'Request changes'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.approveBtn}
              onPress={handleApprove}
              activeOpacity={0.8}
            >
              <Feather name="check" size={18} color={colors.white} />
              <Text style={styles.approveText}>Approve deliverable</Text>
            </TouchableOpacity>
          </View>
        )}
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
  backButton: {
    padding: 6,
  },
  headerTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: 22,
    color: colors.textPrimary
  },
  closeButton: {
    padding: 6,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  portalBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F3EEFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
  },
  portalLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  portalAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.buttonPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  portalAvatarText: {
    fontFamily: typography.fonts.bold,
    fontSize: 14,
    color: colors.white,
  },
  portalLabel: {
    fontFamily: typography.fonts.medium,
    fontSize: 11,
    color: colors.buttonPrimary,
    letterSpacing: 0.5,
  },
  portalClientName: {
    fontFamily: typography.fonts.bold,
    fontSize: 14,
    color: colors.textPrimary,
  },
  liveSessionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.white,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#3B82F6',
  },
  liveSessionText: {
    fontFamily: typography.fonts.medium,
    fontSize: 12,
    color: '#3B82F6',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EEE8F6',
    shadowColor: '#493068',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  projectTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  projectTagText: {
    fontFamily: typography.fonts.medium,
    fontSize: 13,
    color: colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 12,
    fontFamily: typography.fonts.medium,
  },
  statusAwaiting: {
    backgroundColor: '#FEF3E8',
  },
  statusAwaitingText: {
    fontFamily: typography.fonts.medium,
    fontSize: 12,
    color: '#B45309',
  },
  statusApproved: {
    backgroundColor: '#ECFDF5',
  },
  statusApprovedText: {
    fontFamily: typography.fonts.medium,
    fontSize: 12,
    color: '#059669',
  },
  statusChanges: {
    backgroundColor: '#FEF2F2',
  },
  statusChangesText: {
    fontFamily: typography.fonts.medium,
    fontSize: 12,
    color: '#DC2626',
  },
  deliverableTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: 22,
    color: colors.textPrimary,
    marginBottom: 10,
  },
  milestonePill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    backgroundColor: '#F3EEFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    marginBottom: 14,
  },
  milestonePillText: {
    fontFamily: typography.fonts.medium,
    fontSize: 12,
    color: colors.buttonPrimary,
  },
  authorBox: {
    backgroundColor: '#F9F8FD',
    borderRadius: 12,
    padding: 12,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  authorRowText: {
    fontFamily: typography.fonts.regular,
    fontSize: 13,
    color: colors.textSecondary,
  },
  boldText: {
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary,
  },
  authorNoteBox: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ECE7F6',
  },
  authorNoteLabel: {
    fontFamily: typography.fonts.medium,
    fontSize: 11,
    color: colors.textMuted,
    marginBottom: 2,
  },
  authorNoteContent: {
    fontFamily: typography.fonts.regular,
    fontSize: 13,
    color: colors.textPrimary,
    fontStyle: 'italic',
  },
  fileCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  fileTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  fileSectionTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: 15,
    color: colors.textPrimary,
  },
  versionBadge: {
    backgroundColor: '#F1EAFD',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  versionBadgeText: {
    fontFamily: typography.fonts.medium,
    fontSize: 11,
    color: colors.buttonPrimary,
  },
  sharingStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  sharingStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#15803D',
  },
  sharingStatusText: {
    fontFamily: typography.fonts.medium,
    fontSize: 11,
    color: '#15803D',
  },
  fileListCard: {
    backgroundColor: '#FAF9FD',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#ECE7F6',
  },
  fileListLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  fileListIconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ECE7F6',
  },
  fileListName: {
    fontFamily: typography.fonts.bold,
    fontSize: 14,
    color: colors.textPrimary,
  },
  fileListMeta: {
    fontFamily: typography.fonts.regular,
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  fileQuickActionsRow: {
    flexDirection: 'row',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#ECE7F6',
    paddingTop: 10,
  },
  fileQuickActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2D9F3',
  },
  fileQuickActionText: {
    fontFamily: typography.fonts.medium,
    fontSize: 12,
    color: colors.textPrimary,
  },
  filePreviewContainer: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#FAF9FD',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ECE7F6',
    borderStyle: 'dashed',
  },
  filePreviewName: {
    fontFamily: typography.fonts.bold,
    fontSize: 15,
    color: colors.textPrimary,
    marginTop: 8,
  },
  filePreviewSub: {
    fontFamily: typography.fonts.regular,
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  timelineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  timelineTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: 15,
    color: colors.textPrimary,
  },
  timelineCount: {
    fontFamily: typography.fonts.medium,
    fontSize: 12,
    color: colors.textMuted,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 14,
  },
  timelineBulletActive: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.buttonPrimary,
    marginTop: 4,
  },
  timelineBulletPast: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#D1D5DB',
    marginTop: 4,
  },
  timelineContent: {
    flex: 1,
  },
  timelineContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timelineItemTitle: {
    fontFamily: typography.fonts.medium,
    fontSize: 14,
    color: colors.textPrimary,
  },
  timelineItemDate: {
    fontFamily: typography.fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
  },
  timelineItemSub: {
    fontFamily: typography.fonts.regular,
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  historyFeedbackBox: {
    backgroundColor: '#FEF3E8',
    borderRadius: 8,
    padding: 8,
    marginTop: 6,
  },
  historyFeedbackText: {
    fontFamily: typography.fonts.regular,
    fontSize: 12,
    color: '#92400E',
    fontStyle: 'italic',
  },
  feedbackInputCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#ECE7F6',
    marginBottom: 16,
  },
  feedbackLabel: {
    fontFamily: typography.fonts.bold,
    fontSize: 13,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  feedbackTextInput: {
    backgroundColor: '#FAF9FD',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2D9F3',
    padding: 10,
    fontFamily: typography.fonts.regular,
    fontSize: 13,
    color: colors.textPrimary,
    minHeight: 60,
  },
  bottomBar: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: spacing.lg,
    paddingTop: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0EDF7',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#493068',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3
  },
  requestChangesBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#F3EEFF',
  },
  requestChangesText: {
    fontFamily: typography.fonts.bold,
    fontSize: 14,
    color: colors.buttonPrimary,
  },
  approveBtn: {
    flex: 1.3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: colors.buttonPrimary,
  },
  approveText: {
    fontFamily: typography.fonts.bold,
    fontSize: 14,
    color: colors.white,
  },
});
