import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useAppContext } from '@/context/AppContext';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';



export default function RubricsTestScreen() {
  const insets = useSafeAreaInsets();
  const {
    openModal,
    openCreateProjectModal,
    openAddClientModal,
    openClientDetailsModal,
    openProjectDetailsModal,
    openCreateInvoiceModal,
    openSubmitPaymentModal,
    openSubmitDeliverableModal,
    openReviewDeliverableModal,
    projects,
    clients,
    invoices,
    deliverables,
  } = useAppContext();

  const sampleProjectId = projects[0]?.id || 'proj_1';
  const sampleClientId = clients[0]?.id || 'client_1';
  const sampleInvoiceId = invoices[0]?.id || 'inv_1';
  const sampleDeliverableId = deliverables[0]?.id || 'deliv_1';

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 16) }]}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/home')} style={styles.backBtn}>
          <Feather name="arrow-left" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All 4 Members Rubric Hub</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Member 1: Kumuditha */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionBadge}>MEMBER 1 · IT23567924</Text>
          <Text style={styles.sectionTitle}>Kumuditha Perera</Text>
          <Text style={styles.sectionDesc}>
            Auth, Role Selection, 6-digit OTP Email Verification, Project Terms/Clauses & Reminders CRUD
          </Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/auth/account-type')}>
              <Text style={styles.actionBtnText}>Role Select</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/auth/email-verification')}>
              <Text style={styles.actionBtnText}>OTP Verify</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/auth/forgot-password')}>
              <Text style={styles.actionBtnText}>Reset Pass</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.buttonRow, { marginTop: 8 }]}>
            <TouchableOpacity style={[styles.actionBtn, styles.actionBtnPurple]} onPress={() => openModal('project_terms', { projectId: sampleProjectId })}>
              <Text style={styles.actionBtnTextWhite}>Project Terms (CRUD)</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, styles.actionBtnPurple]} onPress={() => openModal('reminders')}>
              <Text style={styles.actionBtnTextWhite}>Reminders (CRUD)</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.buttonRow, { marginTop: 8 }]}>
            <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/contract-terms')}>
              <Text style={styles.actionBtnText}>Terms Screen</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/contract-preview')}>
              <Text style={styles.actionBtnText}>Preview Contract</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/contract-review')}>
              <Text style={styles.actionBtnText}>Review & Sign</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Member 2: Nimnadi */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionBadge}>MEMBER 2 · IT23569218</Text>
          <Text style={styles.sectionTitle}>Nimnadi S.D.T</Text>
          <Text style={styles.sectionDesc}>
            Finance Screen, Cashflow Analytics, Create Invoice (Line items), Payment Proof & Direct Cash
          </Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/finance')}>
              <Text style={styles.actionBtnText}>Finance Screen</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, styles.actionBtnPurple]} onPress={openCreateInvoiceModal}>
              <Text style={styles.actionBtnTextWhite}>Create Invoice (CRUD)</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.buttonRow, { marginTop: 8 }]}>
            <TouchableOpacity style={[styles.actionBtn, styles.actionBtnPurple]} onPress={() => openSubmitPaymentModal(sampleInvoiceId)}>
              <Text style={styles.actionBtnTextWhite}>Submit Payment Proof</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Member 3: Illankoon */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionBadge}>MEMBER 3 · IT23554818</Text>
          <Text style={styles.sectionTitle}>Illankoon I.A.K.S</Text>
          <Text style={styles.sectionDesc}>
            Tasks Management, Project Scope, Milestones & Timeline, Deliverable Upload & Review
          </Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.actionBtn, styles.actionBtnPurple]} onPress={() => router.push('/tasks')}>
              <Text style={styles.actionBtnTextWhite}>Tasks (CRUD 1)</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/scope')}>
              <Text style={styles.actionBtnText}>Project Scope</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/milestones')}>
              <Text style={styles.actionBtnText}>Milestones</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.buttonRow, { marginTop: 8 }]}>
            <TouchableOpacity style={[styles.actionBtn, styles.actionBtnPurple]} onPress={() => openSubmitDeliverableModal('ms_cb_2')}>
              <Text style={styles.actionBtnTextWhite}>Submit Deliverable</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, styles.actionBtnPurple]} onPress={() => openReviewDeliverableModal(sampleDeliverableId)}>
              <Text style={styles.actionBtnTextWhite}>Review Deliverable</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Member 4: Silva */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionBadge}>MEMBER 4 · IT23550780</Text>
          <Text style={styles.sectionTitle}>Silva S.T.S</Text>
          <Text style={styles.sectionDesc}>
            Projects CRUD, Clients Directory CRUD, Project Details & Deletion Audit, Messages Thread
          </Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/projects')}>
              <Text style={styles.actionBtnText}>Projects Screen</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/clients')}>
              <Text style={styles.actionBtnText}>Clients Screen</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/messages')}>
              <Text style={styles.actionBtnText}>Messages</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/onboarding')}>
              <Text style={styles.actionBtnText}>Onboarding</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.buttonRow, { marginTop: 8 }]}>
            <TouchableOpacity style={[styles.actionBtn, styles.actionBtnPurple]} onPress={openCreateProjectModal}>
              <Text style={styles.actionBtnTextWhite}>Create Project</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, styles.actionBtnPurple]} onPress={() => openProjectDetailsModal(sampleProjectId)}>
              <Text style={styles.actionBtnTextWhite}>Project Details</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.buttonRow, { marginTop: 8 }]}>
            <TouchableOpacity style={[styles.actionBtn, styles.actionBtnPurple]} onPress={openAddClientModal}>
              <Text style={styles.actionBtnTextWhite}>Add Client</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, styles.actionBtnPurple]} onPress={() => openClientDetailsModal(sampleClientId)}>
              <Text style={styles.actionBtnTextWhite}>Client Details</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, styles.actionBtnPurple]} onPress={() => openModal('messages_thread', { clientId: sampleClientId })}>
              <Text style={styles.actionBtnTextWhite}>Chat Thread</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9FD',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EFF6',
    gap: 12,
  },
  backBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#F3EEFB',
  },
  headerTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: 18,
    color: colors.textPrimary,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
  sectionCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F0EFF6',
    shadowColor: '#493068',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionBadge: {
    fontFamily: typography.fonts.bold,
    fontSize: 11,
    color: colors.buttonPrimary,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  sectionTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: 17,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  sectionDesc: {
    fontFamily: typography.fonts.regular,
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 12,
    lineHeight: 18,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  actionBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F3EEFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnPurple: {
    backgroundColor: colors.buttonPrimary,
  },
  actionBtnText: {
    fontFamily: typography.fonts.medium,
    fontSize: 12,
    color: colors.buttonPrimary,
  },
  actionBtnTextWhite: {
    fontFamily: typography.fonts.medium,
    fontSize: 12,
    color: colors.white,
  },
});
