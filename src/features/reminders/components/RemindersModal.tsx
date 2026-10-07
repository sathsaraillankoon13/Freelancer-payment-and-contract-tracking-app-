import { ScreenBackdrop } from '@/components/ui/Surface';
import { MotionTouchable as TouchableOpacity, MotionModal as Modal } from '@/components/ui/Motion';
import { dateKey } from '@/utils/dates';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  Switch,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useAppContext } from '@/context/AppContext';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { ReminderItem } from '@/types';
import { BottomTabBar, TabName } from '@/components/navigation/BottomTabBar';

export const RemindersModal: React.FC = () => {
  const insets = useSafeAreaInsets();
  const {
    activeModal,
    closeModal,
    reminders,
    addReminder,
    toggleReminder,
    snoozeReminder,
    deleteReminder,
    projects,
    activeTab: mainActiveTab,
    setActiveTab: setMainActiveTab,
  } = useAppContext();

  const isVisible = activeModal === 'reminders';

  const [filterTab, setFilterTab] = useState<'all' | 'pending' | 'completed'>('pending');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newNote, setNewNote] = useState('');
  const [newDate, setNewDate] = useState(() => dateKey());
  const [newNotify, setNewNotify] = useState(true);
  const [newType, setNewType] = useState<ReminderItem['type']>('personal');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');

  const filteredReminders = reminders.filter((r) => {
    if (filterTab === 'pending') return r.status === 'pending' || r.status === 'snoozed';
    if (filterTab === 'completed') return r.status === 'completed';
    return true;
  });

  const handleCreate = () => {
    if (!newTitle.trim()) {
      Alert.alert('Validation Error', 'Reminder title is required.');
      return;
    }

    const linkedProj = projects.find((p) => p.id === selectedProjectId);

    addReminder({
      title: newTitle.trim(),
      note: newNote.trim() || undefined,
      dateTime: newDate,
      status: 'pending',
      notify: newNotify,
      type: newType,
      linkedType: linkedProj ? 'project' : undefined,
      linkedId: linkedProj?.id,
      linkedTitle: linkedProj?.title,
    });

    setNewTitle('');
    setNewNote('');
    setSelectedProjectId('');
    setShowAddForm(false);
  };

  const handleDelete = (id: string, title: string) => {
    Alert.alert('Delete Reminder', `Are you sure you want to delete "${title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteReminder(id) },
    ]);
  };

  const handleTabPress = (tab: TabName) => {
    closeModal();
    setMainActiveTab(tab);
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={closeModal}
    >
      <View style={[styles.container, { paddingTop: Math.max(insets.top, 16) }]}>
        <ScreenBackdrop />
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={closeModal}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather name="arrow-left" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Reminders & Calendar</Text>
          <TouchableOpacity
            style={styles.addHeaderBtn}
            onPress={() => setShowAddForm(!showAddForm)}
          >
            <Feather name={showAddForm ? 'x' : 'plus'} size={20} color={colors.buttonPrimary} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom, 24) + 60 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Add Reminder Form */}
          {showAddForm && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>New Reminder</Text>
              
              <Text style={styles.fieldLabel}>Title *</Text>
              <TextInput
                style={styles.input}
                value={newTitle}
                onChangeText={setNewTitle}
                placeholder="e.g. Follow up on client design feedback"
                autoFocus
              />

              <Text style={styles.fieldLabel}>Date (YYYY-MM-DD)</Text>
              <TextInput
                style={styles.input}
                value={newDate}
                onChangeText={setNewDate}
                placeholder="YYYY-MM-DD"
              />

              <Text style={styles.fieldLabel}>Note (optional)</Text>
              <TextInput
                style={[styles.input, { minHeight: 50 }]}
                value={newNote}
                onChangeText={setNewNote}
                placeholder="Details or checklist..."
                multiline
              />

              {/* Type Selection */}
              <Text style={styles.fieldLabel}>Category</Text>
              <View style={styles.pillRow}>
                {(['personal', 'project', 'deadline'] as const).map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[
                      styles.categoryPill,
                      newType === t && styles.categoryPillSelected,
                    ]}
                    onPress={() => setNewType(t)}
                  >
                    <Text
                      style={[
                        styles.categoryPillText,
                        newType === t && styles.categoryPillTextSelected,
                      ]}
                    >
                      {t === 'personal'
                        ? '👤 Personal'
                        : t === 'project'
                        ? '📁 Project'
                        : '⏰ Deadline'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Optional Project Link */}
              {projects.length > 0 && (
                <>
                  <Text style={styles.fieldLabel}>Link to Project (optional)</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {projects.map((p) => (
                      <TouchableOpacity
                        key={p.id}
                        style={[
                          styles.projectChip,
                          selectedProjectId === p.id && styles.projectChipSelected,
                        ]}
                        onPress={() =>
                          setSelectedProjectId(selectedProjectId === p.id ? '' : p.id)
                        }
                      >
                        <Text
                          style={[
                            styles.projectChipText,
                            selectedProjectId === p.id && styles.projectChipTextSelected,
                          ]}
                        >
                          {p.title}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </>
              )}

              {/* Notify Switch */}
              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Enable push notification</Text>
                <Switch
                  value={newNotify}
                  onValueChange={setNewNotify}
                  trackColor={{ false: '#E5E7EB', true: colors.buttonPrimary }}
                />
              </View>

              <TouchableOpacity style={styles.saveBtn} onPress={handleCreate}>
                <Ionicons name="add-circle-outline" size={18} color={colors.white} />
                <Text style={styles.saveBtnText}>Save Reminder</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Filter Tabs */}
          <View style={styles.filterRow}>
            {(['pending', 'completed', 'all'] as const).map((tab) => {
              const isSelected = filterTab === tab;
              return (
                <TouchableOpacity
                  key={tab}
                  style={[styles.filterPill, isSelected && styles.filterPillSelected]}
                  onPress={() => setFilterTab(tab)}
                >
                  <Text
                    style={[
                      styles.filterPillText,
                      isSelected && styles.filterPillTextSelected,
                    ]}
                  >
                    {tab === 'pending'
                      ? 'Active'
                      : tab === 'completed'
                      ? 'Done'
                      : 'All'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Reminders List */}
          {filteredReminders.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons name="notifications-outline" size={36} color={colors.buttonPrimary} />
              <Text style={styles.emptyTitle}>No reminders in this view</Text>
              <Text style={styles.emptySubtitle}>
                Add reminders to keep track of critical project milestones and client check-ins.
              </Text>
            </View>
          ) : (
            filteredReminders.map((rem) => {
              const isDone = rem.status === 'completed';
              const isSnoozed = rem.status === 'snoozed';

              return (
                <View key={rem.id} style={styles.reminderCard}>
                  <TouchableOpacity
                    style={styles.checkboxTouch}
                    onPress={() => toggleReminder(rem.id)}
                  >
                    <Ionicons
                      name={isDone ? 'checkbox' : 'square-outline'}
                      size={22}
                      color={isDone ? colors.buttonPrimary : colors.textMuted}
                    />
                  </TouchableOpacity>

                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        styles.reminderTitle,
                        isDone && styles.reminderTitleDone,
                      ]}
                    >
                      {rem.title}
                    </Text>
                    {rem.note ? (
                      <Text style={styles.reminderNote}>{rem.note}</Text>
                    ) : null}
                    <View style={styles.metaRow}>
                      <View style={styles.dateTag}>
                        <Feather name="calendar" size={11} color={colors.textSecondary} />
                        <Text style={styles.dateTagText}>
                          {isSnoozed ? `Snoozed until ${rem.snoozedUntil}` : rem.dateTime}
                        </Text>
                      </View>
                      {rem.linkedTitle ? (
                        <View style={styles.projectTag}>
                          <Feather name="folder" size={10} color={colors.buttonPrimary} />
                          <Text style={styles.projectTagText}>{rem.linkedTitle}</Text>
                        </View>
                      ) : null}
                    </View>
                  </View>

                  <View style={styles.actionCol}>
                    {!isDone && (
                      <TouchableOpacity
                        style={styles.snoozeBtn}
                        onPress={() => snoozeReminder(rem.id, 1)}
                      >
                        <Feather name="clock" size={14} color={colors.buttonPrimary} />
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      style={styles.deleteBtn}
                      onPress={() => handleDelete(rem.id, rem.title)}
                    >
                      <Feather name="trash-2" size={14} color={colors.textMuted} />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>

        {/* Persistent Bottom Navigation Bar */}
        <BottomTabBar activeTab={mainActiveTab} onTabPress={handleTabPress} />
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
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EFF6',
    backgroundColor: colors.white,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary,
  },
  addHeaderBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#F3EFFC',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ECEAF5',
  },
  cardTitle: {
    fontSize: 15,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 12,
    fontFamily: typography.fonts.bold,
    color: colors.textSecondary,
    marginBottom: 4,
    marginTop: 8,
  },
  input: {
    backgroundColor: '#F8F7FC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E6E4F0',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: typography.fonts.regular,
    fontSize: 14,
    color: colors.textPrimary,
  },
  pillRow: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  categoryPillSelected: {
    backgroundColor: '#EDE9FE',
  },
  categoryPillText: {
    fontSize: 12,
    fontFamily: typography.fonts.medium,
    color: colors.textSecondary,
  },
  categoryPillTextSelected: {
    color: colors.buttonPrimary,
    fontFamily: typography.fonts.bold,
  },
  projectChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  projectChipSelected: {
    backgroundColor: '#EDE9FE',
    borderWidth: 1,
    borderColor: colors.buttonPrimary,
  },
  projectChipText: {
    fontSize: 11,
    fontFamily: typography.fonts.medium,
    color: colors.textSecondary,
  },
  projectChipTextSelected: {
    color: colors.buttonPrimary,
    fontFamily: typography.fonts.bold,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  switchLabel: {
    fontSize: 13,
    fontFamily: typography.fonts.medium,
    color: colors.textPrimary,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.buttonPrimary,
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 14,
  },
  saveBtnText: {
    fontSize: 14,
    fontFamily: typography.fonts.bold,
    color: colors.white,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#ECEAF5',
  },
  filterPillSelected: {
    backgroundColor: colors.buttonPrimary,
    borderColor: colors.buttonPrimary,
  },
  filterPillText: {
    fontSize: 12,
    fontFamily: typography.fonts.medium,
    color: colors.textSecondary,
  },
  filterPillTextSelected: {
    color: colors.white,
    fontFamily: typography.fonts.bold,
  },
  reminderCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#ECEAF5',
  },
  checkboxTouch: {
    paddingTop: 2,
    paddingRight: 10,
  },
  reminderTitle: {
    fontSize: 14,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary,
  },
  reminderTitleDone: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  reminderNote: {
    fontSize: 12,
    fontFamily: typography.fonts.regular,
    color: colors.textSecondary,
    marginTop: 3,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  dateTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateTagText: {
    fontSize: 11,
    fontFamily: typography.fonts.regular,
    color: colors.textSecondary,
  },
  projectTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F3EFFC',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  projectTagText: {
    fontSize: 10,
    fontFamily: typography.fonts.medium,
    color: colors.buttonPrimary,
  },
  actionCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginLeft: 8,
  },
  snoozeBtn: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: '#F3EFFC',
  },
  deleteBtn: {
    padding: 6,
  },
  emptyCard: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#ECEAF5',
    marginTop: 10,
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary,
    marginTop: 10,
  },
  emptySubtitle: {
    fontSize: 12,
    fontFamily: typography.fonts.regular,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
  },
});
