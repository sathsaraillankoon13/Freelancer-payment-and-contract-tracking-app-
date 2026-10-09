import { ScreenBackdrop } from '@/components/ui/Surface';
import { pickAttachment, pickImage } from '@/services/attachments';
import type { FileAttachment } from '@/types';
import { MotionTouchable as TouchableOpacity, MotionModal as Modal } from '@/components/ui/Motion';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  Platform,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppContext } from '@/context/AppContext';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';

export const SubmitDeliverableModal: React.FC = () => {
  const insets = useSafeAreaInsets();
  const {
    activeModal,
    closeModal,
    selectedProjectId,
    projects,
    submitDeliverable,
  } = useAppContext();

  const isVisible = activeModal === 'submit_deliverable';
  const project = projects.find((p) => p.id === selectedProjectId) || projects[0];

  const [deliverableName, setDeliverableName] = useState('');
  const [fileName, setFileName] = useState('');
  const [attachment, setAttachment] = useState<FileAttachment | null>(null);

  const chooseFile = () => {
    Alert.alert(
      'Upload Deliverable',
      'Choose the type of asset to attach:',
      [
        {
          text: 'Upload Photos / Image',
          onPress: async () => {
            try {
              const file = await pickImage();
              if (file) {
                setAttachment(file);
                setFileName(file.name);
                setError('');
              }
            } catch (error) {
              Alert.alert('Unable to select image', error instanceof Error ? error.message : 'Please try again.');
            }
          },
        },
        {
          text: 'Upload Document / File (PDF, ZIP)',
          onPress: async () => {
            try {
              const file = await pickAttachment();
              if (file) {
                setAttachment(file);
                setFileName(file.name);
                setError('');
              }
            } catch (error) {
              Alert.alert('Unable to select file', error instanceof Error ? error.message : 'Please try again.');
            }
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };
  const [version, setVersion] = useState('v1');
  const [authorNote, setAuthorNote] = useState('');
  const [error, setError] = useState('');

  if (!project) return null;

  const handleSubmit = () => {
    if (!deliverableName.trim()) {
      setError('Please enter deliverable title');
      return;
    }
    if (!attachment) {
      setError('Please select the actual deliverable file');
      return;
    }

    submitDeliverable({
      projectId: project.id,
      deliverableName: deliverableName.trim(),
      fileName: fileName.trim(),
      attachment,
      authorNote: authorNote.trim() || 'Ready for client review.',
      version: version.trim() || 'v1',
    });

    closeModal();
    setDeliverableName('');
    setFileName(''); setAttachment(null);
    setAuthorNote('');
    setError('');

    Alert.alert(
      'Deliverable Submitted',
      `"${deliverableName.trim()}" has been submitted for ${project.clientName}'s review.`,
      [{ text: 'OK' }]
    );
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
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={closeModal} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Submit Deliverable</Text>
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
          {/* Target Project Card */}
          <View style={styles.projectCard}>
            <Text style={styles.projectLabel}>TARGET PROJECT</Text>
            <Text style={styles.projectTitle}>{project.title}</Text>
            <Text style={styles.projectClient}>Client: {project.clientName}</Text>
          </View>

          {/* Form */}
          <View style={styles.card}>
            <Text style={styles.fieldLabel}>
              Deliverable Title <Text style={styles.asterisk}>*</Text>
            </Text>
            <View style={styles.inputBox}>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Homepage Design Final"
                placeholderTextColor={colors.textMuted}
                value={deliverableName}
                onChangeText={(t) => {
                  setDeliverableName(t);
                  if (error) setError('');
                }}
              />
            </View>

            <Text style={styles.fieldLabel}>
              File Attachment <Text style={styles.asterisk}>*</Text>
            </Text>
            <TouchableOpacity onPress={chooseFile} style={styles.filePickerBox} activeOpacity={0.7}>
              {attachment && (attachment.mimeType?.startsWith('image/') || /\.(png|jpe?g|webp)$/i.test(attachment.name)) ? (
                <Image
                  source={{ uri: attachment.uri }}
                  style={{ width: 28, height: 28, borderRadius: 6, marginRight: 4 }}
                />
              ) : (
                <MaterialCommunityIcons
                  name={attachment ? 'file-check-outline' : 'paperclip'}
                  size={20}
                  color={attachment ? colors.buttonPrimary : colors.textMuted}
                />
              )}
              <Text
                style={[
                  styles.filePickerText,
                  attachment ? styles.filePickerTextSelected : undefined,
                ]}
                numberOfLines={1}
              >
                {attachment ? fileName : 'Choose image or file · up to 20 MB'}
              </Text>
              <Feather name="upload-cloud" size={16} color={colors.buttonPrimary} />
            </TouchableOpacity>
            <View style={styles.rowTwo}>
              <View style={{ flex: 1 }}>
                <Text style={styles.fieldLabel}>Version</Text>
                <View style={styles.inputBox}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g. v1"
                    placeholderTextColor={colors.textMuted}
                    value={version}
                    onChangeText={setVersion}
                  />
                </View>
              </View>
            </View>

            <Text style={styles.fieldLabel}>Author Note for Client</Text>
            <View style={[styles.inputBox, { height: 90, alignItems: 'flex-start' }]}>
              <TextInput
                style={[styles.textInput, { textAlignVertical: 'top' }]}
                placeholder="e.g. Completed header redesign, hero banner & CTA buttons."
                placeholderTextColor={colors.textMuted}
                multiline
                numberOfLines={3}
                value={authorNote}
                onChangeText={setAuthorNote}
              />
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>

          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} activeOpacity={0.8}>
            <Feather name="upload-cloud" size={18} color={colors.white} />
            <Text style={styles.submitBtnText}>Submit Deliverable for Review</Text>
          </TouchableOpacity>
        </ScrollView>
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
  backButton: { padding: 6 },
  closeButton: { padding: 6 },
  headerTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: 22,
    color: colors.textPrimary
  },
  scrollArea: { flex: 1 },
  scrollContent: { padding: spacing.lg },
  projectCard: {
    backgroundColor: '#F3EEFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  projectLabel: {
    fontFamily: typography.fonts.medium,
    fontSize: 11,
    color: colors.buttonPrimary,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  projectTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: 18,
    color: colors.textPrimary,
  },
  projectClient: {
    fontFamily: typography.fonts.regular,
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: '#EEE8F6',
    marginBottom: 20,
    shadowColor: '#493068',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3
  },
  fieldLabel: {
    fontFamily: typography.fonts.medium,
    fontSize: 13,
    color: colors.textPrimary,
    marginBottom: 8,
    marginTop: 12,
  },
  asterisk: { color: '#DC2626' },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF9FD',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2D9F3',
    paddingHorizontal: 12,
    height: 48,
  },
  filePickerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FAF9FD',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2D9F3',
    paddingHorizontal: 14,
    height: 48,
    gap: 8,
  },
  filePickerText: {
    flex: 1,
    fontFamily: typography.fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
  },
  filePickerTextSelected: {
    fontFamily: typography.fonts.medium,
    color: colors.textPrimary,
  },
  textInput: {
    flex: 1,
    fontFamily: typography.fonts.regular,
    fontSize: 14,
    color: colors.textPrimary,
  },
  rowTwo: {
    flexDirection: 'row',
    gap: 12,
  },
  errorText: {
    fontFamily: typography.fonts.medium,
    fontSize: 13,
    color: '#DC2626',
    marginTop: 12,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.buttonPrimary,
    paddingVertical: 16,
    borderRadius: 16,
  },
  submitBtnText: {
    fontFamily: typography.fonts.bold,
    fontSize: 15,
    color: colors.white,
  },
});
