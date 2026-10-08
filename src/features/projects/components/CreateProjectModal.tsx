import { ScreenBackdrop } from '@/components/ui/Surface';
import { dateKey } from '@/utils/dates';
import { MotionTouchable as TouchableOpacity, MotionModal as Modal } from '@/components/ui/Motion';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Switch,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useAppContext } from '@/context/AppContext';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';

export const CreateProjectModal: React.FC = () => {
  const insets = useSafeAreaInsets();
  const {
    activeModal,
    closeModal,
    clients,
    addProject,
    openAddClientModal,
    openProjectDetailsModal,
    lastCreatedClientId,
  } = useAppContext();

  const isVisible = activeModal === 'create_project';

  const [projectName, setProjectName] = useState('');
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const activeClientId = selectedClientId || lastCreatedClientId || clients[0]?.id || '';
  const [scopeNotes, setScopeNotes] = useState('');
  const [startDate, setStartDate] = useState(() => dateKey());
  const [deadline, setDeadline] = useState(() => dateKey(new Date(Date.now() + 30 * 86400000)));
  const [budget, setBudget] = useState('');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('High');
  const [shareWithClient, setShareWithClient] = useState(true);

  // Milestones list
  const [milestones, setMilestones] = useState<
    { id: string; title: string; dueDate: string }[]
  >([]);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [showAddMilestoneInput, setShowAddMilestoneInput] = useState(false);
  const [errors, setErrors] = useState<{ projectName?: string; budget?: string }>({});

  const handleAddMilestone = () => {
    if (!newMilestoneTitle.trim()) return;
    setMilestones((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        title: newMilestoneTitle.trim(),
        dueDate: deadline || '30 Oct 2026',
      },
    ]);
    setNewMilestoneTitle('');
    setShowAddMilestoneInput(false);
  };

  const handleRemoveMilestone = (id: string) => {
    setMilestones((prev) => prev.filter((m) => m.id !== id));
  };

  const handleSubmit = () => {
    if (!projectName.trim()) {
      setErrors({ projectName: 'Please enter a project name' });
      Alert.alert('Required Field', 'Please enter a project name to continue.');
      return;
    }
    const numBudget = budget.trim() ? Number(budget) : 0;
    if (!Number.isFinite(numBudget) || numBudget < 0) {
      setErrors({ budget: 'Enter a valid non-negative budget.' });
      Alert.alert('Invalid Budget', 'Please enter a valid budget amount.');
      return;
    }
    const chosenClientId = activeClientId || clients[0]?.id || 'cl_direct';

    try {
      const created = addProject({
        title: projectName.trim(),
        clientId: chosenClientId,
        scopeNotes: scopeNotes.trim(),
        budget: numBudget,
        priority,
        startDate: startDate || dateKey(),
        dueDate: deadline || dateKey(new Date(Date.now() + 30 * 86400000)),
        milestones: milestones.map((m, idx) => ({
          id: `ms_init_${Date.now()}_${idx}`,
          title: m.title,
          dueDate: m.dueDate,
          status: 'pending' as const,
          order: idx + 1,
        })),
      });

      closeModal();
      // Reset form
      setProjectName('');
      setScopeNotes('');
      setBudget('');
      setMilestones([]);
      setErrors({});
      Alert.alert('Project Created', `Project "${created.title}" has been created successfully!`);
      openProjectDetailsModal(created.id);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unable to create project.';
      setErrors({ projectName: msg });
      Alert.alert('Error', msg);
    }
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
          <Text style={styles.headerTitle}>Create project</Text>
          <TouchableOpacity
            style={styles.headerRight}
            onPress={closeModal}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
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
          {/* Cover & Branding Card */}
          <Text style={styles.sectionLabel}>Cover & Branding (Optional)</Text>
          <TouchableOpacity style={styles.uploadCard} activeOpacity={0.7}>
            <View style={styles.uploadIconBox}>
              <Feather name="image" size={24} color={colors.buttonPrimary} />
            </View>
            <Text style={styles.uploadTitle}>Upload project cover or client logo</Text>
            <Text style={styles.uploadSubtitle}>PNG, JPG, or SVG up to 5MB</Text>
          </TouchableOpacity>

          {/* Project Name */}
          <View style={styles.fieldRowHeader}>
            <Text style={styles.fieldLabel}>
              Project name <Text style={styles.requiredAsterisk}>*</Text>
            </Text>
            <TouchableOpacity
              onPress={() => {
                setProjectName('Apex Mobile App');
                setBudget('250000');
                setScopeNotes('Mobile application design, branding, and cross-platform frontend.');
              }}
            >
              <Text style={{ fontSize: 12, color: colors.buttonPrimary, fontFamily: typography.fonts.bold }}>
                ⚡ Quick Fill
              </Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={[styles.input, errors.projectName && styles.inputError]}
            placeholder="e.g. CeylonBites Brand & Website"
            placeholderTextColor={colors.textMuted}
            value={projectName}
            maxLength={60}
            onChangeText={(text) => {
              setProjectName(text);
              if (errors.projectName) setErrors({});
            }}
          />
          {errors.projectName && (
            <Text style={styles.errorText}>{errors.projectName}</Text>
          )}

          {/* Client Selection */}
          <View style={styles.fieldRowHeader}>
            <Text style={styles.fieldLabel}>
              Client <Text style={styles.requiredAsterisk}>*</Text>
            </Text>
            <TouchableOpacity onPress={() => openAddClientModal('create_project')}>
              <Text style={styles.addClientLink}>+ Add new client</Text>
            </TouchableOpacity>
          </View>

          {/* Client Picker Carousel */}
          {clients.length === 0 ? (
            <TouchableOpacity
              style={styles.emptyClientsNotice}
              onPress={() => openAddClientModal('create_project')}
            >
              <Ionicons name="person-add-outline" size={18} color={colors.buttonPrimary} />
              <Text style={styles.emptyClientsNoticeText}>
                No clients added yet. Tap here to add your first client.
              </Text>
            </TouchableOpacity>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.clientPickerScroll}
            >
              {clients.map((c) => {
                const isSelected = c.id === activeClientId;
                return (
                  <TouchableOpacity
                    key={c.id}
                    style={[
                      styles.clientCardOption,
                      isSelected && styles.clientCardOptionSelected,
                    ]}
                    onPress={() => setSelectedClientId(c.id)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.clientAvatarMini}>
                      <Text style={styles.clientAvatarMiniText}>
                        {c.initials || c.name.slice(0, 2).toUpperCase()}
                      </Text>
                    </View>
                    <View style={styles.clientOptionDetails}>
                      <Text
                        style={[
                          styles.clientOptionName,
                          isSelected && styles.clientOptionNameSelected,
                        ]}
                        numberOfLines={1}
                      >
                        {c.name}
                      </Text>
                      <Text style={styles.clientOptionCompany} numberOfLines={1}>
                        {c.companyName}
                      </Text>
                    </View>
                    {isSelected && (
                      <Ionicons
                        name="checkmark-circle"
                        size={18}
                        color={colors.buttonPrimary}
                        style={{ marginLeft: 6 }}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}

          {/* Project Scope & Notes */}
          <Text style={styles.fieldLabel}>Project scope & notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Complete brand identity system, packaging guidelines, and responsive web platform."
            placeholderTextColor={colors.textMuted}
            value={scopeNotes}
            onChangeText={setScopeNotes}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          {/* Schedule */}
          <Text style={styles.fieldLabel}>Schedule</Text>
          <View style={styles.scheduleRow}>
            <View style={styles.scheduleBox}>
              <Text style={styles.scheduleBoxLabel}>Start Date</Text>
              <View style={styles.scheduleBoxInputRow}>
                <Feather name="calendar" size={16} color={colors.buttonPrimary} />
                <TextInput
                  style={styles.scheduleInput}
                  value={startDate}
                  onChangeText={setStartDate}
                />
              </View>
            </View>

            <View style={[styles.scheduleBox, styles.scheduleBoxDeadline]}>
              <Text style={styles.scheduleBoxLabel}>
                Deadline <Text style={styles.requiredAsterisk}>*</Text>
              </Text>
              <View style={styles.scheduleBoxInputRow}>
                <Feather name="flag" size={16} color={colors.buttonPrimary} />
                <TextInput
                  style={styles.scheduleInput}
                  value={deadline}
                  onChangeText={setDeadline}
                />
              </View>
            </View>
          </View>

          {/* Budget & Valuation */}
          <Text style={styles.fieldLabel}>
            Budget & Valuation <Text style={styles.requiredAsterisk}>*</Text>
          </Text>
          <View style={styles.budgetRow}>
            <View style={styles.currencyTag}>
              <Text style={styles.currencyText}>LKR</Text>
            </View>
            <TextInput
              style={[styles.input, styles.budgetInput]}
              value={budget}
              onChangeText={setBudget}
              keyboardType="numeric"
              placeholder="180,000"
              placeholderTextColor={colors.textMuted}
            />
          </View>

          {/* Priority */}
          <Text style={styles.fieldLabel}>
            Priority <Text style={styles.requiredAsterisk}>*</Text>
          </Text>
          <View style={styles.priorityRow}>
            {(['Low', 'Medium', 'High'] as const).map((p) => {
              const isSelected = priority === p;
              return (
                <TouchableOpacity
                  key={p}
                  style={[
                    styles.priorityPill,
                    isSelected && styles.priorityPillSelected,
                  ]}
                  onPress={() => setPriority(p)}
                >
                  {p === 'High' && (
                    <Feather
                      name="zap"
                      size={14}
                      color={isSelected ? colors.white : colors.textSecondary}
                      style={{ marginRight: 4 }}
                    />
                  )}
                  <Text
                    style={[
                      styles.priorityPillText,
                      isSelected && styles.priorityPillTextSelected,
                    ]}
                  >
                    {p}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Milestones */}
          <View style={styles.fieldRowHeader}>
            <Text style={styles.fieldLabel}>Milestones</Text>
            <Text style={styles.charCount}>{milestones.length} stages</Text>
          </View>

          <View style={styles.milestonesList}>
            {milestones.map((m, idx) => (
              <View key={m.id} style={styles.milestoneItemCard}>
                <View style={styles.milestoneItemLeft}>
                  <View style={styles.milestoneNumberBox}>
                    <Text style={styles.milestoneNumberText}>{idx + 1}</Text>
                  </View>
                  <View style={styles.milestoneInfo}>
                    <Text style={styles.milestoneTitle}>{m.title}</Text>
                    <Text style={styles.milestoneDueDate}>Due: {m.dueDate}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => handleRemoveMilestone(m.id)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Feather name="trash-2" size={16} color={colors.textMuted} />
                </TouchableOpacity>
              </View>
            ))}

            {showAddMilestoneInput ? (
              <View style={styles.addMilestoneBox}>
                <TextInput
                  style={styles.addMilestoneInput}
                  placeholder="Enter milestone title..."
                  value={newMilestoneTitle}
                  onChangeText={setNewMilestoneTitle}
                  autoFocus
                />
                <View style={styles.addMilestoneActions}>
                  <TouchableOpacity
                    style={styles.addMilestoneSaveBtn}
                    onPress={handleAddMilestone}
                  >
                    <Text style={styles.addMilestoneSaveText}>Add</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.addMilestoneCancelBtn}
                    onPress={() => setShowAddMilestoneInput(false)}
                  >
                    <Text style={styles.addMilestoneCancelText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.addMilestoneDashedBtn}
                onPress={() => setShowAddMilestoneInput(true)}
              >
                <Feather name="plus-circle" size={16} color={colors.buttonPrimary} />
                <Text style={styles.addMilestoneDashedText}>+ Add milestone</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Share project with client */}
          <View style={styles.shareCard}>
            <View style={styles.shareLeft}>
              <Text style={styles.shareTitle}>Share project with client</Text>
              <Text style={styles.shareSubtitle}>
                The client can view shared progress, files, and deliverables. Internal notes remain private.
              </Text>
            </View>
            <Switch
              value={shareWithClient}
              onValueChange={setShareWithClient}
              trackColor={{ false: '#E5E7EB', true: colors.buttonPrimary }}
              thumbColor={colors.white}
            />
          </View>
          {/* Prominent In-Form Create Project Button */}
          <View style={{ marginTop: 20, marginBottom: 8 }}>
            <TouchableOpacity
              style={styles.inFormCreateBtn}
              onPress={handleSubmit}
              activeOpacity={0.8}
            >
              <Ionicons name="rocket-outline" size={20} color={colors.white} />
              <Text style={styles.createProjectBtnText}>Create project</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Bottom Actions Bar */}
        <View
          style={[
            styles.bottomBar,
            { paddingBottom: Math.max(insets.bottom, 16) },
          ]}
        >
          <TouchableOpacity style={styles.cancelBtn} onPress={closeModal}>
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.createProjectBtn}
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <Ionicons name="rocket-outline" size={18} color={colors.white} />
            <Text style={styles.createProjectBtnText}>Create project</Text>
          </TouchableOpacity>
        </View>
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
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EFF6',
    backgroundColor: colors.white,
    paddingBottom: 16,
  },
  inFormCreateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.buttonPrimary,
    borderRadius: 24,
    paddingVertical: 16,
    shadowColor: '#493068',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary
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
  sectionLabel: {
    fontSize: 13,
    fontFamily: typography.fonts.medium,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  uploadCard: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#D4CBE5',
    backgroundColor: '#F8F6FC',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    marginBottom: 20,
  },
  uploadIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#EDE7F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  uploadTitle: {
    fontSize: 14,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  uploadSubtitle: {
    fontSize: 12,
    fontFamily: typography.fonts.regular,
    color: colors.textSecondary,
  },
  fieldRowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
    marginTop: 4,
  },
  fieldLabel: {
    fontSize: 13,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary,
    marginBottom: 6,
    marginTop: 12,
  },
  requiredAsterisk: {
    color: '#E11D48',
  },
  charCount: {
    fontSize: 12,
    fontFamily: typography.fonts.regular,
    color: colors.textMuted,
  },
  addClientLink: {
    fontSize: 12,
    fontFamily: typography.fonts.bold,
    color: colors.buttonPrimary,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: typography.fonts.medium,
    color: colors.textPrimary,
    minHeight: 48
  },
  inputError: {
    borderColor: '#E11D48',
  },
  errorText: {
    fontSize: 12,
    color: '#E11D48',
    marginTop: 4,
  },
  textArea: {
    minHeight: 80,
    lineHeight: 20,
  },
  clientPickerScroll: {
    marginBottom: 10,
  },
  emptyClientsNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FAF8FE',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#DDD6FE',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  emptyClientsNoticeText: {
    fontSize: 12,
    fontFamily: typography.fonts.medium,
    color: colors.buttonPrimary,
    flex: 1,
  },
  clientCardOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 10,
    minWidth: 170,
  },
  clientCardOptionSelected: {
    borderColor: colors.buttonPrimary,
    backgroundColor: '#F7F5FC',
  },
  clientAvatarMini: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#EDE7F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  clientAvatarMiniText: {
    fontSize: 12,
    fontFamily: typography.fonts.bold,
    color: colors.buttonPrimary,
  },
  clientOptionDetails: {
    flex: 1,
  },
  clientOptionName: {
    fontSize: 13,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary,
  },
  clientOptionNameSelected: {
    color: colors.buttonPrimary,
  },
  clientOptionCompany: {
    fontSize: 11,
    fontFamily: typography.fonts.regular,
    color: colors.textSecondary,
  },
  scheduleRow: {
    flexDirection: 'row',
    gap: 12,
  },
  scheduleBox: {
    flex: 1,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
  },
  scheduleBoxDeadline: {
    borderColor: '#DDD6FE',
    backgroundColor: '#FAF8FE',
  },
  scheduleBoxLabel: {
    fontSize: 11,
    fontFamily: typography.fonts.medium,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  scheduleBoxInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  scheduleInput: {
    fontSize: 13,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary,
    padding: 0,
    flex: 1,
  },
  budgetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  currencyTag: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currencyText: {
    fontSize: 13,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary,
  },
  budgetInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: typography.fonts.bold,
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    paddingVertical: 10,
  },
  priorityPillSelected: {
    backgroundColor: colors.buttonPrimary,
    borderColor: colors.buttonPrimary,
  },
  priorityPillText: {
    fontSize: 13,
    fontFamily: typography.fonts.medium,
    color: colors.textSecondary,
  },
  priorityPillTextSelected: {
    color: colors.white,
    fontFamily: typography.fonts.bold,
  },
  milestonesList: {
    gap: 8,
  },
  milestoneItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
  },
  milestoneItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  milestoneNumberBox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EDE7F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  milestoneNumberText: {
    fontSize: 11,
    fontFamily: typography.fonts.bold,
    color: colors.buttonPrimary,
  },
  milestoneInfo: {
    flex: 1,
  },
  milestoneTitle: {
    fontSize: 13,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary,
  },
  milestoneDueDate: {
    fontSize: 11,
    fontFamily: typography.fonts.regular,
    color: colors.textMuted,
  },
  addMilestoneDashedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#D4CBE5',
    borderRadius: 12,
    paddingVertical: 12,
  },
  addMilestoneDashedText: {
    fontSize: 13,
    fontFamily: typography.fonts.bold,
    color: colors.buttonPrimary,
  },
  addMilestoneBox: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.buttonPrimary,
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  addMilestoneInput: {
    fontSize: 13,
    fontFamily: typography.fonts.medium,
    color: colors.textPrimary,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EFF6',
    paddingBottom: 6,
  },
  addMilestoneActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  addMilestoneSaveBtn: {
    backgroundColor: colors.buttonPrimary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addMilestoneSaveText: {
    color: colors.white,
    fontSize: 12,
    fontFamily: typography.fonts.bold,
  },
  addMilestoneCancelBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  addMilestoneCancelText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  shareCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#EEE8F6',
    borderRadius: 22,
    padding: 14,
    marginTop: 16,
    shadowColor: '#493068',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3
  },
  shareLeft: {
    flex: 1,
    paddingRight: 12,
  },
  shareTitle: {
    fontSize: 13,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  shareSubtitle: {
    fontSize: 11,
    fontFamily: typography.fonts.regular,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 14,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: '#F0EFF6',
    gap: 12,
    shadowColor: '#493068',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
  },
  cancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: 14,
    fontFamily: typography.fonts.bold,
    color: colors.textSecondary,
  },
  createProjectBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.buttonPrimary,
    borderRadius: 24,
    paddingVertical: 14,
  },
  createProjectBtnText: {
    fontSize: 14,
    fontFamily: typography.fonts.bold,
    color: colors.white,
  },
});
