import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { MotionModal as Modal } from '@/components/ui/Motion';
import { useAppContext } from '@/context/AppContext';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { ProjectTerm } from '@/types';

const CATEGORIES: ('All' | 'Scope & Revisions' | 'Payment & Late Fees' | 'Intellectual Property' | 'Termination' | 'General')[] = [
  'All',
  'Scope & Revisions',
  'Payment & Late Fees',
  'Intellectual Property',
  'General',
];

export const ProjectTermsModal: React.FC = () => {
  const insets = useSafeAreaInsets();
  const {
    activeModal,
    closeModal,
    selectedProjectId,
    projects,
    addProjectTerm,
    updateProjectTerm,
    deleteProjectTerm,
  } = useAppContext();

  const isVisible = activeModal === 'project_terms';
  const project =
    projects.find((p) => p.id === selectedProjectId) || projects[0];

  const terms: ProjectTerm[] = project?.terms || [];

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Editing / Creating State
  const [isEditing, setIsEditing] = useState(false);
  const [editingTermId, setEditingTermId] = useState<string | null>(null);
  const [termTitle, setTermTitle] = useState('');
  const [termClause, setTermClause] = useState('');
  const [termCategory, setTermCategory] = useState<
    'Scope & Revisions' | 'Payment & Late Fees' | 'Intellectual Property' | 'Termination' | 'General'
  >('Scope & Revisions');
  const [termIsStandard, setTermIsStandard] = useState(false);

  // Viewing detail clause modal/state
  const [viewingTerm, setViewingTerm] = useState<ProjectTerm | null>(null);

  const handleOpenAdd = () => {
    setEditingTermId(null);
    setTermTitle('');
    setTermClause('');
    setTermCategory('Scope & Revisions');
    setTermIsStandard(false);
    setIsEditing(true);
  };

  const handleOpenEdit = (term: ProjectTerm) => {
    setEditingTermId(term.id);
    setTermTitle(term.title);
    setTermClause(term.clause);
    setTermCategory(term.category || 'General');
    setTermIsStandard(term.isStandard || false);
    setIsEditing(true);
  };

  const handleSaveTerm = () => {
    if (!termTitle.trim()) {
      Alert.alert('Required Field', 'Please enter a title for the term or clause.');
      return;
    }
    if (!termClause.trim()) {
      Alert.alert('Required Field', 'Please enter the clause terms and details.');
      return;
    }

    if (editingTermId) {
      updateProjectTerm(project.id, editingTermId, {
        title: termTitle.trim(),
        clause: termClause.trim(),
        category: termCategory,
        isStandard: termIsStandard,
      });
      Alert.alert('Clause Updated', `"${termTitle}" has been saved successfully.`);
    } else {
      addProjectTerm(project.id, {
        title: termTitle.trim(),
        clause: termClause.trim(),
        category: termCategory,
        isStandard: termIsStandard,
      });
      Alert.alert('Clause Added', `"${termTitle}" added to ${project.title}.`);
    }

    setIsEditing(false);
    setEditingTermId(null);
  };

  const handleDeleteTerm = (term: ProjectTerm) => {
    Alert.alert(
      'Delete Clause',
      `Are you sure you want to remove "${term.title}" from this agreement?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteProjectTerm(project.id, term.id);
            if (viewingTerm?.id === term.id) setViewingTerm(null);
          },
        },
      ]
    );
  };

  const filteredTerms = terms.filter((t) => {
    const matchesCategory =
      selectedCategory === 'All' || t.category === selectedCategory;
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.clause.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle={Platform.OS === 'ios' ? 'pageSheet' : 'fullScreen'}
      onRequestClose={closeModal}
    >
      <View style={[styles.container, { paddingTop: Math.max(insets.top, 16) }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={closeModal}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather name="x" size={22} color={colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerTitleBox}>
            <Text style={styles.headerTitle}>Contract & Project Terms</Text>
            <Text style={styles.headerSubtitle} numberOfLines={1}>
              {project?.title || 'Project Terms'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={handleOpenAdd}
            activeOpacity={0.8}
          >
            <Feather name="plus" size={18} color={colors.white} />
          </TouchableOpacity>
        </View>

        {isEditing ? (
          /* EDIT / CREATE TERM VIEW (Selected Variant: Focused, Essential fields, Guidance) */
          <ScrollView
            style={styles.scrollArea}
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: Math.max(insets.bottom, 24) + 60 },
            ]}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.editCard}>
              <Text style={styles.editTitle}>
                {editingTermId ? 'Edit Contract Clause' : 'Add New Clause'}
              </Text>
              <Text style={styles.editSubtitle}>
                Clear contractual clauses protect deliverables and outline scope parameters.
              </Text>

              {/* Title Field */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Clause Title *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Revision Limits & Out-of-Scope Rates"
                  placeholderTextColor={colors.textMuted}
                  value={termTitle}
                  onChangeText={setTermTitle}
                />
              </View>

              {/* Category */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Category</Text>
                <View style={styles.categoryPickerRow}>
                  {(
                    [
                      'Scope & Revisions',
                      'Payment & Late Fees',
                      'Intellectual Property',
                      'General',
                    ] as const
                  ).map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.catOption,
                        termCategory === cat && styles.catOptionActive,
                      ]}
                      onPress={() => setTermCategory(cat)}
                    >
                      <Text
                        style={[
                          styles.catOptionText,
                          termCategory === cat && styles.catOptionTextActive,
                        ]}
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Clause Body */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Clause Terms & Specifics *</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Describe the condition, scope rule, turnaround expectation, or revision policy..."
                  placeholderTextColor={colors.textMuted}
                  value={termClause}
                  onChangeText={setTermClause}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
                <Text style={styles.guidanceHint}>
                  <Feather name="info" size={12} color={colors.buttonPrimary} /> Tip: Keep clauses concise, actionable, and specific with numbers and deadlines.
                </Text>
              </View>

              {/* Buttons */}
              <View style={styles.editActionsRow}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => setIsEditing(false)}
                >
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.saveBtn}
                  onPress={handleSaveTerm}
                  activeOpacity={0.8}
                >
                  <Feather name="check" size={16} color={colors.white} />
                  <Text style={styles.saveBtnText}>
                    {editingTermId ? 'Save Changes' : 'Add Clause'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        ) : viewingTerm ? (
          /* VIEW CLAUSE DETAIL VIEW */
          <ScrollView
            style={styles.scrollArea}
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: Math.max(insets.bottom, 24) + 60 },
            ]}
          >
            <View style={styles.detailCard}>
              <View style={styles.detailTop}>
                <View style={styles.catBadge}>
                  <Text style={styles.catBadgeText}>
                    {viewingTerm.category || 'Standard Clause'}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setViewingTerm(null)}>
                  <Feather name="x" size={20} color={colors.textMuted} />
                </TouchableOpacity>
              </View>

              <Text style={styles.detailTitle}>{viewingTerm.title}</Text>
              <Text style={styles.detailBody}>{viewingTerm.clause}</Text>

              <View style={styles.detailActions}>
                <TouchableOpacity
                  style={styles.editActionBtn}
                  onPress={() => {
                    handleOpenEdit(viewingTerm);
                    setViewingTerm(null);
                  }}
                >
                  <Feather name="edit-2" size={15} color={colors.buttonPrimary} />
                  <Text style={styles.editActionText}>Edit Clause</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteActionBtn}
                  onPress={() => handleDeleteTerm(viewingTerm)}
                >
                  <Feather name="trash-2" size={15} color="#E53935" />
                  <Text style={styles.deleteActionText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        ) : (
          /* CLAUSE LIST VIEW (Selected Variant: Simple, clear, action-focused) */
          <ScrollView
            style={styles.scrollArea}
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: Math.max(insets.bottom, 24) + 60 },
            ]}
            showsVerticalScrollIndicator={false}
          >
            {/* Search Input */}
            <View style={styles.searchBox}>
              <Feather name="search" size={16} color={colors.textMuted} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search clauses..."
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

            {/* Category Filter Pills */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.catFilterRow}
            >
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.catFilterPill,
                    selectedCategory === cat && styles.catFilterPillActive,
                  ]}
                  onPress={() => setSelectedCategory(cat)}
                >
                  <Text
                    style={[
                      styles.catFilterPillText,
                      selectedCategory === cat && styles.catFilterPillTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Terms List */}
            {filteredTerms.length === 0 ? (
              <View style={styles.emptyCard}>
                <MaterialCommunityIcons
                  name="file-document-outline"
                  size={42}
                  color={colors.textMuted}
                />
                <Text style={styles.emptyTitle}>No terms found</Text>
                <Text style={styles.emptyText}>
                  Add key contract clauses for revisions, IP transfer, or milestone schedules.
                </Text>
                <TouchableOpacity
                  style={styles.emptyAddBtn}
                  onPress={handleOpenAdd}
                >
                  <Feather name="plus" size={16} color={colors.white} />
                  <Text style={styles.emptyAddBtnText}>Add Clause</Text>
                </TouchableOpacity>
              </View>
            ) : (
              filteredTerms.map((term, index) => (
                <View key={term.id} style={styles.termCard}>
                  <View style={styles.termHeader}>
                    <View style={styles.termCategoryTag}>
                      <Text style={styles.termCategoryTagText}>
                        {term.category || 'General'}
                      </Text>
                    </View>
                    <Text style={styles.termIndexText}>Clause #{index + 1}</Text>
                  </View>

                  <Text style={styles.termCardTitle}>{term.title}</Text>
                  <Text style={styles.termCardClause} numberOfLines={2}>
                    {term.clause}
                  </Text>

                  {/* Actions Row: View, Edit, Delete */}
                  <View style={styles.termActionsRow}>
                    <TouchableOpacity
                      style={styles.termActionBtn}
                      onPress={() => setViewingTerm(term)}
                    >
                      <Feather name="eye" size={14} color={colors.textSecondary} />
                      <Text style={styles.termActionText}>View</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.termActionBtn}
                      onPress={() => handleOpenEdit(term)}
                    >
                      <Feather name="edit-2" size={14} color={colors.buttonPrimary} />
                      <Text style={[styles.termActionText, { color: colors.buttonPrimary }]}>
                        Edit
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.termActionBtn}
                      onPress={() => handleDeleteTerm(term)}
                    >
                      <Feather name="trash-2" size={14} color="#E53935" />
                      <Text style={[styles.termActionText, { color: '#E53935' }]}>
                        Delete
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleBox: {
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: 17,
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontFamily: typography.fonts.regular,
    fontSize: 12,
    color: colors.textSecondary,
    maxWidth: 200,
  },
  addBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.buttonPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ECE8F4',
    gap: 8,
    marginBottom: 14,
  },
  searchInput: {
    flex: 1,
    fontFamily: typography.fonts.regular,
    fontSize: 14,
    color: colors.textPrimary,
  },
  catFilterRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  catFilterPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#E7E2F0',
    marginRight: 8,
  },
  catFilterPillActive: {
    backgroundColor: colors.buttonPrimary,
    borderColor: colors.buttonPrimary,
  },
  catFilterPillText: {
    fontFamily: typography.fonts.medium,
    fontSize: 12,
    color: colors.textSecondary,
  },
  catFilterPillTextActive: {
    color: colors.white,
    fontFamily: typography.fonts.bold,
  },
  termCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EFEBF5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  termHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  termCategoryTag: {
    backgroundColor: '#F3EEFB',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  termCategoryTagText: {
    fontFamily: typography.fonts.bold,
    fontSize: 11,
    color: colors.buttonPrimary,
  },
  termIndexText: {
    fontFamily: typography.fonts.regular,
    fontSize: 11,
    color: colors.textMuted,
  },
  termCardTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: 15,
    color: colors.textPrimary,
    marginBottom: 6,
  },
  termCardClause: {
    fontFamily: typography.fonts.regular,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 14,
  },
  termActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#F7F6FA',
    paddingTop: 10,
    gap: 16,
  },
  termActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  termActionText: {
    fontFamily: typography.fonts.medium,
    fontSize: 12,
    color: colors.textSecondary,
  },
  editCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#EFEBF5',
  },
  editTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  editSubtitle: {
    fontFamily: typography.fonts.regular,
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontFamily: typography.fonts.bold,
    fontSize: 13,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FAF8FD',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E7E2F0',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: typography.fonts.regular,
    fontSize: 14,
    color: colors.textPrimary,
  },
  textArea: {
    height: 100,
  },
  guidanceHint: {
    fontFamily: typography.fonts.regular,
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 6,
  },
  categoryPickerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  catOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#F5F3FA',
  },
  catOptionActive: {
    backgroundColor: colors.buttonPrimary,
  },
  catOptionText: {
    fontFamily: typography.fonts.medium,
    fontSize: 12,
    color: colors.textSecondary,
  },
  catOptionTextActive: {
    color: colors.white,
    fontFamily: typography.fonts.bold,
  },
  editActionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#F3EEFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontFamily: typography.fonts.bold,
    fontSize: 14,
    color: colors.buttonPrimary,
  },
  saveBtn: {
    flex: 2,
    flexDirection: 'row',
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: colors.buttonPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  saveBtnText: {
    fontFamily: typography.fonts.bold,
    fontSize: 14,
    color: colors.white,
  },
  detailCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#EFEBF5',
  },
  detailTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  catBadge: {
    backgroundColor: '#F3EEFB',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
  },
  catBadgeText: {
    fontFamily: typography.fonts.bold,
    fontSize: 12,
    color: colors.buttonPrimary,
  },
  detailTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  detailBody: {
    fontFamily: typography.fonts.regular,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 24,
  },
  detailActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: '#F7F6FA',
    paddingTop: 16,
  },
  editActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#F3EEFB',
  },
  editActionText: {
    fontFamily: typography.fonts.bold,
    fontSize: 13,
    color: colors.buttonPrimary,
  },
  deleteActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#FFEBEE',
  },
  deleteActionText: {
    fontFamily: typography.fonts.bold,
    fontSize: 13,
    color: '#E53935',
  },
  emptyCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EFEBF5',
    marginTop: 20,
  },
  emptyTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: 16,
    color: colors.textPrimary,
    marginTop: 12,
    marginBottom: 6,
  },
  emptyText: {
    fontFamily: typography.fonts.regular,
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
  },
  emptyAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.buttonPrimary,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
  },
  emptyAddBtnText: {
    fontFamily: typography.fonts.bold,
    fontSize: 13,
    color: colors.white,
  },
});

export default ProjectTermsModal;
