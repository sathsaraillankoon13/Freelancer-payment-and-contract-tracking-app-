import { ScreenBackdrop } from '@/components/ui/Surface';
import { MotionTouchable as TouchableOpacity, MotionModal as Modal } from '@/components/ui/Motion';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  Share,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppContext } from '@/context/AppContext';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { ClientContact } from '@/types';

interface ClientDetailsContentProps {
  client: ClientContact;
  closeModal: () => void;
}

const ClientDetailsContent: React.FC<ClientDetailsContentProps> = ({
  client,
  closeModal,
}) => {
  const insets = useSafeAreaInsets();
  const {
    projects,
    invoices,
    deliverables,
    updateClient,
    archiveClient,
    deleteClient,
    inviteClient,
    openProjectDetailsModal,
    openCreateProjectModal,
    openMessagesThreadModal,
  } = useAppContext();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(client.name);
  const [editCompany, setEditCompany] = useState(client.companyName);
  const [editEmail, setEditEmail] = useState(client.email);
  const [editPhone, setEditPhone] = useState(client.phone || '');
  const [editAddress, setEditAddress] = useState(client.billingAddress || '');

  const clientProjects = projects.filter((p) => p.clientId === client.id);
  const clientInvoices = invoices.filter((i) => i.clientId === client.id);
  const clientDeliverables = deliverables.filter((d) =>
    clientProjects.some((p) => p.id === d.projectId)
  );

  const totalBilled = clientInvoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
  const totalPaid = clientInvoices.reduce((sum, inv) => sum + (inv.paidAmount || 0), 0);
  const outstanding = clientInvoices
    .filter((inv) => inv.status !== 'Paid' && inv.status !== 'Void')
    .reduce((sum, inv) => sum + (inv.totalAmount - (inv.paidAmount || 0)), 0);

  const handleSaveEdit = () => {
    if (!editName.trim()) {
      Alert.alert('Validation Error', 'Client name is required.');
      return;
    }
    updateClient(client.id, {
      name: editName.trim(),
      companyName: editCompany.trim() || `${editName.trim()} Company`,
      email: editEmail.trim(),
      phone: editPhone.trim(),
      billingAddress: editAddress.trim(),
    });
    setIsEditing(false);
  };

  const handleArchiveToggle = () => {
    archiveClient(client.id, !client.isArchived);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Client',
      `Are you sure you want to delete ${client.name}? This will check for any linked projects or financial history.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const result = deleteClient(client.id);
            if (!result.success) {
              Alert.alert(
                'Cannot Delete Client',
                `${result.reason}\n\nWould you like to archive this client instead to preserve project and financial history?`,
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Archive Client',
                    onPress: () => archiveClient(client.id, true),
                  },
                ]
              );
            } else {
              closeModal();
            }
          },
        },
      ]
    );
  };

  const handleShareInvite = async () => {
    inviteClient(client.id);
    const code = client.inviteCode || 'ISAAC-' + client.id.slice(0, 6).toUpperCase();
    try {
      await Share.share({
        message: `Hello ${client.name}, join your ISAACIFY client portal using invitation code: ${code}`,
      });
    } catch {
      // share dismissed
    }
  };

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 16) }]}>
      <ScreenBackdrop />
        
        {/* Header Bar */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={closeModal}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather name="arrow-left" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {client.name}
          </Text>
          <View style={styles.headerRightActions}>
            <TouchableOpacity
              style={styles.headerIconButton}
              onPress={() => setIsEditing(!isEditing)}
            >
              <Feather
                name={isEditing ? 'x' : 'edit-2'}
                size={18}
                color={colors.buttonPrimary}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIconButton} onPress={closeModal}>
              <Feather name="x" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom, 24) + 60 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Client Identity Card */}
          <View style={styles.profileCard}>
            <View style={styles.profileRow}>
              <View style={styles.avatarBox}>
                <Text style={styles.avatarText}>
                  {client.initials || client.name.slice(0, 2).toUpperCase()}
                </Text>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{client.name}</Text>
                <Text style={styles.profileCompany}>{client.companyName}</Text>
                <View style={styles.badgeRow}>
                  <View
                    style={[
                      styles.statusBadge,
                      client.isArchived
                        ? styles.archivedBadge
                        : styles.activeBadge,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusBadgeText,
                        client.isArchived
                          ? styles.archivedBadgeText
                          : styles.activeBadgeText,
                      ]}
                    >
                      {client.isArchived ? 'Archived' : 'Active Client'}
                    </Text>
                  </View>
                  <View style={styles.inviteBadge}>
                    <Text style={styles.inviteBadgeText}>
                      {client.invitationStatus === 'accepted'
                        ? 'Portal Linked'
                        : client.invitationStatus === 'invited'
                        ? 'Invited'
                        : 'Contact Only'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Quick Contact Buttons */}
            <View style={styles.quickActionRow}>
              <TouchableOpacity
                style={styles.quickActionButton}
                onPress={() => openMessagesThreadModal(client.id)}
              >
                <Feather name="message-square" size={16} color={colors.buttonPrimary} />
                <Text style={styles.quickActionText}>Message</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickActionButton}
                onPress={handleShareInvite}
              >
                <Feather name="send" size={16} color={colors.buttonPrimary} />
                <Text style={styles.quickActionText}>Invite Code</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickActionButton}
                onPress={handleArchiveToggle}
              >
                <Feather
                  name={client.isArchived ? 'rotate-ccw' : 'archive'}
                  size={16}
                  color={colors.textSecondary}
                />
                <Text style={styles.quickActionText}>
                  {client.isArchived ? 'Restore' : 'Archive'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Edit Form or Details View */}
          {isEditing ? (
            <View style={styles.card}>
              <Text style={styles.cardSectionTitle}>Edit Client Details</Text>
              
              <Text style={styles.fieldLabel}>Client Name *</Text>
              <TextInput
                style={styles.input}
                value={editName}
                onChangeText={setEditName}
                placeholder="Full client name"
              />

              <Text style={styles.fieldLabel}>Company Name</Text>
              <TextInput
                style={styles.input}
                value={editCompany}
                onChangeText={setEditCompany}
                placeholder="Company / Organization"
              />

              <Text style={styles.fieldLabel}>Email Address</Text>
              <TextInput
                style={styles.input}
                value={editEmail}
                onChangeText={setEditEmail}
                placeholder="client@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Text style={styles.fieldLabel}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={editPhone}
                onChangeText={setEditPhone}
                placeholder="+94 77 123 4567"
                keyboardType="phone-pad"
              />

              <Text style={styles.fieldLabel}>Billing Address</Text>
              <TextInput
                style={[styles.input, { minHeight: 60 }]}
                value={editAddress}
                onChangeText={setEditAddress}
                placeholder="Street address, City, Country"
                multiline
              />

              <View style={styles.formButtonRow}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setIsEditing(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSaveEdit}
                >
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.card}>
              <Text style={styles.cardSectionTitle}>Contact & Billing Details</Text>
              <View style={styles.detailItem}>
                <Feather name="mail" size={16} color={colors.textSecondary} />
                <Text style={styles.detailLabel}>Email:</Text>
                <Text style={styles.detailValue}>{client.email || 'None'}</Text>
              </View>
              <View style={styles.detailItem}>
                <Feather name="phone" size={16} color={colors.textSecondary} />
                <Text style={styles.detailLabel}>Phone:</Text>
                <Text style={styles.detailValue}>{client.phone || 'None'}</Text>
              </View>
              <View style={styles.detailItem}>
                <Feather name="map-pin" size={16} color={colors.textSecondary} />
                <Text style={styles.detailLabel}>Billing:</Text>
                <Text style={styles.detailValue}>
                  {client.billingAddress || 'No address provided'}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Feather name="key" size={16} color={colors.buttonPrimary} />
                <Text style={styles.detailLabel}>Invite Code:</Text>
                <Text style={[styles.detailValue, { fontFamily: typography.fonts.bold, color: colors.buttonPrimary }]}>
                  {client.inviteCode || 'ISAAC-' + client.id.slice(0, 6).toUpperCase()}
                </Text>
              </View>
            </View>
          )}

          {/* Financial Overview Card */}
          <View style={styles.card}>
            <Text style={styles.cardSectionTitle}>Financial Overview</Text>
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Total Invoiced</Text>
                <Text style={styles.statValue}>LKR {totalBilled.toLocaleString()}</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Paid</Text>
                <Text style={[styles.statValue, { color: '#059669' }]}>
                  LKR {totalPaid.toLocaleString()}
                </Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Outstanding</Text>
                <Text
                  style={[
                    styles.statValue,
                    { color: outstanding > 0 ? '#DC2626' : colors.textPrimary },
                  ]}
                >
                  LKR {outstanding.toLocaleString()}
                </Text>
              </View>
            </View>
          </View>

          {/* Linked Projects Card */}
          <View style={styles.card}>
            <View style={styles.cardHeaderWithAction}>
              <Text style={styles.cardSectionTitle}>
                Projects ({clientProjects.length})
              </Text>
              <TouchableOpacity
                style={styles.addInlineButton}
                onPress={() => openCreateProjectModal()}
              >
                <Feather name="plus" size={14} color={colors.buttonPrimary} />
                <Text style={styles.addInlineText}>New Project</Text>
              </TouchableOpacity>
            </View>

            {clientProjects.length === 0 ? (
              <Text style={styles.emptyText}>No projects yet for this client.</Text>
            ) : (
              clientProjects.map((p) => (
                <TouchableOpacity
                  key={p.id}
                  style={styles.projectListItem}
                  onPress={() => openProjectDetailsModal(p.id)}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.projectListTitle}>{p.title}</Text>
                    <Text style={styles.projectListMeta}>
                      Status: {p.status || 'Active'} • {p.completedTasks || 0}/
                      {p.totalTasks || 0} tasks
                    </Text>
                  </View>
                  <Feather name="chevron-right" size={18} color={colors.textSecondary} />
                </TouchableOpacity>
              ))
            )}
          </View>

          {/* Linked Invoices Card */}
          <View style={styles.card}>
            <Text style={styles.cardSectionTitle}>
              Invoices ({clientInvoices.length})
            </Text>
            {clientInvoices.length === 0 ? (
              <Text style={styles.emptyText}>No invoices issued for this client.</Text>
            ) : (
              clientInvoices.map((inv) => (
                <View key={inv.id} style={styles.invoiceListItem}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.invoiceListNumber}>{inv.invoiceNumber}</Text>
                    <Text style={styles.invoiceListMeta}>
                      {inv.issueDate || 'Draft'} • Status: {inv.status}
                    </Text>
                  </View>
                  <Text style={styles.invoiceListAmount}>
                    {inv.currency || 'LKR'} {inv.totalAmount.toLocaleString()}
                  </Text>
                </View>
              ))
            )}
          </View>

          {/* Shared Deliverables Card */}
          <View style={styles.card}>
            <Text style={styles.cardSectionTitle}>
              Deliverables ({clientDeliverables.length})
            </Text>
            {clientDeliverables.length === 0 ? (
              <Text style={styles.emptyText}>No deliverables shared yet.</Text>
            ) : (
              clientDeliverables.map((del) => (
                <View key={del.id} style={styles.deliverableItem}>
                  <MaterialCommunityIcons
                    name="file-document-outline"
                    size={20}
                    color={colors.buttonPrimary}
                  />
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.deliverableTitle}>{del.deliverableName}</Text>
                    <Text style={styles.deliverableMeta}>Status: {del.status}</Text>
                  </View>
                </View>
              ))
            )}
          </View>

          {/* Safe Deletion Action */}
          <View style={styles.dangerZone}>
            <Text style={styles.dangerZoneTitle}>Danger Zone</Text>
            <Text style={styles.dangerZoneSubtitle}>
              Clients with active projects or issued invoices cannot be deleted to preserve history. You can archive them instead.
            </Text>
            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
              <Feather name="trash-2" size={16} color="#DC2626" />
              <Text style={styles.deleteButtonText}>Delete Client Record</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
  );
};

export const ClientDetailsModal: React.FC = () => {
  const { activeModal, closeModal, selectedClientId, clients } = useAppContext();
  const isVisible = activeModal === 'client_details' && !!selectedClientId;
  const client = clients.find((c) => c.id === selectedClientId);

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle={Platform.OS === 'ios' ? 'pageSheet' : 'fullScreen'}
      onRequestClose={closeModal}
    >
      {client ? (
        <ClientDetailsContent
          key={client.id}
          client={client}
          closeModal={closeModal}
        />
      ) : null}
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
    fontFamily: typography.fonts.bold,
    fontSize: 18,
    color: colors.textPrimary,
    flex: 1,
    marginHorizontal: 12,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIconButton: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#F3F0FA',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 14,
  },
  profileCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ECEAF5',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarBox: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.buttonPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.white,
    fontFamily: typography.fonts.bold,
    fontSize: 18,
  },
  profileInfo: {
    marginLeft: 14,
    flex: 1,
  },
  profileName: {
    fontFamily: typography.fonts.bold,
    fontSize: 18,
    color: colors.textPrimary,
  },
  profileCompany: {
    fontFamily: typography.fonts.medium,
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  activeBadge: {
    backgroundColor: '#DCFCE7',
  },
  archivedBadge: {
    backgroundColor: '#F3F4F6',
  },
  statusBadgeText: {
    fontSize: 11,
    fontFamily: typography.fonts.semiBold,
  },
  activeBadgeText: {
    color: '#15803D',
  },
  archivedBadgeText: {
    color: '#6B7280',
  },
  inviteBadge: {
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  inviteBadgeText: {
    fontSize: 11,
    color: '#6D28D9',
    fontFamily: typography.fonts.semiBold,
  },
  quickActionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F0FA',
  },
  quickActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#F5F3FF',
  },
  quickActionText: {
    fontFamily: typography.fonts.semiBold,
    fontSize: 12,
    color: colors.textPrimary,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ECEAF5',
  },
  cardSectionTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: 15,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  cardHeaderWithAction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addInlineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addInlineText: {
    fontFamily: typography.fonts.semiBold,
    fontSize: 12,
    color: colors.buttonPrimary,
  },
  fieldLabel: {
    fontFamily: typography.fonts.semiBold,
    fontSize: 12,
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
  formButtonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  cancelButtonText: {
    fontFamily: typography.fonts.semiBold,
    fontSize: 14,
    color: colors.textSecondary,
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: colors.buttonPrimary,
  },
  saveButtonText: {
    fontFamily: typography.fonts.bold,
    fontSize: 14,
    color: colors.white,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    gap: 8,
  },
  detailLabel: {
    fontFamily: typography.fonts.medium,
    fontSize: 13,
    color: colors.textSecondary,
    width: 85,
  },
  detailValue: {
    flex: 1,
    fontFamily: typography.fonts.regular,
    fontSize: 13,
    color: colors.textPrimary,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#F8F7FC',
    borderRadius: 10,
    padding: 10,
  },
  statLabel: {
    fontFamily: typography.fonts.medium,
    fontSize: 11,
    color: colors.textSecondary,
  },
  statValue: {
    fontFamily: typography.fonts.bold,
    fontSize: 14,
    color: colors.textPrimary,
    marginTop: 4,
  },
  projectListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F0FA',
  },
  projectListTitle: {
    fontFamily: typography.fonts.semiBold,
    fontSize: 14,
    color: colors.textPrimary,
  },
  projectListMeta: {
    fontFamily: typography.fonts.regular,
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  invoiceListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F0FA',
  },
  invoiceListNumber: {
    fontFamily: typography.fonts.semiBold,
    fontSize: 13,
    color: colors.textPrimary,
  },
  invoiceListMeta: {
    fontFamily: typography.fonts.regular,
    fontSize: 11,
    color: colors.textSecondary,
  },
  invoiceListAmount: {
    fontFamily: typography.fonts.bold,
    fontSize: 13,
    color: colors.textPrimary,
  },
  deliverableItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  deliverableTitle: {
    fontFamily: typography.fonts.semiBold,
    fontSize: 13,
    color: colors.textPrimary,
  },
  deliverableMeta: {
    fontFamily: typography.fonts.regular,
    fontSize: 11,
    color: colors.textSecondary,
  },
  emptyText: {
    fontFamily: typography.fonts.regular,
    fontSize: 13,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  dangerZone: {
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    marginTop: 8,
  },
  dangerZoneTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: 14,
    color: '#991B1B',
  },
  dangerZoneSubtitle: {
    fontFamily: typography.fonts.regular,
    fontSize: 12,
    color: '#7F1D1D',
    marginTop: 4,
    marginBottom: 12,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  deleteButtonText: {
    fontFamily: typography.fonts.semiBold,
    fontSize: 13,
    color: '#DC2626',
  },
});
