import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppContext } from '@/context/AppContext';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { TaskItem } from '@/types';
import { ScreenBackdrop } from '@/components/ui/Surface';
import { DatePickerModal } from '@/components/common/DatePickerModal';

export const TasksScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const {
    tasks,
    projects,
    toggleTask,
    deleteTask,
    addTask,
    updateTask,
  } = useAppContext();

  // Search & Filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');

  // Modals
  const [selectedTaskForDetails, setSelectedTaskForDetails] = useState<TaskItem | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<TaskItem | null>(null);
  const [isAddEditModalVisible, setIsAddEditModalVisible] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formProjectId, setFormProjectId] = useState(projects[0]?.id || '');
  const [formPriority, setFormPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [formDueDate, setFormDueDate] = useState('2026-10-15');
  const [formAssignee, setFormAssignee] = useState('Kasun Alwis');
  const [formHours, setFormHours] = useState('3.0');
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Filtered Tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchesSearch =
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (t.projectTitle && t.projectTitle.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesProject = selectedProjectId === 'all' || t.projectId === selectedProjectId;

      let matchesStatus = true;
      if (statusFilter === 'completed') {
        matchesStatus = t.completed || t.status === 'completed';
      } else if (statusFilter === 'in_progress') {
        matchesStatus = !t.completed && t.status === 'in_progress';
      } else if (statusFilter === 'pending') {
        matchesStatus = !t.completed && (t.status === 'pending' || !t.status);
      }

      return matchesSearch && matchesProject && matchesStatus;
    });
  }, [tasks, searchQuery, selectedProjectId, statusFilter]);

  // Stats calculation
  const totalCount = tasks.length;
  const completedCount = tasks.filter((t) => t.completed || t.status === 'completed').length;
  const inProgressCount = tasks.filter((t) => !t.completed && t.status === 'in_progress').length;
  const pendingCount = totalCount - completedCount - inProgressCount;

  // Handlers
  const handleOpenAddModal = () => {
    setEditingTaskId(null);
    setFormTitle('');
    setFormDescription('');
    setFormProjectId(projects[0]?.id || '');
    setFormPriority('Medium');
    setFormDueDate('2026-10-15');
    setFormAssignee('Kasun Alwis');
    setFormHours('2.5');
    setIsAddEditModalVisible(true);
  };

  const handleOpenEditModal = (task: TaskItem) => {
    setEditingTaskId(task.id);
    setFormTitle(task.title);
    setFormDescription(task.description || '');
    setFormProjectId(task.projectId);
    setFormPriority(task.priority || 'Medium');
    setFormDueDate(task.dueDate || '2026-10-15');
    setFormAssignee(task.assignee || 'Kasun Alwis');
    setFormHours(task.estimatedHours ? String(task.estimatedHours) : '2.0');
    setSelectedTaskForDetails(null);
    setIsAddEditModalVisible(true);
  };

  const handleSaveTask = () => {
    if (!formTitle.trim()) {
      Alert.alert('Required Field', 'Please enter a task title.');
      return;
    }

    const selectedProj = projects.find((p) => p.id === formProjectId) || projects[0];

    if (editingTaskId) {
      updateTask(editingTaskId, {
        title: formTitle.trim(),
        description: formDescription.trim(),
        projectId: formProjectId,
        projectTitle: selectedProj?.title || 'Project',
        priority: formPriority,
        dueDate: formDueDate.trim(),
        assignee: formAssignee.trim(),
        estimatedHours: parseFloat(formHours) || 2,
      });
    } else {
      addTask({
        title: formTitle.trim(),
        description: formDescription.trim(),
        projectId: formProjectId,
        projectTitle: selectedProj?.title || 'Project',
        priority: formPriority,
        dueDate: formDueDate.trim(),
        assignee: formAssignee.trim(),
        estimatedHours: parseFloat(formHours) || 2,
        status: 'pending',
        completed: false,
      });
    }

    setIsAddEditModalVisible(false);
  };

  const handleConfirmDelete = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete.id);
      if (selectedTaskForDetails?.id === taskToDelete.id) {
        setSelectedTaskForDetails(null);
      }
      setTaskToDelete(null);
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
            <Text style={styles.headerTitle}>Tasks Management</Text>
            <Text style={styles.headerSubtitle}>
              {completedCount} of {totalCount} tasks completed
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.newTaskHeaderBtn}
          onPress={handleOpenAddModal}
          activeOpacity={0.8}
        >
          <Feather name="plus" size={18} color={colors.white} />
          <Text style={styles.newTaskHeaderBtnText}>New Task</Text>
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
        {/* Metric Summary Cards */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { borderLeftColor: colors.buttonPrimary }]}>
            <Text style={styles.statLabel}>Total</Text>
            <Text style={styles.statNumber}>{totalCount}</Text>
          </View>
          <View style={[styles.statCard, { borderLeftColor: '#10B981' }]}>
            <Text style={styles.statLabel}>Completed</Text>
            <Text style={[styles.statNumber, { color: '#059669' }]}>{completedCount}</Text>
          </View>
          <View style={[styles.statCard, { borderLeftColor: '#F59E0B' }]}>
            <Text style={styles.statLabel}>In Progress</Text>
            <Text style={[styles.statNumber, { color: '#D97706' }]}>{inProgressCount}</Text>
          </View>
          <View style={[styles.statCard, { borderLeftColor: '#6B7280' }]}>
            <Text style={styles.statLabel}>Pending</Text>
            <Text style={[styles.statNumber, { color: '#4B5563' }]}>{pendingCount}</Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBox}>
          <Feather name="search" size={18} color={colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search tasks by name or description..."
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

        {/* Project Selector Horizontal Scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.projectPillsRow}
        >
          <TouchableOpacity
            style={[
              styles.projectPill,
              selectedProjectId === 'all' && styles.projectPillActive,
            ]}
            onPress={() => setSelectedProjectId('all')}
          >
            <Text
              style={[
                styles.projectPillText,
                selectedProjectId === 'all' && styles.projectPillTextActive,
              ]}
            >
              All Projects ({tasks.length})
            </Text>
          </TouchableOpacity>
          {projects.map((proj) => {
            const count = tasks.filter((t) => t.projectId === proj.id).length;
            const isSelected = selectedProjectId === proj.id;
            return (
              <TouchableOpacity
                key={proj.id}
                style={[styles.projectPill, isSelected && styles.projectPillActive]}
                onPress={() => setSelectedProjectId(proj.id)}
              >
                <Text
                  style={[
                    styles.projectPillText,
                    isSelected && styles.projectPillTextActive,
                  ]}
                  numberOfLines={1}
                >
                  {proj.title} ({count})
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Status Filter Tabs */}
        <View style={styles.statusTabsRow}>
          {(['all', 'in_progress', 'pending', 'completed'] as const).map((tab) => {
            const isSelected = statusFilter === tab;
            const label =
              tab === 'all'
                ? 'All'
                : tab === 'in_progress'
                ? 'In Progress'
                : tab === 'pending'
                ? 'Pending'
                : 'Completed';
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.statusTab, isSelected && styles.statusTabActive]}
                onPress={() => setStatusFilter(tab)}
              >
                <Text
                  style={[
                    styles.statusTabText,
                    isSelected && styles.statusTabTextActive,
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Tasks List */}
        {filteredTasks.length === 0 ? (
          <View style={styles.emptyCard}>
            <MaterialCommunityIcons
              name="checkbox-marked-circle-outline"
              size={48}
              color={colors.primaryMedium}
            />
            <Text style={styles.emptyTitle}>No tasks found</Text>
            <Text style={styles.emptySubtitle}>
              Try adjusting your search query, project filter, or add a new task.
            </Text>
            <TouchableOpacity
              style={styles.emptyAddBtn}
              onPress={handleOpenAddModal}
            >
              <Text style={styles.emptyAddBtnText}>+ Create Task</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredTasks.map((task) => {
            const isDone = task.completed || task.status === 'completed';
            const priorityColor =
              task.priority === 'High'
                ? '#DC2626'
                : task.priority === 'Medium'
                ? '#D97706'
                : '#2563EB';

            return (
              <View key={task.id} style={styles.taskCard}>
                <View style={styles.taskCardMainRow}>
                  {/* Completion Checkbox */}
                  <TouchableOpacity
                    style={[
                      styles.checkbox,
                      isDone && styles.checkboxDone,
                    ]}
                    onPress={() => toggleTask(task.id)}
                    activeOpacity={0.7}
                  >
                    {isDone && (
                      <Ionicons name="checkmark" size={16} color={colors.white} />
                    )}
                  </TouchableOpacity>

                  {/* Task Info (Clicking opens details) */}
                  <TouchableOpacity
                    style={styles.taskContentArea}
                    onPress={() => setSelectedTaskForDetails(task)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.taskTitle,
                        isDone && styles.taskTitleDone,
                      ]}
                      numberOfLines={2}
                    >
                      {task.title}
                    </Text>

                    {task.description ? (
                      <Text style={styles.taskDescriptionText} numberOfLines={2}>
                        {task.description}
                      </Text>
                    ) : null}

                    <View style={styles.taskMetaRow}>
                      <View style={styles.taskProjectTag}>
                        <Text style={styles.taskProjectTagText} numberOfLines={1}>
                          {task.projectTitle}
                        </Text>
                      </View>

                      <View
                        style={[
                          styles.taskPriorityTag,
                          { backgroundColor: `${priorityColor}15` },
                        ]}
                      >
                        <Text
                          style={[
                            styles.taskPriorityTagText,
                            { color: priorityColor },
                          ]}
                        >
                          {task.priority || 'Medium'}
                        </Text>
                      </View>

                      {task.dueDate && (
                        <View style={styles.taskDueTag}>
                          <Feather name="calendar" size={11} color={colors.textSecondary} />
                          <Text style={styles.taskDueTagText}>{task.dueDate}</Text>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>

                  {/* Action Menu (Delete & Details) */}
                  <View style={styles.cardActionsCol}>
                    <TouchableOpacity
                      style={styles.iconActionBtn}
                      onPress={() => setSelectedTaskForDetails(task)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Feather name="eye" size={16} color={colors.buttonPrimary} />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.iconActionBtn}
                      onPress={() => setTaskToDelete(task)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Feather name="trash-2" size={16} color="#DC2626" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* ========================================================== */}
      {/* 1. TASK DETAILS VIEW MODAL                                 */}
      {/* ========================================================== */}
      <Modal
        visible={!!selectedTaskForDetails}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedTaskForDetails(null)}
      >
        <View style={[styles.modalContainer, { paddingTop: Math.max(insets.top, 16) }]}>
          <ScreenBackdrop />
          {/* Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setSelectedTaskForDetails(null)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Feather name="arrow-left" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.modalHeaderTitle}>Task Details</Text>
            <TouchableOpacity
              onPress={() => setSelectedTaskForDetails(null)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Feather name="x" size={22} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {selectedTaskForDetails && (
            <ScrollView
              style={styles.modalScroll}
              contentContainerStyle={[
                styles.modalScrollContent,
                { paddingBottom: Math.max(insets.bottom, 24) + 24 },
              ]}
              showsVerticalScrollIndicator={false}
            >
              {/* Task Title Card */}
              <View style={styles.detailsCard}>
                <View style={styles.detailsHeaderRow}>
                  <View
                    style={[
                      styles.statusPillLarge,
                      (selectedTaskForDetails.completed || selectedTaskForDetails.status === 'completed')
                        ? styles.statusPillCompleted
                        : styles.statusPillPending,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusPillTextLarge,
                        (selectedTaskForDetails.completed || selectedTaskForDetails.status === 'completed')
                          ? styles.statusPillTextCompleted
                          : styles.statusPillTextPending,
                      ]}
                    >
                      {(selectedTaskForDetails.completed || selectedTaskForDetails.status === 'completed')
                        ? 'COMPLETED'
                        : selectedTaskForDetails.status === 'in_progress'
                        ? 'IN PROGRESS'
                        : 'PENDING'}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.priorityBadgeLarge,
                      selectedTaskForDetails.priority === 'High'
                        ? { backgroundColor: '#FEE2E2' }
                        : selectedTaskForDetails.priority === 'Medium'
                        ? { backgroundColor: '#FEF3C7' }
                        : { backgroundColor: '#DBEAFE' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.priorityBadgeTextLarge,
                        selectedTaskForDetails.priority === 'High'
                          ? { color: '#DC2626' }
                          : selectedTaskForDetails.priority === 'Medium'
                          ? { color: '#D97706' }
                          : { color: '#2563EB' },
                      ]}
                    >
                      {selectedTaskForDetails.priority || 'Medium'} Priority
                    </Text>
                  </View>
                </View>

                <Text style={styles.detailsTitle}>{selectedTaskForDetails.title}</Text>

                <View style={styles.projectMetaLine}>
                  <Feather name="folder" size={14} color={colors.buttonPrimary} />
                  <Text style={styles.projectMetaText}>
                    {selectedTaskForDetails.projectTitle}
                  </Text>
                </View>
              </View>

              {/* Task Description Card */}
              <View style={styles.detailsCard}>
                <Text style={styles.sectionHeading}>Description & Scope</Text>
                <Text style={styles.sectionBody}>
                  {selectedTaskForDetails.description ||
                    'No detailed description entered for this task. Use the edit button below to add checklist instructions, assets needed, and deliverables.'}
                </Text>
              </View>

              {/* Task Attributes Card */}
              <View style={styles.detailsCard}>
                <Text style={styles.sectionHeading}>Task Specifications</Text>

                <View style={styles.attrRow}>
                  <View style={styles.attrCol}>
                    <Text style={styles.attrLabel}>Assignee</Text>
                    <Text style={styles.attrVal}>
                      {selectedTaskForDetails.assignee || 'Kasun Alwis'}
                    </Text>
                  </View>
                  <View style={styles.attrCol}>
                    <Text style={styles.attrLabel}>Est. Hours</Text>
                    <Text style={styles.attrVal}>
                      {selectedTaskForDetails.estimatedHours
                        ? `${selectedTaskForDetails.estimatedHours} hrs`
                        : '2.0 hrs'}
                    </Text>
                  </View>
                </View>

                <View style={[styles.attrRow, { marginTop: 14 }]}>
                  <View style={styles.attrCol}>
                    <Text style={styles.attrLabel}>Due Date</Text>
                    <Text style={styles.attrVal}>
                      {selectedTaskForDetails.dueDate || '30 Sep 2026'}
                    </Text>
                  </View>
                  <View style={styles.attrCol}>
                    <Text style={styles.attrLabel}>Schedule Window</Text>
                    <Text style={styles.attrVal}>
                      {selectedTaskForDetails.scheduledTime || 'Today'}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Status Action Buttons */}
              <View style={styles.actionButtonsCard}>
                <TouchableOpacity
                  style={[
                    styles.toggleStatusBtn,
                    selectedTaskForDetails.completed && styles.toggleStatusBtnDone,
                  ]}
                  onPress={() => {
                    toggleTask(selectedTaskForDetails.id);
                    setSelectedTaskForDetails({
                      ...selectedTaskForDetails,
                      completed: !selectedTaskForDetails.completed,
                      status: !selectedTaskForDetails.completed ? 'completed' : 'in_progress',
                    });
                  }}
                >
                  <Ionicons
                    name={
                      selectedTaskForDetails.completed
                        ? 'checkmark-circle'
                        : 'ellipse-outline'
                    }
                    size={20}
                    color={colors.white}
                  />
                  <Text style={styles.toggleStatusBtnText}>
                    {selectedTaskForDetails.completed
                      ? 'Mark as Incomplete'
                      : 'Mark as Completed'}
                  </Text>
                </TouchableOpacity>

                <View style={styles.dualActionRow}>
                  <TouchableOpacity
                    style={styles.editTaskBtn}
                    onPress={() => handleOpenEditModal(selectedTaskForDetails)}
                  >
                    <Feather name="edit-2" size={16} color={colors.buttonPrimary} />
                    <Text style={styles.editTaskBtnText}>Edit Task</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.deleteTaskBtn}
                    onPress={() => setTaskToDelete(selectedTaskForDetails)}
                  >
                    <Feather name="trash-2" size={16} color="#DC2626" />
                    <Text style={styles.deleteTaskBtnText}>Delete Task</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          )}
        </View>
      </Modal>

      {/* ========================================================== */}
      {/* 2. DEDICATED DELETE TASK CONFIRMATION MODAL               */}
      {/* ========================================================== */}
      <Modal
        visible={!!taskToDelete}
        transparent
        animationType="fade"
        onRequestClose={() => setTaskToDelete(null)}
      >
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmBox}>
            <View style={styles.deleteIconBadge}>
              <Feather name="alert-triangle" size={28} color="#DC2626" />
            </View>

            <Text style={styles.confirmTitle}>Delete Task?</Text>
            <Text style={styles.confirmSubtitle}>
              Are you sure you want to permanently remove this task? This action cannot be undone.
            </Text>

            {taskToDelete && (
              <View style={styles.confirmTaskSnippet}>
                <Text style={styles.confirmSnippetTitle} numberOfLines={2}>
                  {taskToDelete.title}
                </Text>
                <Text style={styles.confirmSnippetProject}>
                  {taskToDelete.projectTitle}
                </Text>
              </View>
            )}

            <View style={styles.confirmButtonsRow}>
              <TouchableOpacity
                style={styles.cancelConfirmBtn}
                onPress={() => setTaskToDelete(null)}
              >
                <Text style={styles.cancelConfirmText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteConfirmBtn}
                onPress={handleConfirmDelete}
              >
                <Feather name="trash-2" size={16} color={colors.white} />
                <Text style={styles.deleteConfirmText}>Delete Permanently</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ========================================================== */}
      {/* 3. ADD / EDIT TASK MODAL                                   */}
      {/* ========================================================== */}
      <Modal
        visible={isAddEditModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsAddEditModalVisible(false)}
      >
        <View style={[styles.modalContainer, { paddingTop: Math.max(insets.top, 16) }]}>
          <ScreenBackdrop />
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setIsAddEditModalVisible(false)}>
              <Feather name="arrow-left" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.modalHeaderTitle}>
              {editingTaskId ? 'Edit Task' : 'Create New Task'}
            </Text>
            <TouchableOpacity onPress={() => setIsAddEditModalVisible(false)}>
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
            {/* Project Selection */}
            <Text style={styles.formLabel}>Assigned Project *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
              {projects.map((p) => (
                <TouchableOpacity
                  key={p.id}
                  style={[
                    styles.formPill,
                    formProjectId === p.id && styles.formPillActive,
                  ]}
                  onPress={() => setFormProjectId(p.id)}
                >
                  <Text
                    style={[
                      styles.formPillText,
                      formProjectId === p.id && styles.formPillTextActive,
                    ]}
                  >
                    {p.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Task Title */}
            <Text style={styles.formLabel}>Task Title *</Text>
            <TextInput
              style={styles.formInput}
              placeholder="e.g. Wireframe responsive mobile checkout"
              placeholderTextColor={colors.textMuted}
              value={formTitle}
              onChangeText={setFormTitle}
            />

            {/* Description */}
            <Text style={styles.formLabel}>Detailed Description / Checklist</Text>
            <TextInput
              style={[styles.formInput, styles.formTextArea]}
              placeholder="Provide context, acceptance criteria or deliverable links..."
              placeholderTextColor={colors.textMuted}
              multiline
              numberOfLines={4}
              value={formDescription}
              onChangeText={setFormDescription}
            />

            {/* Priority Picker */}
            <Text style={styles.formLabel}>Priority Level</Text>
            <View style={styles.prioritySelectorRow}>
              {(['Low', 'Medium', 'High'] as const).map((p) => (
                <TouchableOpacity
                  key={p}
                  style={[
                    styles.priorityOption,
                    formPriority === p && styles.priorityOptionActive,
                  ]}
                  onPress={() => setFormPriority(p)}
                >
                  <Text
                    style={[
                      styles.priorityOptionText,
                      formPriority === p && styles.priorityOptionTextActive,
                    ]}
                  >
                    {p}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Due Date & Hours */}
            <View style={styles.twoColRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.formLabel}>Due Date</Text>
                <TouchableOpacity
                  style={[styles.formInput, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}
                  onPress={() => setShowDatePicker(true)}
                  activeOpacity={0.7}
                >
                  <Text style={{ fontSize: 13, color: formDueDate ? colors.textPrimary : colors.textMuted }}>
                    {formDueDate || 'YYYY-MM-DD'}
                  </Text>
                  <Feather name="calendar" size={15} color={colors.buttonPrimary} />
                </TouchableOpacity>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.formLabel}>Estimated Hours</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="e.g. 4.0"
                  keyboardType="numeric"
                  placeholderTextColor={colors.textMuted}
                  value={formHours}
                  onChangeText={setFormHours}
                />
              </View>
            </View>

            {/* Assignee */}
            <Text style={styles.formLabel}>Assignee</Text>
            <TextInput
              style={styles.formInput}
              placeholder="e.g. Kasun Alwis"
              placeholderTextColor={colors.textMuted}
              value={formAssignee}
              onChangeText={setFormAssignee}
            />

            {/* Submit Button */}
            <TouchableOpacity
              style={styles.saveTaskBtn}
              onPress={handleSaveTask}
              activeOpacity={0.8}
            >
              <Feather name="check-circle" size={18} color={colors.white} />
              <Text style={styles.saveTaskBtnText}>
                {editingTaskId ? 'Save Task Changes' : 'Create Task'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <DatePickerModal
          visible={showDatePicker}
          onClose={() => setShowDatePicker(false)}
          onSelectDate={(d) => setFormDueDate(d)}
          initialDate={formDueDate}
          title="Select Task Due Date"
        />
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
  newTaskHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.buttonPrimary,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
  },
  newTaskHeaderBtnText: {
    fontSize: 13,
    fontFamily: typography.fonts.bold,
    color: colors.white,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 12,
    borderRadius: 14,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: '#EEE8F6',
  },
  statLabel: {
    fontSize: 11,
    fontFamily: typography.fonts.medium,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  statNumber: {
    fontSize: 18,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary,
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
  statusTabsRow: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  statusTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  statusTabActive: {
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statusTabText: {
    fontSize: 12,
    fontFamily: typography.fonts.medium,
    color: colors.textSecondary,
  },
  statusTabTextActive: {
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
  taskCard: {
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
  taskCardMainRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxDone: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  taskContentArea: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 15,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  taskTitleDone: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  taskDescriptionText: {
    fontSize: 12,
    fontFamily: typography.fonts.regular,
    color: colors.textSecondary,
    marginTop: 4,
    lineHeight: 16,
  },
  taskMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  taskProjectTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    maxWidth: 140,
  },
  taskProjectTagText: {
    fontSize: 11,
    fontFamily: typography.fonts.medium,
    color: colors.textSecondary,
  },
  taskPriorityTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  taskPriorityTagText: {
    fontSize: 11,
    fontFamily: typography.fonts.bold,
  },
  taskDueTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  taskDueTagText: {
    fontSize: 11,
    fontFamily: typography.fonts.regular,
    color: colors.textSecondary,
  },
  cardActionsCol: {
    alignItems: 'center',
    gap: 10,
  },
  iconActionBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#F8F6FC',
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
  detailsCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#EEE8F6',
    marginBottom: 14,
  },
  detailsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusPillLarge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusPillCompleted: {
    backgroundColor: '#D1FAE5',
  },
  statusPillPending: {
    backgroundColor: '#FEF3C7',
  },
  statusPillTextLarge: {
    fontSize: 11,
    fontFamily: typography.fonts.bold,
  },
  statusPillTextCompleted: {
    color: '#059669',
  },
  statusPillTextPending: {
    color: '#D97706',
  },
  priorityBadgeLarge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  priorityBadgeTextLarge: {
    fontSize: 11,
    fontFamily: typography.fonts.bold,
  },
  detailsTitle: {
    fontSize: 19,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary,
    lineHeight: 26,
    marginBottom: 8,
  },
  projectMetaLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  projectMetaText: {
    fontSize: 13,
    fontFamily: typography.fonts.medium,
    color: colors.buttonPrimary,
  },
  sectionHeading: {
    fontSize: 14,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  sectionBody: {
    fontSize: 13,
    fontFamily: typography.fonts.regular,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  attrRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  attrCol: {
    flex: 1,
  },
  attrLabel: {
    fontSize: 11,
    fontFamily: typography.fonts.medium,
    color: colors.textMuted,
    marginBottom: 2,
  },
  attrVal: {
    fontSize: 14,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary,
  },
  actionButtonsCard: {
    marginTop: 6,
    gap: 12,
  },
  toggleStatusBtn: {
    backgroundColor: colors.buttonPrimary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 24,
    paddingVertical: 14,
  },
  toggleStatusBtnDone: {
    backgroundColor: '#059669',
  },
  toggleStatusBtnText: {
    color: colors.white,
    fontFamily: typography.fonts.bold,
    fontSize: 14,
  },
  dualActionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  editTaskBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: colors.buttonPrimary,
    borderRadius: 24,
    paddingVertical: 12,
  },
  editTaskBtnText: {
    color: colors.buttonPrimary,
    fontFamily: typography.fonts.bold,
    fontSize: 13,
  },
  deleteTaskBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#DC2626',
    borderRadius: 24,
    paddingVertical: 12,
    backgroundColor: '#FEF2F2',
  },
  deleteTaskBtnText: {
    color: '#DC2626',
    fontFamily: typography.fonts.bold,
    fontSize: 13,
  },
  // Delete Confirmation Dialog
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
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  deleteIconBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  confirmTitle: {
    fontSize: 18,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  confirmSubtitle: {
    fontSize: 13,
    fontFamily: typography.fonts.regular,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  confirmTaskSnippet: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    width: '100%',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 20,
  },
  confirmSnippetTitle: {
    fontSize: 13,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary,
  },
  confirmSnippetProject: {
    fontSize: 11,
    fontFamily: typography.fonts.regular,
    color: colors.textSecondary,
    marginTop: 4,
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
    flex: 1.4,
    backgroundColor: '#DC2626',
    borderRadius: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  deleteConfirmText: {
    fontSize: 13,
    fontFamily: typography.fonts.bold,
    color: colors.white,
  },
  // Form modal
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
    fontFamily: typography.fonts.regular,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  formTextArea: {
    height: 90,
    textAlignVertical: 'top',
  },
  formPill: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
  },
  formPillActive: {
    backgroundColor: colors.buttonPrimary,
    borderColor: colors.buttonPrimary,
  },
  formPillText: {
    fontSize: 12,
    fontFamily: typography.fonts.medium,
    color: colors.textSecondary,
  },
  formPillTextActive: {
    color: colors.white,
    fontFamily: typography.fonts.bold,
  },
  prioritySelectorRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  priorityOption: {
    flex: 1,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  priorityOptionActive: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.buttonPrimary,
  },
  priorityOptionText: {
    fontSize: 13,
    fontFamily: typography.fonts.medium,
    color: colors.textSecondary,
  },
  priorityOptionTextActive: {
    fontFamily: typography.fonts.bold,
    color: colors.buttonPrimary,
  },
  twoColRow: {
    flexDirection: 'row',
    gap: 12,
  },
  saveTaskBtn: {
    backgroundColor: colors.buttonPrimary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 24,
    paddingVertical: 14,
    marginTop: 8,
  },
  saveTaskBtnText: {
    color: colors.white,
    fontFamily: typography.fonts.bold,
    fontSize: 14,
  },
});

export default TasksScreen;
