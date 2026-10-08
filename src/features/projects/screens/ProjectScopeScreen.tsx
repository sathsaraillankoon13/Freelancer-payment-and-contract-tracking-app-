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

export const ProjectScopeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { projects, selectedProjectId } = useAppContext();

  const [currentProjectId, setCurrentProjectId] = useState<string>(
    selectedProjectId || projects[0]?.id || ''
  );
  const project = projects.find((p) => p.id === currentProjectId) || projects[0];

  // In-scope deliverables state
  const [inScopeItems, setInScopeItems] = useState<string[]>([
    'Custom high-fidelity mobile-first responsive web design (Figma)',
    'Online food menu ordering flow with category filtering',
    'Table reservation booking enquiry modal & WhatsApp integration',
    'SEO setup: Meta tags, sitemap.xml, Google Business verification',
    'Bilingual support preparation (Sinhala / English UI tokens)',
    'Speed performance optimization targeting 90+ Lighthouse score',
  ]);

  // Out-of-scope items state
  const [outOfScopeItems, setOutOfScopeItems] = useState<string[]>([
    'Payment gateway merchant account registration fee (Paid by Client)',
    'Commercial photography & drone footage at restaurant premises',
    '3rd-party SMS OTP carrier gateway recurring subscription costs',
    'Custom POS hardware driver integrations',
  ]);

  // Add Item Modal
  const [isAddItemModalVisible, setIsAddItemModalVisible] = useState(false);
  const [itemType, setItemType] = useState<'in' | 'out'>('in');
  const [newItemText, setNewItemText] = useState('');

  // Scope Change Request Modal
  const [isChangeRequestModalVisible, setIsChangeRequestModalVisible] = useState(false);
  const [changeTitle, setChangeTitle] = useState('');
  const [changeDescription, setChangeDescription] = useState('');
  const [changeBudget, setChangeBudget] = useState('45,000');
  const [changeDays, setChangeDays] = useState('7');

  const handleAddItem = () => {
    if (!newItemText.trim()) {
      Alert.alert('Required', 'Please enter deliverable item description.');
      return;
    }
    if (itemType === 'in') {
      setInScopeItems([...inScopeItems, newItemText.trim()]);
    } else {
      setOutOfScopeItems([...outOfScopeItems, newItemText.trim()]);
    }
    setNewItemText('');
    setIsAddItemModalVisible(false);
  };

  const handleDeleteInScope = (index: number) => {
    setInScopeItems(inScopeItems.filter((_, i) => i !== index));
  };

  const handleDeleteOutOfScope = (index: number) => {
    setOutOfScopeItems(outOfScopeItems.filter((_, i) => i !== index));
  };

  const handleSubmitChangeRequest = () => {
    if (!changeTitle.trim() || !changeDescription.trim()) {
      Alert.alert('Required', 'Please fill in all details for the scope change request.');
      return;
    }
    Alert.alert(
      'Scope Change Submitted',
      `Change request "${changeTitle}" of LKR ${changeBudget} (+${changeDays} days) has been recorded and submitted for client review.`
    );
    setIsChangeRequestModalVisible(false);
    setChangeTitle('');
    setChangeDescription('');
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
            <Text style={styles.headerTitle}>Project Scope</Text>
            <Text style={styles.headerSubtitle} numberOfLines={1}>
              {project?.title || 'Scope Specifications'}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.contractTermsLinkBtn}
          onPress={() => router.push('/contract-terms')}
        >
          <Feather name="file-text" size={16} color={colors.buttonPrimary} />
          <Text style={styles.contractTermsLinkText}>Terms</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 24) + 32 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Project Selector Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.projectPillsRow}
        >
          {projects.map((p) => {
            const isSelected = p.id === currentProjectId;
            return (
              <TouchableOpacity
                key={p.id}
                style={[styles.projectPill, isSelected && styles.projectPillActive]}
                onPress={() => setCurrentProjectId(p.id)}
              >
                <Text
                  style={[
                    styles.projectPillText,
                    isSelected && styles.projectPillTextActive,
                  ]}
                  numberOfLines={1}
                >
                  {p.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Overview Banner Card */}
        <View style={styles.overviewCard}>
          <View style={styles.overviewBadgeRow}>
            <View style={styles.activeBadge}>
              <Text style={styles.activeBadgeText}>BINDING SCOPE BASELINE</Text>
            </View>
            <Text style={styles.versionText}>v2.4 Finalized</Text>
          </View>

          <Text style={styles.overviewTitle}>Scope Objective</Text>
          <Text style={styles.overviewDescription}>
            Design, develop, and deliver a modern web solution for {project?.clientName || 'CeylonBites'},
            empowering direct consumer bookings, digital menu ordering, and brand identity enforcement.
          </Text>

          <View style={styles.overviewStatsRow}>
            <View style={styles.statCol}>
              <Text style={styles.statLabel}>Deliverables</Text>
              <Text style={styles.statVal}>{inScopeItems.length} In-Scope</Text>
            </View>
            <View style={styles.statCol}>
              <Text style={styles.statLabel}>Exclusions</Text>
              <Text style={styles.statVal}>{outOfScopeItems.length} Excluded</Text>
            </View>
            <View style={styles.statCol}>
              <Text style={styles.statLabel}>Revisions</Text>
              <Text style={styles.statVal}>2 Included</Text>
            </View>
          </View>
        </View>

        {/* In-Scope Deliverables Section */}
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.iconCircleGreen}>
              <Ionicons name="checkmark-done" size={16} color="#059669" />
            </View>
            <Text style={styles.sectionTitle}>In-Scope Deliverables</Text>
          </View>
          <TouchableOpacity
            style={styles.addClauseBtn}
            onPress={() => {
              setItemType('in');
              setIsAddItemModalVisible(true);
            }}
          >
            <Feather name="plus" size={14} color={colors.buttonPrimary} />
            <Text style={styles.addClauseBtnText}>Add Item</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.deliverablesList}>
          {inScopeItems.map((item, idx) => (
            <View key={idx} style={styles.deliverableItemCard}>
              <Ionicons
                name="checkmark-circle"
                size={18}
                color="#059669"
                style={{ marginTop: 2 }}
              />
              <Text style={styles.deliverableItemText}>{item}</Text>
              <TouchableOpacity
                onPress={() => handleDeleteInScope(idx)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Feather name="trash-2" size={14} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Out-of-Scope Section */}
        <View style={[styles.sectionHeaderRow, { marginTop: 24 }]}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.iconCircleRed}>
              <Ionicons name="close" size={16} color="#DC2626" />
            </View>
            <Text style={styles.sectionTitle}>Out-of-Scope (Exclusions)</Text>
          </View>
          <TouchableOpacity
            style={styles.addClauseBtn}
            onPress={() => {
              setItemType('out');
              setIsAddItemModalVisible(true);
            }}
          >
            <Feather name="plus" size={14} color={colors.buttonPrimary} />
            <Text style={styles.addClauseBtnText}>Add Exclusion</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.deliverablesList}>
          {outOfScopeItems.map((item, idx) => (
            <View key={idx} style={styles.deliverableItemCard}>
              <Ionicons
                name="close-circle"
                size={18}
                color="#DC2626"
                style={{ marginTop: 2 }}
              />
              <Text style={styles.deliverableItemText}>{item}</Text>
              <TouchableOpacity
                onPress={() => handleDeleteOutOfScope(idx)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Feather name="trash-2" size={14} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Revision & Change Management Card */}
        <View style={styles.revisionsCard}>
          <Text style={styles.revisionsTitle}>Revision Policy & Change Process</Text>
          <Text style={styles.revisionsBody}>
            Any requested alterations exceeding the 2 included design revision rounds, or requests
            adding features outside this documented scope, require a formal Scope Change Request
            approved by both parties prior to implementation.
          </Text>

          <TouchableOpacity
            style={styles.changeRequestBtn}
            onPress={() => setIsChangeRequestModalVisible(true)}
          >
            <Feather name="git-pull-request" size={16} color={colors.white} />
            <Text style={styles.changeRequestBtnText}>Submit Scope Change Request</Text>
          </TouchableOpacity>
        </View>

        {/* Direct Action Links */}
        <View style={styles.contractLinksRow}>
          <TouchableOpacity
            style={styles.secondaryLinkBtn}
            onPress={() => router.push('/contract-preview')}
          >
            <Feather name="file-text" size={16} color={colors.buttonPrimary} />
            <Text style={styles.secondaryLinkText}>Preview Legal Contract</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.primaryLinkBtn}
            onPress={() => router.push('/contract-review')}
          >
            <Feather name="check-square" size={16} color={colors.white} />
            <Text style={styles.primaryLinkText}>Review & Sign</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Add Item Modal */}
      <Modal
        visible={isAddItemModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsAddItemModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {itemType === 'in' ? 'Add In-Scope Deliverable' : 'Add Out-of-Scope Exclusion'}
            </Text>
            <TextInput
              style={styles.modalInput}
              placeholder={
                itemType === 'in'
                  ? 'e.g. Multi-tier user authentication & JWT tokens'
                  : 'e.g. Hosting server maintenance after 30-day warranty'
              }
              placeholderTextColor={colors.textMuted}
              value={newItemText}
              onChangeText={setNewItemText}
              multiline
              numberOfLines={3}
            />
            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setIsAddItemModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSaveBtn} onPress={handleAddItem}>
                <Text style={styles.modalSaveText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Scope Change Request Modal */}
      <Modal
        visible={isChangeRequestModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsChangeRequestModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Scope Change Request</Text>

            <Text style={styles.inputLabel}>Change Request Title</Text>
            <TextInput
              style={styles.singleLineInput}
              placeholder="e.g. Multi-currency checkout with PayPal"
              placeholderTextColor={colors.textMuted}
              value={changeTitle}
              onChangeText={setChangeTitle}
            />

            <Text style={styles.inputLabel}>Detailed Specifications</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Describe what additional components or flows are required..."
              placeholderTextColor={colors.textMuted}
              value={changeDescription}
              onChangeText={setChangeDescription}
              multiline
              numberOfLines={3}
            />

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>Additional Budget (LKR)</Text>
                <TextInput
                  style={styles.singleLineInput}
                  keyboardType="numeric"
                  value={changeBudget}
                  onChangeText={setChangeBudget}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>Added Days</Text>
                <TextInput
                  style={styles.singleLineInput}
                  keyboardType="numeric"
                  value={changeDays}
                  onChangeText={setChangeDays}
                />
              </View>
            </View>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setIsChangeRequestModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSaveBtn}
                onPress={handleSubmitChangeRequest}
              >
                <Text style={styles.modalSaveText}>Submit</Text>
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
    maxWidth: 160,
    marginTop: 2,
  },
  contractTermsLinkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: colors.primarySoft,
  },
  contractTermsLinkText: {
    fontSize: 12,
    fontFamily: typography.fonts.bold,
    color: colors.buttonPrimary,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  projectPillsRow: {
    gap: 8,
    paddingBottom: 14,
  },
  projectPill: {
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  projectPillActive: {
    backgroundColor: colors.buttonPrimary,
    borderColor: colors.buttonPrimary,
  },
  projectPillText: {
    fontSize: 12,
    fontFamily: typography.fonts.medium,
    color: colors.textSecondary,
  },
  projectPillTextActive: {
    color: colors.white,
    fontFamily: typography.fonts.bold,
  },
  overviewCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#EEE8F6',
    marginBottom: 20,
    shadowColor: '#493068',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  overviewBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  activeBadge: {
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  activeBadgeText: {
    fontSize: 10,
    fontFamily: typography.fonts.bold,
    color: colors.buttonPrimary,
    letterSpacing: 0.5,
  },
  versionText: {
    fontSize: 12,
    fontFamily: typography.fonts.medium,
    color: colors.textMuted,
  },
  overviewTitle: {
    fontSize: 16,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary,
    marginBottom: 6,
  },
  overviewDescription: {
    fontSize: 13,
    fontFamily: typography.fonts.regular,
    color: colors.textSecondary,
    lineHeight: 19,
    marginBottom: 16,
  },
  overviewStatsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 14,
  },
  statCol: {
    flex: 1,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: typography.fonts.medium,
    color: colors.textMuted,
    marginBottom: 2,
  },
  statVal: {
    fontSize: 13,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconCircleGreen: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleRed: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary,
  },
  addClauseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: colors.primarySoft,
  },
  addClauseBtnText: {
    fontSize: 12,
    fontFamily: typography.fonts.bold,
    color: colors.buttonPrimary,
  },
  deliverablesList: {
    gap: 8,
  },
  deliverableItemCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.white,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EEE8F6',
    gap: 10,
  },
  deliverableItemText: {
    flex: 1,
    fontSize: 13,
    fontFamily: typography.fonts.regular,
    color: colors.textPrimary,
    lineHeight: 18,
  },
  revisionsCard: {
    backgroundColor: '#F5F3FF',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E0E7FF',
    marginTop: 24,
  },
  revisionsTitle: {
    fontSize: 14,
    fontFamily: typography.fonts.bold,
    color: colors.buttonPrimary,
    marginBottom: 6,
  },
  revisionsBody: {
    fontSize: 12,
    fontFamily: typography.fonts.regular,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 14,
  },
  changeRequestBtn: {
    backgroundColor: colors.buttonPrimary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 20,
    paddingVertical: 12,
  },
  changeRequestBtnText: {
    color: colors.white,
    fontSize: 13,
    fontFamily: typography.fonts.bold,
  },
  contractLinksRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  secondaryLinkBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.buttonPrimary,
    borderRadius: 22,
    paddingVertical: 13,
  },
  secondaryLinkText: {
    color: colors.buttonPrimary,
    fontFamily: typography.fonts.bold,
    fontSize: 13,
  },
  primaryLinkBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.buttonPrimary,
    borderRadius: 22,
    paddingVertical: 13,
  },
  primaryLinkText: {
    color: colors.white,
    fontFamily: typography.fonts.bold,
    fontSize: 13,
  },
  // Modal styles
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
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary,
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 12,
    fontFamily: typography.fonts.bold,
    color: colors.textSecondary,
    marginBottom: 4,
    marginTop: 8,
  },
  singleLineInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    color: colors.textPrimary,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    fontSize: 13,
    color: colors.textPrimary,
    height: 70,
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

export default ProjectScopeScreen;
