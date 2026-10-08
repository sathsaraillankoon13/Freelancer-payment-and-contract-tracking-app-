import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useAppContext } from '@/context/AppContext';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { ScreenBackdrop } from '@/components/ui/Surface';

export const ContractReviewScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { projects, selectedProjectId } = useAppContext();

  const currentProjectId = selectedProjectId || projects[0]?.id || '';
  const project = projects.find((p) => p.id === currentProjectId) || projects[0];

  // Review state
  const [userRole, setUserRole] = useState<'client' | 'provider'>('client');
  const [checkedClauses, setCheckedClauses] = useState<{ [key: string]: boolean }>({
    'c1': true,
    'c2': true,
    'c3': false,
    'c4': false,
    'c5': false,
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [signerName, setSignerName] = useState(
    userRole === 'client' ? project?.clientName || 'Senuri Perera' : 'Kasun Alwis'
  );
  const [isContractSigned, setIsContractSigned] = useState(false);

  // Amendment Request Modal
  const [isAmendmentModalVisible, setIsAmendmentModalVisible] = useState(false);
  const [amendmentClause, setAmendmentClause] = useState('Payment Schedule & Retainer');
  const [amendmentNote, setAmendmentNote] = useState('');

  const toggleClauseCheck = (key: string) => {
    setCheckedClauses((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleRequestAmendment = () => {
    if (!amendmentNote.trim()) {
      Alert.alert('Required', 'Please describe the proposed contract amendment.');
      return;
    }
    Alert.alert(
      'Amendment Requested',
      `Your proposed change for "${amendmentClause}" has been sent to the service provider for revision approval.`
    );
    setIsAmendmentModalVisible(false);
    setAmendmentNote('');
  };

  const handleSignContract = () => {
    if (!termsAccepted) {
      Alert.alert('Acceptance Required', 'Please check the box agreeing to the contract terms before signing.');
      return;
    }
    if (!signerName.trim()) {
      Alert.alert('Signer Name Required', 'Please enter your full legal name as digital signature.');
      return;
    }

    setIsContractSigned(true);
    Alert.alert(
      'Contract Executed Successfully! 🎉',
      `The agreement for ${project?.title || 'Project'} has been signed by ${signerName} and is now legally active.`,
      [
        {
          text: 'View Project Overview',
          onPress: () => router.push('/projects'),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScreenBackdrop />
      <StatusBar style="dark" />

      {/* Screen Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
        <View style={styles.headerLeftRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace('/home');
              }
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather name="arrow-left" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Contract Review</Text>
            <Text style={styles.headerSubtitle}>
              {userRole === 'client' ? 'Client Review Mode' : 'Provider Review Mode'}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.roleTogglePill}
          onPress={() => {
            const next = userRole === 'client' ? 'provider' : 'client';
            setUserRole(next);
            setSignerName(next === 'client' ? project?.clientName || 'Senuri Perera' : 'Kasun Alwis');
          }}
        >
          <Feather name="refresh-cw" size={12} color={colors.buttonPrimary} />
          <Text style={styles.roleToggleText}>
            As: {userRole === 'client' ? 'Client' : 'Freelancer'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 24) + 90 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Status Banner */}
        <View style={styles.reviewBanner}>
          <View style={styles.bannerIconBox}>
            <Feather
              name={isContractSigned ? 'check-circle' : 'file-text'}
              size={24}
              color={isContractSigned ? '#059669' : colors.buttonPrimary}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>
              {isContractSigned
                ? 'Agreement Fully Executed'
                : 'Awaiting Your Review & Sign-Off'}
            </Text>
            <Text style={styles.bannerSub}>
              {isContractSigned
                ? 'Both parties have verified digital signatures. Project is under binding terms.'
                : 'Please review all 5 statutory clauses, verify milestones, and sign below.'}
            </Text>
          </View>
        </View>

        {/* Clause Review Checklist */}
        <Text style={styles.sectionHeader}>Clause Verification Checklist</Text>

        {/* Clause 1 */}
        <View style={styles.clauseReviewCard}>
          <TouchableOpacity
            style={styles.clauseCheckbox}
            onPress={() => toggleClauseCheck('c1')}
          >
            {checkedClauses['c1'] ? (
              <Ionicons name="checkbox" size={22} color={colors.buttonPrimary} />
            ) : (
              <Ionicons name="square-outline" size={22} color="#9CA3AF" />
            )}
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.clauseCardTitle}>1. Scope Baseline & Deliverables</Text>
            <Text style={styles.clauseCardSnippet}>
              Full Figma UI kit, mobile-first responsive frontend, and online ordering flow.
            </Text>
          </View>
        </View>

        {/* Clause 2 */}
        <View style={styles.clauseReviewCard}>
          <TouchableOpacity
            style={styles.clauseCheckbox}
            onPress={() => toggleClauseCheck('c2')}
          >
            {checkedClauses['c2'] ? (
              <Ionicons name="checkbox" size={22} color={colors.buttonPrimary} />
            ) : (
              <Ionicons name="square-outline" size={22} color="#9CA3AF" />
            )}
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.clauseCardTitle}>2. Fee Structure & Deposit Schedule</Text>
            <Text style={styles.clauseCardSnippet}>
              LKR 222,000 Total. 50% retainer (LKR 111,000), 30% milestone 2, 20% on production launch.
            </Text>
          </View>
        </View>

        {/* Clause 3 */}
        <View style={styles.clauseReviewCard}>
          <TouchableOpacity
            style={styles.clauseCheckbox}
            onPress={() => toggleClauseCheck('c3')}
          >
            {checkedClauses['c3'] ? (
              <Ionicons name="checkbox" size={22} color={colors.buttonPrimary} />
            ) : (
              <Ionicons name="square-outline" size={22} color="#9CA3AF" />
            )}
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.clauseCardTitle}>3. Intellectual Property Transfer</Text>
            <Text style={styles.clauseCardSnippet}>
              Full copyright and code ownership transferred exclusively to client upon final payment.
            </Text>
          </View>
        </View>

        {/* Clause 4 */}
        <View style={styles.clauseReviewCard}>
          <TouchableOpacity
            style={styles.clauseCheckbox}
            onPress={() => toggleClauseCheck('c4')}
          >
            {checkedClauses['c4'] ? (
              <Ionicons name="checkbox" size={22} color={colors.buttonPrimary} />
            ) : (
              <Ionicons name="square-outline" size={22} color="#9CA3AF" />
            )}
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.clauseCardTitle}>4. Revision Rounds (2 Rounds Included)</Text>
            <Text style={styles.clauseCardSnippet}>
              Extra iterations or scope alterations billed at standard rate of LKR 6,500/hour.
            </Text>
          </View>
        </View>

        {/* Clause 5 */}
        <View style={styles.clauseReviewCard}>
          <TouchableOpacity
            style={styles.clauseCheckbox}
            onPress={() => toggleClauseCheck('c5')}
          >
            {checkedClauses['c5'] ? (
              <Ionicons name="checkbox" size={22} color={colors.buttonPrimary} />
            ) : (
              <Ionicons name="square-outline" size={22} color="#9CA3AF" />
            )}
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.clauseCardTitle}>5. Late Fee & Termination Terms</Text>
            <Text style={styles.clauseCardSnippet}>
              14-day notice period for mutual termination with pro-rata milestone settlement.
            </Text>
          </View>
        </View>

        {/* Request Amendment Link */}
        <TouchableOpacity
          style={styles.requestAmendmentBtn}
          onPress={() => setIsAmendmentModalVisible(true)}
        >
          <Feather name="message-square" size={15} color={colors.buttonPrimary} />
          <Text style={styles.requestAmendmentText}>
            Want changes? Request contract amendment
          </Text>
        </TouchableOpacity>

        {/* Digital Signature Pad */}
        <View style={styles.signatureCard}>
          <Text style={styles.sigCardTitle}>Digital Execution & Acceptance</Text>

          {/* Legal Acceptance Checkbox */}
          <TouchableOpacity
            style={styles.agreeRow}
            onPress={() => setTermsAccepted(!termsAccepted)}
            activeOpacity={0.8}
          >
            <Ionicons
              name={termsAccepted ? 'checkbox' : 'square-outline'}
              size={22}
              color={colors.buttonPrimary}
            />
            <Text style={styles.agreeText}>
              I have thoroughly reviewed all clauses and hereby accept and agree to be bound by the
              terms and conditions of this Agreement.
            </Text>
          </TouchableOpacity>

          {/* Signer Legal Name */}
          <Text style={styles.inputLabel}>Legal Signer Name</Text>
          <TextInput
            style={styles.signerInput}
            placeholder="Type your full legal name"
            placeholderTextColor={colors.textMuted}
            value={signerName}
            onChangeText={setSignerName}
          />

          {/* Simulated Signature Display */}
          <View style={styles.signaturePreviewPad}>
            <Text style={styles.signaturePreviewText}>{signerName || 'Your Signature'}</Text>
            <Text style={styles.signaturePadMeta}>
              Timestamp: {new Date().toISOString().slice(0, 10)} • Verified via ISAACIFY Mobile
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Action Bar */}
      <View
        style={[
          styles.bottomBar,
          { paddingBottom: Math.max(insets.bottom, 16) },
        ]}
      >
        <TouchableOpacity
          style={styles.previewBtn}
          onPress={() => router.push('/contract-preview')}
        >
          <Feather name="file-text" size={16} color={colors.textSecondary} />
          <Text style={styles.previewBtnText}>Full Preview</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.signBtn,
            isContractSigned && styles.signBtnDone,
          ]}
          onPress={handleSignContract}
          activeOpacity={0.8}
        >
          <Ionicons
            name={isContractSigned ? 'checkmark-circle' : 'create-outline'}
            size={18}
            color={colors.white}
          />
          <Text style={styles.signBtnText}>
            {isContractSigned ? 'Agreement Signed' : 'Sign & Execute Agreement'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Amendment Modal */}
      <Modal
        visible={isAmendmentModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsAmendmentModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Request Contract Amendment</Text>
            <Text style={styles.modalSubtitle}>
              Specify which term you would like modified and provide your suggested changes.
            </Text>

            <Text style={styles.inputLabel}>Clause to Amend</Text>
            <TextInput
              style={styles.singleLineInput}
              value={amendmentClause}
              onChangeText={setAmendmentClause}
            />

            <Text style={styles.inputLabel}>Proposed Revision / Note</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. Can we split Milestone 2 into two 15% sub-payments after mobile QA?"
              placeholderTextColor={colors.textMuted}
              value={amendmentNote}
              onChangeText={setAmendmentNote}
              multiline
              numberOfLines={4}
            />

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setIsAmendmentModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSaveBtn}
                onPress={handleRequestAmendment}
              >
                <Text style={styles.modalSaveText}>Send Request</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
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
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EFF6',
  },
  headerLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 12,
    fontFamily: typography.fonts.regular,
    color: colors.textSecondary,
    marginTop: 2,
  },
  roleTogglePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
  },
  roleToggleText: {
    fontSize: 11,
    fontFamily: typography.fonts.bold,
    color: colors.buttonPrimary,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  reviewBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#EEE8F6',
    marginBottom: 20,
  },
  bannerIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerTitle: {
    fontSize: 15,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary,
  },
  bannerSub: {
    fontSize: 12,
    fontFamily: typography.fonts.regular,
    color: colors.textSecondary,
    lineHeight: 17,
    marginTop: 2,
  },
  sectionHeader: {
    fontSize: 14,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  clauseReviewCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.white,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EEE8F6',
    marginBottom: 10,
    gap: 12,
  },
  clauseCheckbox: {
    marginTop: 2,
  },
  clauseCardTitle: {
    fontSize: 13,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary,
  },
  clauseCardSnippet: {
    fontSize: 12,
    fontFamily: typography.fonts.regular,
    color: colors.textSecondary,
    marginTop: 3,
    lineHeight: 17,
  },
  requestAmendmentBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    marginTop: 6,
    marginBottom: 18,
  },
  requestAmendmentText: {
    fontSize: 13,
    fontFamily: typography.fonts.medium,
    color: colors.buttonPrimary,
  },
  signatureCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#EEE8F6',
  },
  sigCardTitle: {
    fontSize: 15,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary,
    marginBottom: 14,
  },
  agreeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 16,
  },
  agreeText: {
    flex: 1,
    fontSize: 12,
    fontFamily: typography.fonts.regular,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  inputLabel: {
    fontSize: 12,
    fontFamily: typography.fonts.bold,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  signerInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 14,
  },
  signaturePreviewPad: {
    backgroundColor: '#FAF5FF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#D8B4FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signaturePreviewText: {
    fontSize: 24,
    fontFamily: typography.fonts.medium,
    fontStyle: 'italic',
    color: '#581C87',
    marginVertical: 4,
  },
  signaturePadMeta: {
    fontSize: 10,
    fontFamily: typography.fonts.regular,
    color: colors.textMuted,
    marginTop: 4,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 6,
  },
  previewBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 22,
    paddingVertical: 12,
  },
  previewBtnText: {
    fontSize: 13,
    fontFamily: typography.fonts.bold,
    color: colors.textSecondary,
  },
  signBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.buttonPrimary,
    borderRadius: 22,
    paddingVertical: 12,
  },
  signBtnDone: {
    backgroundColor: '#059669',
  },
  signBtnText: {
    fontSize: 13,
    fontFamily: typography.fonts.bold,
    color: colors.white,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary,
  },
  modalSubtitle: {
    fontSize: 12,
    fontFamily: typography.fonts.regular,
    color: colors.textSecondary,
    marginTop: 4,
    marginBottom: 14,
  },
  singleLineInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    fontSize: 13,
    color: colors.textPrimary,
    height: 80,
    textAlignVertical: 'top',
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  modalCancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 18,
    paddingVertical: 10,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 13,
    fontFamily: typography.fonts.medium,
    color: colors.textSecondary,
  },
  modalSaveBtn: {
    flex: 1,
    backgroundColor: colors.buttonPrimary,
    borderRadius: 18,
    paddingVertical: 10,
    alignItems: 'center',
  },
  modalSaveText: {
    fontSize: 13,
    fontFamily: typography.fonts.bold,
    color: colors.white,
  },
});

export default ContractReviewScreen;
