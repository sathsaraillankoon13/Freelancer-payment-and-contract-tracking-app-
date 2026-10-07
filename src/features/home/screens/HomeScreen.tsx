import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
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

// Feature screens for other tabs
import { ProjectsScreen } from '@/features/projects/screens/ProjectsScreen';
import { FinanceScreen } from '@/features/invoices/screens/FinanceScreen';
import { MessagesScreen } from '@/features/messages/screens/MessagesScreen';
import { MoreSettingsScreen } from '@/features/settings/screens/MoreSettingsScreen';

// Screens


export const HomeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const {
    currentRole,
    notifications,
    currentUser,
    activeTab,
    setActiveTab,
    openNotificationCenterModal,
  } = useAppContext();

  const handleTabPress = (tab: TabName) => {
    setActiveTab(tab);
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Screen Top Header (Visible on Home tab) */}
      {activeTab === 'home' && (
        <>
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
              onPress={openNotificationCenterModal}
            >
              <Feather name="bell" size={22} color={colors.textPrimary} />
              {unreadCount > 0 && <View style={styles.unreadDot} />}
            </TouchableOpacity>
          </View>

        </>
      )}

      {/* Dynamic Content by Active Tab */}
      <View style={styles.content}>
        {activeTab === 'home' && (
          currentRole === 'client' ? (
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
          )
        )}

        {activeTab === 'projects' && <ProjectsScreen />}

        {activeTab === 'messages' && <MessagesScreen />}

        {activeTab === 'finance' && <FinanceScreen />}

        {activeTab === 'more' && <MoreSettingsScreen />}
      </View>

      {/* Bottom Navigation */}
      <BottomTabBar activeTab={activeTab} onTabPress={handleTabPress} />
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
  content: {
    flex: 1,
  },
});

export default HomeScreen;
