import { ScreenBackdrop } from '@/components/ui/Surface';
import { MotionTouchable as TouchableOpacity } from '@/components/ui/Motion';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useAppContext } from '@/context/AppContext';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';

export const MessagesScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const {
    currentUser,
    clients,
    projects,
    messages,
    openMessagesThreadModal,
    openAddClientModal,
  } = useAppContext();

  const [searchQuery, setSearchQuery] = useState('');
  const isClient = currentUser?.role === 'client';

  // Build conversation list
  // Providers see conversations with their clients
  // Clients see conversation with their provider/workspace
  interface ConversationItem {
    id: string;
    clientId: string;
    contactName: string;
    subtitle: string;
    projectTitle?: string;
    lastMessageText: string;
    lastMessageTime: string;
    unreadCount: number;
    avatarInitials: string;
  }

  const conversations: ConversationItem[] = [];

  if (isClient) {
    // Client perspective: conversation with Provider/Agency
    const providerName = currentUser?.agencyLead || currentUser?.workspaceName || 'ISAACIFY Team';
    const targetClientId = currentUser?.clientId || clients[0]?.id || currentUser?.id || 'client_me';
    const clientMsgs = messages.filter(
      (m) =>
        m.clientId === targetClientId ||
        m.clientId === currentUser?.id ||
        (currentUser?.clientId && m.clientId === currentUser.clientId)
    );
    const lastMsg = clientMsgs[clientMsgs.length - 1];
    const clientProject = projects[0];

    conversations.push({
      id: 'conv_provider',
      clientId: targetClientId,
      contactName: providerName,
      subtitle: currentUser?.workspaceName || 'Service Provider',
      projectTitle: clientProject?.title,
      lastMessageText: lastMsg?.text || 'Start conversation with your project team...',
      lastMessageTime: lastMsg?.timestamp || 'Today',
      unreadCount: clientMsgs.filter((m) => m.senderRole !== 'client' && !m.read).length,
      avatarInitials: providerName.slice(0, 2).toUpperCase(),
    });
  } else {
    // Provider perspective: conversation per client
    clients.forEach((c) => {
      const clientMsgs = messages.filter((m) => m.clientId === c.id);
      const lastMsg = clientMsgs[clientMsgs.length - 1];
      const project = projects.find((p) => p.clientId === c.id);

      conversations.push({
        id: `conv_${c.id}`,
        clientId: c.id,
        contactName: c.name,
        subtitle: c.companyName,
        projectTitle: project?.title,
        lastMessageText: lastMsg?.text || 'No messages exchanged yet. Tap to start chatting.',
        lastMessageTime: lastMsg?.timestamp || '',
        unreadCount: clientMsgs.filter((m) => m.senderRole === 'client' && !m.read).length,
        avatarInitials: c.name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .slice(0, 2)
          .toUpperCase(),
      });
    });
  }

  const filteredConversations = conversations.filter((conv) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      conv.contactName.toLowerCase().includes(q) ||
      conv.subtitle.toLowerCase().includes(q) ||
      (conv.projectTitle && conv.projectTitle.toLowerCase().includes(q)) ||
      conv.lastMessageText.toLowerCase().includes(q)
    );
  });

  return (
    <View style={styles.container}>
      <ScreenBackdrop />
      {/* Header */}
      <View style={[styles.headerBar, { paddingTop: Math.max(insets.top, 12) }]}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarMini}>
            <Text style={styles.avatarMiniText}>
              {(currentUser?.firstName || 'IS').slice(0, 2).toUpperCase()}
            </Text>
          </View>
          <View>
            <Text style={styles.workspaceText}>
              {isClient ? 'Client Portal' : currentUser?.agencyName || currentUser?.workspaceName || 'ISAACIFY'}
            </Text>
            <Text style={styles.headerTitle}>Messages</Text>
          </View>
        </View>

        {!isClient && (
          <TouchableOpacity
            style={styles.newChatBtn}
            activeOpacity={0.8}
            onPress={() => {
              if (clients.length > 0) {
                openMessagesThreadModal(clients[0].id);
              } else {
                openAddClientModal();
              }
            }}
          >
            <Feather name="edit-3" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 20) + 80 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Feather name="search" size={18} color={colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search conversations, clients, or projects..."
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

        {/* Conversation List */}
        {filteredConversations.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconBox}>
              <Ionicons name="chatbubbles-outline" size={32} color={colors.buttonPrimary} />
            </View>
            <Text style={styles.emptyTitle}>No messages yet</Text>
            <Text style={styles.emptySubtitle}>
              {isClient
                ? 'Your project discussions with the team will appear here.'
                : 'Direct messaging threads with your clients will appear here once communication begins.'}
            </Text>
            {!isClient && (
              <TouchableOpacity
                style={styles.emptyActionBtn}
                onPress={() => {
                  if (clients.length > 0) {
                    openMessagesThreadModal(clients[0].id);
                  } else {
                    openAddClientModal();
                  }
                }}
              >
                <Text style={styles.emptyActionBtnText}>
                  {clients.length > 0 ? 'Start Conversation' : 'Add First Client'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          filteredConversations.map((conv) => (
            <TouchableOpacity
              key={conv.id}
              style={styles.conversationCard}
              activeOpacity={0.7}
              onPress={() => openMessagesThreadModal(conv.clientId)}
            >
              <View style={styles.cardAvatar}>
                <Text style={styles.cardAvatarText}>{conv.avatarInitials}</Text>
              </View>

              <View style={styles.cardBody}>
                <View style={styles.cardTopRow}>
                  <Text style={styles.contactName} numberOfLines={1}>
                    {conv.contactName}
                  </Text>
                  {conv.lastMessageTime ? (
                    <Text style={styles.timeText}>{conv.lastMessageTime}</Text>
                  ) : null}
                </View>

                <Text style={styles.subtitleText} numberOfLines={1}>
                  {conv.subtitle}
                </Text>

                {conv.projectTitle ? (
                  <View style={styles.projectPill}>
                    <Feather name="folder" size={11} color={colors.buttonPrimary} />
                    <Text style={styles.projectPillText} numberOfLines={1}>
                      {conv.projectTitle}
                    </Text>
                  </View>
                ) : null}

                <Text style={styles.lastMessagePreview} numberOfLines={2}>
                  {conv.lastMessageText}
                </Text>
              </View>

              {conv.unreadCount > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadBadgeText}>{conv.unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 18,
    backgroundColor: 'transparent',
    borderBottomWidth: 0
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarMini: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.buttonPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarMiniText: {
    color: '#FFFFFF',
    fontFamily: typography.fonts.bold,
    fontSize: 16,
  },
  workspaceText: {
    fontFamily: typography.fonts.medium,
    fontSize: 12,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: 24,
    color: colors.textPrimary
  },
  newChatBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.buttonPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.buttonPrimary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 36
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#EFEAFF',
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontFamily: typography.fonts.regular,
    fontSize: 14,
    color: colors.textPrimary,
  },
  conversationCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#EEE8F6',
    shadowColor: '#493068',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3
  },
  cardAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3EEFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  cardAvatarText: {
    fontFamily: typography.fonts.bold,
    fontSize: 16,
    color: colors.buttonPrimary,
  },
  cardBody: {
    flex: 1,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  contactName: {
    fontFamily: typography.fonts.bold,
    fontSize: 15,
    color: colors.textPrimary,
    flex: 1,
  },
  timeText: {
    fontFamily: typography.fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginLeft: 8,
  },
  subtitleText: {
    fontFamily: typography.fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 6,
  },
  projectPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F0FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    gap: 4,
    marginBottom: 6,
  },
  projectPillText: {
    fontFamily: typography.fonts.medium,
    fontSize: 11,
    color: colors.buttonPrimary,
    maxWidth: 200,
  },
  lastMessagePreview: {
    fontFamily: typography.fonts.regular,
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
  },
  unreadBadge: {
    backgroundColor: colors.buttonPrimary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    marginLeft: 8,
    alignSelf: 'center',
  },
  unreadBadgeText: {
    color: '#FFFFFF',
    fontFamily: typography.fonts.bold,
    fontSize: 11,
  },
  emptyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#EFEAFF',
  },
  emptyIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F3EEFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontFamily: typography.fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  emptyActionBtn: {
    backgroundColor: colors.buttonPrimary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  emptyActionBtnText: {
    fontFamily: typography.fonts.bold,
    fontSize: 14,
    color: '#FFFFFF',
  },
});
