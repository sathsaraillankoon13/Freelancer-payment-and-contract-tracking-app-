import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { useAppContext } from '@/context/AppContext';
import { FreelancerHomeView } from '@/features/home/components/FreelancerHomeView';
import { ClientHomeView } from '@/features/home/components/ClientHomeView';
import { BottomTabBar, TabName } from '@/components/navigation/BottomTabBar';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { UserRole } from '@/types';

export const HomeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { currentRole, switchRole, notifications, currentUser } = useAppContext();
  const [activeTab, setActiveTab] = useState<TabName>('home');
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);

  const handleTabPress = (tab: TabName) => {
    setActiveTab(tab);
    if (tab !== 'home') {
      Alert.alert(
        `${tab.toUpperCase()} Section`,
        `The ${tab} workspace will be connected in the next stage according to the product roadmap.`,
        [{ text: 'OK', onPress: () => setActiveTab('home') }]
      );
    }
  };

  const handleNotificationPress = () => {
    setShowNotificationsModal(true);
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Screen Top Header */}
      <View
        style={[
          styles.headerBar,
          { paddingTop: Math.max(insets.top, 12) },
        ]}
      >
        <View style={styles.headerLeft}>
          <View style={styles.userAvatar}>
            <Text style={styles.userAvatarText}>
              {currentUser.firstName.slice(0, 2).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.headerTitle}>Home</Text>
        </View>

        <TouchableOpacity
          style={styles.bellButton}
          activeOpacity={0.7}
          onPress={handleNotificationPress}
        >
          <Feather name="bell" size={22} color={colors.textPrimary} />
          {unreadCount > 0 && <View style={styles.unreadDot} />}
        </TouchableOpacity>
      </View>

      {/* Development Role Switcher Banner */}
      <View style={styles.devBanner}>
        <Text style={styles.devBannerLabel}>DEMO ROLE:</Text>
        <View style={styles.devRoleSwitchRow}>
          <TouchableOpacity
            style={[
              styles.devRoleButton,
              currentRole === 'freelancer' && styles.devRoleButtonActive,
            ]}
            onPress={() => switchRole('freelancer')}
          >
            <Text
              style={[
                styles.devRoleButtonText,
                currentRole === 'freelancer' && styles.devRoleButtonTextActive,
              ]}
            >
              Freelancer (Kasun)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.devRoleButton,
              currentRole === 'client' && styles.devRoleButtonActive,
            ]}
            onPress={() => switchRole('client')}
          >
            <Text
              style={[
                styles.devRoleButtonText,
                currentRole === 'client' && styles.devRoleButtonTextActive,
              ]}
            >
              Client (Senuri)
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Role-Specific Dashboard Content */}
      <View style={styles.content}>
        {currentRole === 'client' ? (
          <ClientHomeView
            onNavigateToProjects={() => handleTabPress('projects')}
            onNavigateToFinance={() => handleTabPress('finance')}
            onNavigateToMessages={() => handleTabPress('messages')}
          />
        ) : (
          <FreelancerHomeView
            onNavigateToProjects={() => handleTabPress('projects')}
            onNavigateToFinance={() => handleTabPress('finance')}
            onNavigateToMessages={() => handleTabPress('messages')}
          />
        )}
      </View>

      {/* Bottom Navigation */}
      <BottomTabBar activeTab={activeTab} onTabPress={handleTabPress} />

      {/* Notifications Modal */}
      <Modal
        visible={showNotificationsModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowNotificationsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalSheet,
              { paddingBottom: Math.max(insets.bottom, 20) },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Notifications</Text>
              <TouchableOpacity
                onPress={() => setShowNotificationsModal(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Feather name="x" size={22} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {notifications.map((item) => (
                <View key={item.id} style={styles.notificationItem}>
                  <View style={styles.notifIconCircle}>
                    <Feather
                      name={item.type === 'payment' ? 'check-circle' : 'message-circle'}
                      size={18}
                      color={colors.buttonPrimary}
                    />
                  </View>
                  <View style={styles.notifContent}>
                    <Text style={styles.notifItemTitle}>{item.title}</Text>
                    <Text style={styles.notifItemMessage}>{item.message}</Text>
                    <Text style={styles.notifItemTime}>{item.timeAgo}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: colors.background,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.buttonPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatarText: {
    fontFamily: typography.fonts.bold,
    fontSize: 14,
    color: colors.white,
  },
  headerTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: 20,
    color: colors.textPrimary,
  },
  bellButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  unreadDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.buttonPrimary,
    borderWidth: 1.5,
    borderColor: colors.background,
  },
  devBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3EEFB',
    marginHorizontal: 20,
    marginBottom: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    gap: 8,
  },
  devBannerLabel: {
    fontFamily: typography.fonts.bold,
    fontSize: 10,
    color: colors.buttonPrimary,
    letterSpacing: 0.5,
  },
  devRoleSwitchRow: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 2,
  },
  devRoleButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  devRoleButtonActive: {
    backgroundColor: colors.buttonPrimary,
  },
  devRoleButtonText: {
    fontFamily: typography.fonts.medium,
    fontSize: 11,
    color: colors.textSecondary,
  },
  devRoleButtonTextActive: {
    color: colors.white,
    fontFamily: typography.fonts.bold,
  },
  content: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 16,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EFF6',
  },
  modalTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: 18,
    color: colors.textPrimary,
  },
  notificationItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5FA',
  },
  notifIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.pillPurpleBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notifContent: {
    flex: 1,
  },
  notifItemTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  notifItemMessage: {
    fontFamily: typography.fonts.regular,
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  notifItemTime: {
    fontFamily: typography.fonts.regular,
    fontSize: 11,
    color: colors.textMuted,
  },
});

export default HomeScreen;
