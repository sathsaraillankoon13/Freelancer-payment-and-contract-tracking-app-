import { ScreenBackdrop } from '@/components/ui/Surface';
import { MotionTouchable as TouchableOpacity, MotionModal as Modal } from '@/components/ui/Motion';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppContext } from '@/context/AppContext';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';
import { BottomTabBar, TabName } from '@/components/navigation/BottomTabBar';

export const NotificationCenterModal: React.FC = () => {
  const insets = useSafeAreaInsets();
  const {
    activeModal,
    closeModal,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    openReviewDeliverableModal,
    deliverables,
    activeTab,
    setActiveTab,
  } = useAppContext();

  const handleTabPress = (tab: TabName) => {
    closeModal();
    setActiveTab(tab);
  };

  const isVisible = activeModal === 'notification_center';
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filtered = notifications.filter((n) => (filter === 'unread' ? n.unread : true));
  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleAction = (notifId: string, type: string) => {
    markNotificationRead(notifId);
    if (type === 'deliverable' && deliverables.length > 0) {
      closeModal();
      openReviewDeliverableModal(deliverables[0].id);
    }
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
          <TouchableOpacity onPress={closeModal} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
          <TouchableOpacity onPress={markAllNotificationsRead} style={styles.markReadBtn}>
            <Text style={styles.markReadText}>Mark all read</Text>
          </TouchableOpacity>
        </View>

        {/* Filter Pills */}
        <View style={styles.pillsRow}>
          <TouchableOpacity
            style={[styles.pill, filter === 'all' && styles.pillActive]}
            onPress={() => setFilter('all')}
          >
            <Text style={[styles.pillText, filter === 'all' && styles.pillTextActive]}>
              All ({notifications.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.pill, filter === 'unread' && styles.pillActive]}
            onPress={() => setFilter('unread')}
          >
            <Text style={[styles.pillText, filter === 'unread' && styles.pillTextActive]}>
              Unread ({unreadCount})
            </Text>
          </TouchableOpacity>
        </View>

        {/* List */}
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom, 24) + 60 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {filtered.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View style={styles.checkCircle}>
                <Feather name="check" size={28} color="#10B981" />
              </View>
              <Text style={styles.emptyTitle}>You&apos;re all caught up for today.</Text>
              <Text style={styles.emptySub}>
                Check back later for client activity, deliverable reviews and project updates.
              </Text>
            </View>
          ) : (
            filtered.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.card, item.unread && styles.cardUnread]}
                onPress={() => handleAction(item.id, item.type)}
                activeOpacity={0.7}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.iconCircle}>
                    {item.type === 'invoice' ? (
                      <Ionicons name="card-outline" size={18} color={colors.buttonPrimary} />
                    ) : item.type === 'payment' ? (
                      <MaterialCommunityIcons name="cash-check" size={18} color="#10B981" />
                    ) : item.type === 'message' ? (
                      <Feather name="message-square" size={18} color="#3B82F6" />
                    ) : (
                      <Feather name="file-text" size={18} color={colors.buttonPrimary} />
                    )}
                  </View>

                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <View style={styles.titleRow}>
                      <Text style={styles.cardTitle}>{item.title}</Text>
                      {item.unread && <View style={styles.blueDot} />}
                    </View>
                    <Text style={styles.cardMessage}>{item.message}</Text>
                    <Text style={styles.cardTime}>{item.timeAgo}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>

        <BottomTabBar activeTab={activeTab} onTabPress={handleTabPress} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EDF7',
    backgroundColor: 'transparent',
    paddingBottom: 20
  },
  backButton: { padding: 6 },
  headerTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: 22,
    color: colors.textPrimary
  },
  markReadBtn: { padding: 6 },
  markReadText: {
    fontFamily: typography.fonts.medium,
    fontSize: 13,
    color: colors.buttonPrimary,
  },
  pillsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2D9F3',
  },
  pillActive: {
    backgroundColor: colors.buttonPrimary,
    borderColor: colors.buttonPrimary,
  },
  pillText: {
    fontFamily: typography.fonts.medium,
    fontSize: 13,
    color: colors.textSecondary,
  },
  pillTextActive: {
    color: colors.white,
    fontFamily: typography.fonts.bold,
  },
  scrollArea: { flex: 1 },
  scrollContent: { paddingHorizontal: spacing.lg },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EEE8F6',
    shadowColor: '#493068',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3
  },
  cardUnread: {
    borderColor: '#D8CCF6',
    backgroundColor: '#FAF8FE',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3EEFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: 14,
    color: colors.textPrimary,
  },
  blueDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.buttonPrimary,
  },
  cardMessage: {
    fontFamily: typography.fonts.regular,
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
  cardTime: {
    fontFamily: typography.fonts.regular,
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 6,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
    paddingHorizontal: 30,
  },
  checkCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: 16,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  emptySub: {
    fontFamily: typography.fonts.regular,
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
});
