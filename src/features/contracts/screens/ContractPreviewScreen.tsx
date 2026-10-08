import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useAppContext } from '@/context/AppContext';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { ScreenBackdrop } from '@/components/ui/Surface';

export const ContractPreviewScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { projects, selectedProjectId } = useAppContext();

  const currentProjectId = selectedProjectId || projects[0]?.id || '';
  const project = projects.find((p) => p.id === currentProjectId) || projects[0];

  const handleShare = async () => {
    try {
      await Share.share({
        message: `ISAACIFY Master Service Agreement: ${project?.title || 'Creative Project'} for ${project?.clientName || 'Client'}. Review and sign digitally at https://isaacify.app/contracts/agr-2026-004`,
      });
    } catch {
      // ignore
    }
  };

  const handleExportPDF = () => {
    Alert.alert(
      'Exporting Contract PDF',
      'Legal Service Agreement compiled into high-resolution PDF format with cryptographic signature hashes.',
      [{ text: 'OK' }]
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
            <Text style={styles.headerTitle}>Preview Contract</Text>
            <Text style={styles.headerSubtitle}>AGR-2026-CB-004</Text>
          </View>
        </View>

        <View style={styles.headerRightActions}>
          <TouchableOpacity style={styles.iconCircleBtn} onPress={handleShare}>
            <Feather name="share-2" size={17} color={colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconCircleBtn} onPress={handleExportPDF}>
            <Feather name="download" size={17} color={colors.buttonPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 24) + 80 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Document Status Ribbon */}
        <View style={styles.statusRibbon}>
          <View style={styles.ribbonLeft}>
            <View style={styles.statusPulseDot} />
            <Text style={styles.statusRibbonText}>OFFICIAL LEGAL INSTRUMENT</Text>
          </View>
          <Text style={styles.statusRibbonDate}>Effective: 01 Oct 2026</Text>
        </View>

        {/* Contract Sheet (Parchment Styled Card) */}
        <View style={styles.documentSheet}>
          {/* Document Header Branding */}
          <View style={styles.docHeader}>
            <Text style={styles.docSuperTitle}>CONFIDENTIAL & BINDING</Text>
            <Text style={styles.docTitle}>
              MASTER CREATIVE SERVICES & INDEPENDENT CONTRACTOR AGREEMENT
            </Text>
            <View style={styles.docDivider} />
          </View>

          {/* Parties Section */}
          <View style={styles.partiesContainer}>
            <View style={styles.partyBox}>
              <Text style={styles.partyRoleLabel}>SERVICE PROVIDER</Text>
              <Text style={styles.partyName}>Kasun Alwis</Text>
              <Text style={styles.partySub}>Creative Director & Lead Developer</Text>
              <Text style={styles.partyAddress}>ISAACIFY Studio, Colombo 05, Sri Lanka</Text>
              <Text style={styles.partyContact}>kasun@creativepulse.lk • +94 77 123 4567</Text>
            </View>

            <View style={styles.partiesConnector}>
              <View style={styles.connectorLine} />
              <Text style={styles.connectorText}>AND</Text>
              <View style={styles.connectorLine} />
            </View>

            <View style={styles.partyBox}>
              <Text style={styles.partyRoleLabel}>THE CLIENT</Text>
              <Text style={styles.partyName}>{project?.clientName || 'Senuri Perera'}</Text>
              <Text style={styles.partySub}>Authorized Representative</Text>
              <Text style={styles.partyAddress}>CeylonBites (Pvt) Ltd, Colombo 03, Sri Lanka</Text>
              <Text style={styles.partyContact}>senuri@ceylonbites.lk • +94 77 987 6543</Text>
            </View>
          </View>

          {/* Section 1: Engagement & Scope */}
          <View style={styles.sectionBox}>
            <Text style={styles.sectionHeader}>1. ENGAGEMENT AND SCOPE OF WORK</Text>
            <Text style={styles.clauseParagraph}>
              The Client hereby engages the Service Provider to perform the creative and technical design,
              development, and deployment services for the project known as &ldquo;{project?.title || 'CeylonBites Brand & Website'}&rdquo;.
              Services shall include wireframing, high-fidelity responsive design system creation, digital menu ordering flow,
              and cross-platform optimization as documented in the Approved Project Scope baseline.
            </Text>
          </View>

          {/* Section 2: Compensation & Invoicing */}
          <View style={styles.sectionBox}>
            <Text style={styles.sectionHeader}>2. COMPENSATION AND MILESTONES</Text>
            <Text style={styles.clauseParagraph}>
              Total contract fee is agreed at LKR 222,000 (Two Hundred Twenty-Two Thousand Sri Lankan Rupees),
              payable under the following milestone structure:
            </Text>

            <View style={styles.milestoneTable}>
              <View style={styles.milestoneRow}>
                <Text style={styles.mCol1}>M1. Deposit (50%)</Text>
                <Text style={styles.mCol2}>Due at signing</Text>
                <Text style={styles.mCol3}>LKR 111,000</Text>
              </View>
              <View style={styles.milestoneRow}>
                <Text style={styles.mCol1}>M2. Brand & UI Approval (30%)</Text>
                <Text style={styles.mCol2}>Design sign-off</Text>
                <Text style={styles.mCol3}>LKR 66,600</Text>
              </View>
              <View style={styles.milestoneRow}>
                <Text style={styles.mCol1}>M3. Final Delivery (20%)</Text>
                <Text style={styles.mCol2}>Production deployment</Text>
                <Text style={styles.mCol3}>LKR 44,400</Text>
              </View>
            </View>
          </View>

          {/* Section 3: Intellectual Property */}
          <View style={styles.sectionBox}>
            <Text style={styles.sectionHeader}>3. INTELLECTUAL PROPERTY & TRANSFER OF RIGHTS</Text>
            <Text style={styles.clauseParagraph}>
              All intellectual property rights, trademarks, vector graphic assets, source code, and design tokens
              developed specifically for this project shall be unconditionally transferred to the Client immediately upon
              receipt of full, cleared payment of all outstanding invoices. Prior to final settlement, all assets remain
              the proprietary intellectual property of the Service Provider.
            </Text>
          </View>

          {/* Section 4: Revisions & Changes */}
          <View style={styles.sectionBox}>
            <Text style={styles.sectionHeader}>4. REVISIONS & CHANGE MANAGEMENT</Text>
            <Text style={styles.clauseParagraph}>
              Two (2) formal design review cycles are included in each project phase. Requested modifications deviating
              substantially from agreed wireframes or introducing new functionality beyond Section 1 shall be subject to
              written Scope Change Requests billed at the agreed professional rate of LKR 6,500 per hour.
            </Text>
          </View>

          {/* Section 5: Governing Law */}
          <View style={styles.sectionBox}>
            <Text style={styles.sectionHeader}>5. GOVERNING LAW & ARBITRATION</Text>
            <Text style={styles.clauseParagraph}>
              This agreement shall be governed by and construed in accordance with the substantive commercial laws of the
              Democratic Socialist Republic of Sri Lanka. Any disputes arising hereunder shall be resolved through amicable
              consultation or binding commercial arbitration in Colombo.
            </Text>
          </View>

          {/* Signatures & Execution Section */}
          <View style={styles.signaturesContainer}>
            <Text style={styles.signaturesTitle}>IN WITNESS WHEREOF</Text>
            <Text style={styles.signaturesSubtitle}>
              The parties execute this agreement digitally via verified ISAACIFY credentials.
            </Text>

            <View style={styles.sigBlocksRow}>
              {/* Provider Signature */}
              <View style={styles.sigCard}>
                <View style={styles.signatureBadge}>
                  <Ionicons name="checkmark-circle" size={14} color="#059669" />
                  <Text style={styles.signatureBadgeText}>Digitally Signed</Text>
                </View>
                <Text style={styles.scriptSignature}>Kasun Alwis</Text>
                <View style={styles.sigLine} />
                <Text style={styles.sigSignerName}>Kasun Alwis</Text>
                <Text style={styles.sigSignerDate}>2026-09-28 • 10:14 AM IST</Text>
                <Text style={styles.sigHash}>SHA-256: 8a4c9b...1f09e</Text>
              </View>

              {/* Client Signature */}
              <View style={[styles.sigCard, styles.clientPendingSigCard]}>
                <View style={[styles.signatureBadge, styles.clientPendingBadge]}>
                  <Feather name="clock" size={12} color="#D97706" />
                  <Text style={[styles.signatureBadgeText, { color: '#D97706' }]}>
                    Ready to Sign
                  </Text>
                </View>
                <Text style={[styles.scriptSignature, { color: '#9CA3AF' }]}>
                  Senuri Perera
                </Text>
                <View style={styles.sigLine} />
                <Text style={styles.sigSignerName}>
                  {project?.clientName || 'Senuri Perera'}
                </Text>
                <Text style={styles.sigSignerDate}>Review & Sign below</Text>
                <Text style={styles.sigHash}>Auth Token: ISAAC-CL-778</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Floating Bottom Action Bar */}
      <View
        style={[
          styles.bottomBar,
          { paddingBottom: Math.max(insets.bottom, 16) },
        ]}
      >
        <TouchableOpacity
          style={styles.editTermsBtn}
          onPress={() => router.push('/contract-terms')}
        >
          <Feather name="edit-2" size={16} color={colors.textSecondary} />
          <Text style={styles.editTermsBtnText}>Edit Terms</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.proceedReviewBtn}
          onPress={() => router.push('/contract-review')}
          activeOpacity={0.8}
        >
          <Feather name="check-circle" size={18} color={colors.white} />
          <Text style={styles.proceedReviewBtnText}>Proceed to Review & Sign</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 14,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
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
    fontSize: 18,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 11,
    fontFamily: typography.fonts.medium,
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  headerRightActions: {
    flexDirection: 'row',
    gap: 10,
  },
  iconCircleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  statusRibbon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E1B4B',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 14,
  },
  ribbonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusPulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  statusRibbonText: {
    fontSize: 11,
    fontFamily: typography.fonts.bold,
    color: colors.white,
    letterSpacing: 0.8,
  },
  statusRibbonDate: {
    fontSize: 11,
    fontFamily: typography.fonts.medium,
    color: '#CBD5E1',
  },
  documentSheet: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 22,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  docHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  docSuperTitle: {
    fontSize: 10,
    fontFamily: typography.fonts.bold,
    color: colors.buttonPrimary,
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  docTitle: {
    fontSize: 16,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
  },
  docDivider: {
    width: 60,
    height: 2,
    backgroundColor: colors.buttonPrimary,
    marginTop: 14,
    borderRadius: 1,
  },
  partiesContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    marginBottom: 20,
  },
  partyBox: {
    gap: 2,
  },
  partyRoleLabel: {
    fontSize: 10,
    fontFamily: typography.fonts.bold,
    color: colors.buttonPrimary,
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  partyName: {
    fontSize: 15,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary,
  },
  partySub: {
    fontSize: 12,
    fontFamily: typography.fonts.medium,
    color: colors.textSecondary,
  },
  partyAddress: {
    fontSize: 11,
    fontFamily: typography.fonts.regular,
    color: colors.textMuted,
  },
  partyContact: {
    fontSize: 11,
    fontFamily: typography.fonts.regular,
    color: colors.textSecondary,
    marginTop: 2,
  },
  partiesConnector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    gap: 10,
  },
  connectorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#D1D5DB',
  },
  connectorText: {
    fontSize: 10,
    fontFamily: typography.fonts.bold,
    color: colors.textMuted,
  },
  sectionBox: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 13,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary,
    letterSpacing: 0.4,
    marginBottom: 8,
  },
  clauseParagraph: {
    fontSize: 12,
    fontFamily: typography.fonts.regular,
    color: colors.textSecondary,
    lineHeight: 19,
  },
  milestoneTable: {
    marginTop: 10,
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  milestoneRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  mCol1: {
    flex: 1.4,
    fontSize: 11,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary,
  },
  mCol2: {
    flex: 1.1,
    fontSize: 11,
    fontFamily: typography.fonts.regular,
    color: colors.textSecondary,
  },
  mCol3: {
    flex: 1.2,
    fontSize: 11,
    fontFamily: typography.fonts.bold,
    color: colors.buttonPrimary,
    textAlign: 'right',
  },
  signaturesContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 18,
    marginTop: 10,
  },
  signaturesTitle: {
    fontSize: 12,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary,
    letterSpacing: 1,
    textAlign: 'center',
  },
  signaturesSubtitle: {
    fontSize: 11,
    fontFamily: typography.fonts.regular,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  sigBlocksRow: {
    gap: 12,
  },
  sigCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  clientPendingSigCard: {
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
    backgroundColor: '#FAFAFA',
  },
  signatureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#D1FAE5',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 8,
  },
  clientPendingBadge: {
    backgroundColor: '#FEF3C7',
  },
  signatureBadgeText: {
    fontSize: 10,
    fontFamily: typography.fonts.bold,
    color: '#059669',
  },
  scriptSignature: {
    fontSize: 22,
    fontFamily: typography.fonts.medium,
    fontStyle: 'italic',
    color: '#1E1B4B',
    marginVertical: 4,
  },
  sigLine: {
    height: 1,
    backgroundColor: '#CBD5E1',
    marginVertical: 6,
  },
  sigSignerName: {
    fontSize: 12,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary,
  },
  sigSignerDate: {
    fontSize: 10,
    fontFamily: typography.fonts.regular,
    color: colors.textSecondary,
    marginTop: 2,
  },
  sigHash: {
    fontSize: 9,
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
  editTermsBtn: {
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
  editTermsBtnText: {
    fontSize: 13,
    fontFamily: typography.fonts.bold,
    color: colors.textSecondary,
  },
  proceedReviewBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.buttonPrimary,
    borderRadius: 22,
    paddingVertical: 12,
  },
  proceedReviewBtnText: {
    fontSize: 13,
    fontFamily: typography.fonts.bold,
    color: colors.white,
  },
});

export default ContractPreviewScreen;
