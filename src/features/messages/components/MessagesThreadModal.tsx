import { ScreenBackdrop } from '@/components/ui/Surface';
import { pickAttachment, openAttachment } from '@/services/attachments';
import { relativeTime } from '@/utils/dates';
import type { FileAttachment } from '@/types';
import { MotionView, MotionTouchable as TouchableOpacity, MotionModal as Modal } from '@/components/ui/Motion';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppContext } from '@/context/AppContext';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';

export const MessagesThreadModal: React.FC = () => {
  const insets = useSafeAreaInsets();
  const {
    activeModal,
    closeModal,
    selectedClientId,
    clients,
    messages,
    sendMessage,
    currentUser,
    projects,
  } = useAppContext();

  const isVisible = activeModal === 'messages_thread';

  const client = clients.find((c) => c.id === selectedClientId || c.linkedUserId === selectedClientId) || clients[0];
  const linkedProject = projects.find((p) => p.clientId === client?.id) || projects[0];

  const [inputText, setInputText] = useState('');
  const [attachedFile, setAttachedFile] = useState<FileAttachment | null>(null);

  const clientMessages = messages.filter(
    (m) =>
      m.clientId === client?.id ||
      (currentUser?.role === 'client' &&
        (m.clientId === currentUser.clientId || m.clientId === currentUser.id))
  );

  const handleSend = () => {
    if (!inputText.trim() && !attachedFile) return;

    sendMessage(
      client?.id || 'cl_default',
      linkedProject?.id,
      inputText.trim(),
      attachedFile?.name,
      attachedFile || undefined
    );

    setInputText('');
    setAttachedFile(null);
  };

  const handleAttachPrompt = async () => {
    try { const file = await pickAttachment(); if (file) setAttachedFile(file); }
    catch (error) { Alert.alert('Unable to attach file', error instanceof Error ? error.message : 'Please try again.'); }
  };

  if (!client && !currentUser) return null;

  const contactName =
    currentUser?.role === 'client'
      ? currentUser.agencyLead || 'ISAACIFY Creative'
      : client?.name || 'Senuri Perera';

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={closeModal}
    >
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={[styles.container, { paddingTop: Math.max(insets.top, 12) }]}>
        <ScreenBackdrop />
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={closeModal} style={styles.backButton}>
              <Feather name="arrow-left" size={24} color={colors.textPrimary} />
            </TouchableOpacity>

            <View style={styles.headerCenter}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {contactName.slice(0, 2).toUpperCase()}
                </Text>
              </View>
              <View>
                <Text style={styles.headerName}>{contactName}</Text>
                <Text style={styles.headerSub}>
                  {currentUser?.role === 'client' ? 'Design Agency Partner' : client?.companyName || 'Client'}
                </Text>
              </View>
            </View>

            <TouchableOpacity onPress={closeModal} style={styles.closeBtn}>
              <Feather name="x" size={22} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Conversation Messages */}
          <ScrollView
            style={styles.messagesScroll}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.dateBadgeWrapper}>
              <View style={styles.dateBadge}>
                <Text style={styles.dateBadgeText}>Today, 16 Sep 2026</Text>
              </View>
            </View>

            {clientMessages.length === 0 ? (
              <View style={styles.emptyMessagesBox}>
                <Feather name="message-square" size={36} color={colors.textMuted} />
                <Text style={styles.emptyTitle}>No messages yet</Text>
                <Text style={styles.emptySubtitle}>
                  Start communicating with {contactName} regarding deliverables and project updates.
                </Text>
              </View>
            ) : (
              clientMessages.map((msg) => {
                const isMe = msg.senderId === currentUser?.id;

                return (
                  <MotionView
                    key={msg.id}
                    style={[styles.messageRow, isMe ? styles.messageRowMe : styles.messageRowThem]}
                  >
                    {!isMe && (
                      <View style={styles.themAvatar}>
                        <Text style={styles.themAvatarText}>
                          {msg.senderName.slice(0, 2).toUpperCase()}
                        </Text>
                      </View>
                    )}

                    <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleThem]}>
                      <Text style={[styles.bubbleText, isMe ? styles.bubbleTextMe : styles.bubbleTextThem]}>
                        {msg.text}
                      </Text>

                      {msg.attachmentName && (
                        <TouchableOpacity style={styles.attachmentCard} onPress={() => { void openAttachment(msg.attachment).catch(error => Alert.alert('File unavailable', error.message)); }}>
                          <MaterialCommunityIcons
                            name="file-document-outline"
                            size={20}
                            color={isMe ? colors.white : colors.buttonPrimary}
                          />
                          <Text
                            style={[
                              styles.attachmentName,
                              isMe ? styles.attachmentNameMe : styles.attachmentNameThem,
                            ]}
                          >
                            {msg.attachmentName}
                          </Text>
                        </TouchableOpacity>
                      )}

                      <View style={styles.bubbleFooter}>
                        <Text
                          style={[
                            styles.bubbleTimestamp,
                            isMe ? styles.bubbleTimestampMe : styles.bubbleTimestampThem,
                          ]}
                        >
                          {relativeTime(msg.createdAt || msg.timestamp)}
                        </Text>
                        {isMe && <Feather name="check" size={12} color="rgba(255,255,255,0.7)" />}
                      </View>
                    </View>
                  </MotionView>
                );
              })
            )}
          </ScrollView>

          {/* Attached preview pill if selected */}
          {attachedFile && (
            <View style={styles.attachedPillRow}>
              <Feather name="paperclip" size={14} color={colors.buttonPrimary} />
              <Text style={styles.attachedPillText}>{attachedFile.name}</Text>
              <TouchableOpacity onPress={() => setAttachedFile(null)}>
                <Feather name="x" size={14} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          )}

          {/* Bottom Chat Bar */}
          <View style={[styles.chatBar, { paddingBottom: 10 }]}>
            <TouchableOpacity onPress={handleAttachPrompt} style={styles.clipBtn}>
              <Feather name="paperclip" size={20} color={colors.textSecondary} />
            </TouchableOpacity>

            <TextInput
              style={styles.chatInput}
              placeholder="Type a message..."
              placeholderTextColor={colors.textMuted}
              value={inputText}
              onChangeText={setInputText}
              multiline
            />

            <TouchableOpacity
              gradient
              onPress={handleSend}
              style={[
                styles.sendBtn,
                !inputText.trim() && !attachedFile && styles.sendBtnDisabled,
              ]}
              disabled={!inputText.trim() && !attachedFile}
            >
              <Feather name="send" size={18} color={colors.white} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: { flex: 1, backgroundColor: '#FAF9FD' },
  container: {
    flex: 1,
    backgroundColor: '#FAF9FD',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EDF7',
    paddingBottom: 14,
  },
  backButton: { padding: 6 },
  closeBtn: { padding: 6 },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    gap: 10,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.buttonPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: typography.fonts.bold,
    fontSize: 13,
    color: colors.white,
  },
  headerName: {
    fontFamily: typography.fonts.bold,
    fontSize: 16,
    color: colors.textPrimary,
  },
  headerSub: {
    fontFamily: typography.fonts.regular,
    fontSize: 12,
    color: colors.textSecondary,
  },
  messagesScroll: { flex: 1 },
  messagesContent: { padding: spacing.lg, paddingBottom: 24 },
  dateBadgeWrapper: {
    alignItems: 'center',
    marginBottom: 16,
  },
  dateBadge: {
    backgroundColor: '#EDE9F6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 14,
  },
  dateBadgeText: {
    fontFamily: typography.fonts.medium,
    fontSize: 12,
    color: colors.buttonPrimary,
  },
  emptyMessagesBox: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    paddingHorizontal: 30,
  },
  emptyTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: 16,
    color: colors.textPrimary,
    marginTop: 12,
  },
  emptySubtitle: {
    fontFamily: typography.fonts.regular,
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 14,
    alignItems: 'flex-end',
    gap: 8,
  },
  messageRowMe: {
    justifyContent: 'flex-end',
  },
  messageRowThem: {
    justifyContent: 'flex-start',
  },
  themAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E2D9F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  themAvatarText: {
    fontFamily: typography.fonts.bold,
    fontSize: 10,
    color: colors.buttonPrimary,
  },
  bubble: {
    maxWidth: '78%',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleMe: {
    backgroundColor: colors.buttonPrimary,
    borderBottomRightRadius: 4,
  },
  bubbleThem: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0EDF7',
    borderBottomLeftRadius: 4,
  },
  bubbleText: {
    fontFamily: typography.fonts.regular,
    fontSize: 14,
    lineHeight: 20,
  },
  bubbleTextMe: {
    color: colors.white,
  },
  bubbleTextThem: {
    color: colors.textPrimary,
  },
  attachmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    padding: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  attachmentName: {
    fontFamily: typography.fonts.medium,
    fontSize: 12,
  },
  attachmentNameMe: { color: colors.white },
  attachmentNameThem: { color: colors.buttonPrimary },
  bubbleFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    marginTop: 4,
  },
  bubbleTimestamp: {
    fontFamily: typography.fonts.regular,
    fontSize: 10,
  },
  bubbleTimestampMe: { color: 'rgba(255,255,255,0.7)' },
  bubbleTimestampThem: { color: colors.textMuted },
  attachedPillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: '#F3EEFF',
  },
  attachedPillText: {
    flex: 1,
    fontFamily: typography.fonts.medium,
    fontSize: 12,
    color: colors.buttonPrimary,
  },
  chatBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0EDF7',
    gap: 10,
  },
  clipBtn: {
    padding: 8,
  },
  chatInput: {
    flex: 1,
    backgroundColor: '#FAF9FD',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2D9F3',
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontFamily: typography.fonts.regular,
    fontSize: 14,
    color: colors.textPrimary,
    maxHeight: 90,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.buttonPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: '#C4B5FD',
  },
});
