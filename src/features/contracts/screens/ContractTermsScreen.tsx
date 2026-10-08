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
  Switch,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppContext } from '@/context/AppContext';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { ProjectTerm } from '@/types';
import { ScreenBackdrop } from '@/components/ui/Surface';

const CATEGORIES = [
  'All',
  'Scope & Revisions',
  'Payment & Late Fees',
  'Intellectual Property',
  'Termination',
  'General',
] as const;

export const ContractTermsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const {
    projects,
    selectedProjectId,
    addProjectTerm,
    updateProjectTerm,
    deleteProjectTerm,
  } = useAppContext();

  const [currentProjectId, setCurrentProjectId] = useState<string>(
    selectedProjectId || projects[0]?.id || ''
  );
  const project = projects.find((p) => p.id === currentProjectId) || projects[0];

  const terms: ProjectTerm[] = project?.terms || [
    {
      id: 't_1',
      title: 'Payment Schedule & Retainer',
      category: 'Payment & Late Fees',
      clause:
        'A non-refundable 50% deposit (LKR 111,000) is required prior to project kick-off. Final 50% balance is payable within 7 calendar days of delivery sign-off.',
      isStandard: true,
      createdAt: '2026-09-01',
    },
    {
      id: 't_2',
      title: 'Late Payment Interest Penalty',
      category: 'Payment & Late Fees',
      clause:
        'Invoices overdue by more than 14 days will accrue recurring interest at 2.5% per month or the maximum rate permitted by Sri Lankan commercial law.',
      isStandard: true,
      createdAt: '2026-09-01',
    },
    {
      id: 't_3',
      title: 'Intellectual Property & Copyright Assignment',
      category: 'Intellectual Property',
      clause:
        'Full copyright and production ownership of custom deliverables shall transfer exclusively to the Client only upon receipt of full and final settled payment.',
      isStandard: true,
      createdAt: '2026-09-01',
    },
    {
      id: 't_4',
      title: 'Design Revisions & Scope Boundaries',
      category: 'Scope & Revisions',
      clause:
        'Deliverables include up to 2 iterative design review rounds. Extra revision requests deviating from the approved wireframe baseline will be billed at LKR 6,500/hr.',
      isStandard: true,
      createdAt: '2026-09-01',
    },
    {
      id: 't_5',
      title: 'Mutual Termination for Convenience',
      category: 'Termination',
      clause:
        'Either party may terminate this agreement with 14 business days written notice. The Client shall compensate the Provider pro-rata for all completed milestones.',
      isStandard: false,
      createdAt: '2026-09-01',
    },
  ];

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Add / Edit Modal State
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTermId, setEditingTermId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<
    'Scope & Revisions' | 'Payment & Late Fees' | 'Intellectual Property' | 'Termination' | 'General'
  >('Scope & Revisions');
  const [formClause, setFormClause] = useState('');
  const [formIsStandard, setFormIsStandard] = useState(true);

  // Term to Delete confirmation state
  const [termToDelete, setTermToDelete] = useState<ProjectTerm | null>(null);

  const filteredTerms = terms.filter((term) => {
    const matchesCategory =
      selectedCategory === 'All' || term.category === selectedCategory;
    const matchesSearch =
      term.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      term.clause.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenAddModal = () => {
    setEditingTermId(null);
    setFormTitle('');
    setFormCategory('Scope & Revisions');
    setFormClause('');
    setFormIsStandard(true);
    setIsModalVisible(true);
  };

  const handleOpenEditModal = (term: ProjectTerm) => {
    setEditingTermId(term.id);
    setFormTitle(term.title);
    setFormCategory(term.category || 'Scope & Revisions');
    setFormClause(term.clause);
    setFormIsStandard(!!term.isStandard);
    setIsModalVisible(true);
  };

  const handleSaveTerm = () => {
    if (!formTitle.trim() || !formClause.trim()) {
      Alert.alert('Required Fields', 'Please enter both clause title and legal terms text.');
      return;
    }

    if (editingTermId) {
      updateProjectTerm(currentProjectId, editingTermId, {
        title: formTitle.trim(),
        category: formCategory,
        clause: formClause.trim(),
        isStandard: formIsStandard,
      });
    } else {
      addProjectTerm(currentProjectId, {
        title: formTitle.trim(),
        category: formCategory,
        clause: formClause.trim(),
        isStandard: formIsStandard,
      });
    }

    setIsModalVisible(false);
  };

  const handleConfirmDelete = () => {
    if (termToDelete) {
      deleteProjectTerm(currentProjectId, termToDelete.id);
      setTermToDelete(null);
    }
  };

  const handleInsertTemplate = (type: 'nda' | 'latefee' | 'approval') => {
    if (type === 'nda') {
      setFormTitle('Confidentiality & Non-Disclosure');
      setFormCategory('General');
      setFormClause(
        'Both parties agree that all confidential information, trade secrets, and non-public data exchanged shall be held in strict confidence for 3 years following contract execution.'
      );
    } else if (type === 'latefee') {
      setFormTitle('Grace Period & Late Fee Assessment');
      setFormCategory('Payment & Late Fees');
      setFormClause(
        'A 5-day grace period is provided following invoice issue date. Invoices remaining unsettled after grace period will incur a one-time late fee of LKR 5,000 in addition to monthly interest.'
      );
    } else if (type === 'approval') {
      setFormTitle('Client Review & Acceptance Timeline');
      setFormCategory('Scope & Revisions');
      setFormClause(
        'The Client shall inspect deliverables and provide feedback within 7 business days of submission. If no feedback is submitted within this window, deliverables shall be deemed approved.'
      );
    }
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
            <Text style={styles.headerTitle}>Contract Terms</Text>
            <Text style={styles.headerSubtitle} numberOfLines={1}>
              {project?.title || 'Contract Terms & Conditions'}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.addTermHeaderBtn}
          onPress={handleOpenAddModal}
          activeOpacity={0.8}
        >
          <Feather name="plus" size={16} color={colors.white} />
          <Text style={styles.addTermHeaderBtnText}>Add Clause</Text>
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

        {/* Quick Nav Bar to Scope / Preview / Review */}
        <View style={styles.workflowNavRow}>
          <TouchableOpacity
            style={styles.workflowNavBtn}
            onPress={() => router.push('/scope')}
          >
            <Feather name="target" size={14} color={colors.buttonPrimary} />
            <Text style={styles.workflowNavText}>Scope</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.workflowNavBtn, styles.workflowNavBtnActive]}
          >
            <Feather name="file-text" size={14} color={colors.white} />
            <Text style={[styles.workflowNavText, { color: colors.white }]}>Terms</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.workflowNavBtn}
            onPress={() => router.push('/contract-preview')}
          >
            <Feather name="eye" size={14} color={colors.buttonPrimary} />
            <Text style={styles.workflowNavText}>Preview</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.workflowNavBtn}
            onPress={() => router.push('/contract-review')}
          >
            <Feather name="check-circle" size={14} color={colors.buttonPrimary} />
            <Text style={styles.workflowNavText}>Review & Sign</Text>
          </TouchableOpacity>
        </View>

        {/* Search Box */}
        <View style={styles.searchBox}>
          <Feather name="search" size={18} color={colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search contract clauses or keywords..."
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

        {/* Categories Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryPillsRow}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.catPill, isSelected && styles.catPillActive]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text
                  style={[
                    styles.catPillText,
                    isSelected && styles.catPillTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Terms List */}
        {filteredTerms.length === 0 ? (
          <View style={styles.emptyCard}>
            <MaterialCommunityIcons
              name="file-document-outline"
              size={48}
              color={colors.primaryMedium}
            />
            <Text style={styles.emptyTitle}>No terms match your search</Text>
            <Text style={styles.emptySubtitle}>
              Create a custom term or pick standard clauses from our legal library.
            </Text>
            <TouchableOpacity style={styles.emptyAddBtn} onPress={handleOpenAddModal}>
              <Text style={styles.emptyAddBtnText}>+ Add New Clause</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredTerms.map((term, index) => (
            <View key={term.id} style={styles.termCard}>
              <View style={styles.termCardHeader}>
                <View style={styles.termNumberBadge}>
                  <Text style={styles.termNumberText}>{index + 1}</Text>
                </View>
                <View style={styles.termHeaderCenter}>
                  <Text style={styles.termTitle}>{term.title}</Text>
                  <View style={styles.tagRow}>
                    <View style={styles.categoryTag}>
                      <Text style={styles.categoryTagText}>{term.category || 'General'}</Text>
                    </View>
                    {term.isStandard && (
                      <View style={styles.standardTag}>
                        <Ionicons name="shield-checkmark" size={10} color="#059669" />
                        <Text style={styles.standardTagText}>Standard Clause</Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* Edit & Delete Action Buttons */}
                <View style={styles.termActions}>
                  <TouchableOpacity
                    style={styles.actionBtnSmall}
                    onPress={() => handleOpenEditModal(term)}
                  >
                    <Feather name="edit-2" size={14} color={colors.buttonPrimary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionBtnSmall}
                    onPress={() => setTermToDelete(term)}
                  >
                    <Feather name="trash-2" size={14} color="#DC2626" />
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.clauseBody}>{term.clause}</Text>
            </View>
          ))
        )}

        {/* Bottom CTA to Full Preview */}
        <View style={styles.footerCTA}>
          <TouchableOpacity
            style={styles.fullPreviewBtn}
            onPress={() => router.push('/contract-preview')}
            activeOpacity={0.8}
          >
            <Feather name="file-text" size={18} color={colors.white} />
            <Text style={styles.fullPreviewBtnText}>Preview Full Legal Contract</Text>
            <Feather name="arrow-right" size={18} color={colors.white} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ========================================================== */}
      {/* 1. ADD / EDIT TERM MODAL                                  */}
      {/* ========================================================== */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={[styles.modalContainer, { paddingTop: Math.max(insets.top, 16) }]}>
          <ScreenBackdrop />
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
              <Feather name="arrow-left" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.modalHeaderTitle}>
              {editingTermId ? 'Edit Clause' : 'Add Contract Clause'}
            </Text>
            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
              <Feather name="x" size={22} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.modalScroll}
            contentContainerStyle={[
              styles.modalScrollContent,
              { paddingBottom: Math.max(insets.bottom, 24) + 32 },
            ]}
            showsVerticalScrollIndicator={false}
          >
            {/* Quick Legal Templates */}
            <Text style={styles.formSectionLabel}>Quick Template Inserts</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
              <TouchableOpacity
                style={styles.templatePill}
                onPress={() => handleInsertTemplate('latefee')}
              >
                <Text style={styles.templatePillText}>+ Late Fee Penalty</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.templatePill}
                onPress={() => handleInsertTemplate('nda')}
              >
                <Text style={styles.templatePillText}>+ Non-Disclosure NDA</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.templatePill}
                onPress={() => handleInsertTemplate('approval')}
              >
                <Text style={styles.templatePillText}>+ 7-Day Approval Window</Text>
              </TouchableOpacity>
            </ScrollView>

            {/* Clause Title */}
            <Text style={styles.formLabel}>Clause Heading *</Text>
            <TextInput
              style={styles.formInput}
              placeholder="e.g. Intellectual Property Transfer"
              placeholderTextColor={colors.textMuted}
              value={formTitle}
              onChangeText={setFormTitle}
            />

            {/* Category */}
            <Text style={styles.formLabel}>Legal Category</Text>
            <View style={styles.catGrid}>
              {(
                [
                  'Scope & Revisions',
                  'Payment & Late Fees',
                  'Intellectual Property',
                  'Termination',
                  'General',
                ] as const
              ).map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[
                    styles.catGridOption,
                    formCategory === c && styles.catGridOptionActive,
                  ]}
                  onPress={() => setFormCategory(c)}
                >
                  <Text
                    style={[
                      styles.catGridText,
                      formCategory === c && styles.catGridTextActive,
                    ]}
                  >
                    {c}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Legal Clause Body */}
            <Text style={styles.formLabel}>Legal Clause Language *</Text>
            <TextInput
              style={[styles.formInput, styles.formTextArea]}
              placeholder="Enter legally binding clause text defining commitments, timelines, and liabilities..."
              placeholderTextColor={colors.textMuted}
              multiline
              numberOfLines={6}
              value={formClause}
              onChangeText={setFormClause}
            />

            {/* Standard clause switch */}
            <View style={styles.switchRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.switchTitle}>Standard Contract Term</Text>
                <Text style={styles.switchSub}>
                  Include this clause in standard templates for all future client contracts.
                </Text>
              </View>
              <Switch
                value={formIsStandard}
                onValueChange={setFormIsStandard}
                trackColor={{ false: '#E5E7EB', true: colors.buttonPrimary }}
                thumbColor={colors.white}
              />
            </View>

            {/* Save Button */}
            <TouchableOpacity
              style={styles.saveClauseBtn}
              onPress={handleSaveTerm}
              activeOpacity={0.8}
            >
              <Feather name="check" size={18} color={colors.white} />
              <Text style={styles.saveClauseBtnText}>
                {editingTermId ? 'Update Contract Term' : 'Save & Append to Contract'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      {/* ========================================================== */}
      {/* 2. DELETE TERM CONFIRMATION MODAL                         */}
      {/* ========================================================== */}
      <Modal
        visible={!!termToDelete}
        transparent
        animationType="fade"
        onRequestClose={() => setTermToDelete(null)}
      >
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmBox}>
            <View style={styles.deleteIconBadge}>
              <Feather name="trash-2" size={26} color="#DC2626" />
            </View>
            <Text style={styles.confirmTitle}>Delete Contract Clause?</Text>
            <Text style={styles.confirmSubtitle}>
              Are you sure you want to remove this clause from the project agreement?
            </Text>

            {termToDelete && (
              <View style={styles.confirmClauseSnippet}>
                <Text style={styles.confirmSnippetTitle}>{termToDelete.title}</Text>
                <Text style={styles.confirmSnippetText} numberOfLines={2}>
                  {termToDelete.clause}
                </Text>
              </View>
            )}

            <View style={styles.confirmButtonsRow}>
              <TouchableOpacity
                style={styles.cancelConfirmBtn}
                onPress={() => setTermToDelete(null)}
              >
                <Text style={styles.cancelConfirmText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteConfirmBtn}
                onPress={handleConfirmDelete}
              >
                <Text style={styles.deleteConfirmText}>Remove Clause</Text>
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
  addTermHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.buttonPrimary,
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addTermHeaderBtnText: {
    fontSize: 12,
    fontFamily: typography.fonts.bold,
    color: colors.white,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  projectPillsRow: {
    gap: 8,
    paddingBottom: 12,
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
  workflowNavRow: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
    borderColor: '#EEE8F6',
    marginBottom: 16,
    gap: 6,
  },
  workflowNavBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 9,
    borderRadius: 10,
  },
  workflowNavBtnActive: {
    backgroundColor: colors.buttonPrimary,
  },
  workflowNavText: {
    fontSize: 12,
    fontFamily: typography.fonts.bold,
    color: colors.buttonPrimary,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#EEE8F6',
    gap: 10,
    marginBottom: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: typography.fonts.regular,
    color: colors.textPrimary,
  },
  categoryPillsRow: {
    gap: 8,
    paddingBottom: 16,
  },
  catPill: {
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  catPillActive: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.buttonPrimary,
  },
  catPillText: {
    fontSize: 12,
    fontFamily: typography.fonts.medium,
    color: colors.textSecondary,
  },
  catPillTextActive: {
    color: colors.buttonPrimary,
    fontFamily: typography.fonts.bold,
  },
  emptyCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEE8F6',
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary,
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 13,
    fontFamily: typography.fonts.regular,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20,
  },
  emptyAddBtn: {
    backgroundColor: colors.buttonPrimary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  emptyAddBtnText: {
    color: colors.white,
    fontFamily: typography.fonts.bold,
    fontSize: 13,
  },
  termCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EEE8F6',
    marginBottom: 12,
    shadowColor: '#493068',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  termCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 10,
  },
  termNumberBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  termNumberText: {
    fontSize: 12,
    fontFamily: typography.fonts.bold,
    color: colors.buttonPrimary,
  },
  termHeaderCenter: {
    flex: 1,
  },
  termTitle: {
    fontSize: 15,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  categoryTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  categoryTagText: {
    fontSize: 10,
    fontFamily: typography.fonts.medium,
    color: colors.textSecondary,
  },
  standardTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  standardTagText: {
    fontSize: 10,
    fontFamily: typography.fonts.bold,
    color: '#059669',
  },
  termActions: {
    flexDirection: 'row',
    gap: 6,
  },
  actionBtnSmall: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#FAF9FD',
  },
  clauseBody: {
    fontSize: 13,
    fontFamily: typography.fonts.regular,
    color: colors.textSecondary,
    lineHeight: 19,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  footerCTA: {
    marginTop: 16,
  },
  fullPreviewBtn: {
    backgroundColor: colors.buttonPrimary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderRadius: 24,
    paddingVertical: 14,
  },
  fullPreviewBtnText: {
    color: colors.white,
    fontFamily: typography.fonts.bold,
    fontSize: 14,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#FAF9FD',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EFF6',
  },
  modalHeaderTitle: {
    fontSize: 18,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary,
  },
  modalScroll: {
    flex: 1,
  },
  modalScrollContent: {
    padding: 20,
  },
  formSectionLabel: {
    fontSize: 12,
    fontFamily: typography.fonts.bold,
    color: colors.textMuted,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  templatePill: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.buttonPrimary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    marginRight: 8,
  },
  templatePillText: {
    fontSize: 12,
    fontFamily: typography.fonts.medium,
    color: colors.buttonPrimary,
  },
  formLabel: {
    fontSize: 13,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  formTextArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  catGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  catGridOption: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  catGridOptionActive: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.buttonPrimary,
  },
  catGridText: {
    fontSize: 12,
    fontFamily: typography.fonts.medium,
    color: colors.textSecondary,
  },
  catGridTextActive: {
    color: colors.buttonPrimary,
    fontFamily: typography.fonts.bold,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 20,
  },
  switchTitle: {
    fontSize: 13,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary,
  },
  switchSub: {
    fontSize: 11,
    fontFamily: typography.fonts.regular,
    color: colors.textSecondary,
    marginTop: 2,
    paddingRight: 10,
  },
  saveClauseBtn: {
    backgroundColor: colors.buttonPrimary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 24,
    paddingVertical: 14,
  },
  saveClauseBtnText: {
    color: colors.white,
    fontFamily: typography.fonts.bold,
    fontSize: 14,
  },
  // Delete confirm modal
  confirmOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  confirmBox: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  deleteIconBadge: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  confirmTitle: {
    fontSize: 17,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary,
    marginBottom: 6,
  },
  confirmSubtitle: {
    fontSize: 13,
    fontFamily: typography.fonts.regular,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  confirmClauseSnippet: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    width: '100%',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 18,
  },
  confirmSnippetTitle: {
    fontSize: 13,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  confirmSnippetText: {
    fontSize: 11,
    fontFamily: typography.fonts.regular,
    color: colors.textSecondary,
  },
  confirmButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  cancelConfirmBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelConfirmText: {
    fontSize: 13,
    fontFamily: typography.fonts.medium,
    color: colors.textSecondary,
  },
  deleteConfirmBtn: {
    flex: 1.2,
    backgroundColor: '#DC2626',
    borderRadius: 20,
    paddingVertical: 12,
    alignItems: 'center',
  },
  deleteConfirmText: {
    fontSize: 13,
    fontFamily: typography.fonts.bold,
    color: colors.white,
  },
});

export default ContractTermsScreen;
