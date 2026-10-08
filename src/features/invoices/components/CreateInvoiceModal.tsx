import { ScreenBackdrop } from '@/components/ui/Surface';
import { dateKey, parseDate } from '@/utils/dates';
import { money } from '@/utils/finance';
import { MotionTouchable as TouchableOpacity, MotionModal as Modal } from '@/components/ui/Motion';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useAppContext } from '@/context/AppContext';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';

export const CreateInvoiceModal: React.FC = () => {
  const insets = useSafeAreaInsets();
  const {
    activeModal,
    closeModal,
    clients,
    projects,
    addInvoice,
    currentUser,
    openAddClientModal,
    openCreateProjectModal,
  } = useAppContext();

  const isVisible = activeModal === 'create_invoice';

  const [chosenClientId, setSelectedClientId] = useState<string>(
    clients[0]?.id || ''
  );
  const [chosenProjectId, setSelectedProjectId] = useState<string>(
    projects[0]?.id || ''
  );
  const [items, setItems] = useState<
    { id: string; description: string; quantity: string; rate: string }[]
  >([{ id: 'item_1', description: '', quantity: '1', rate: '' }]);
  const [dueDate, setDueDate] = useState(() =>
    dateKey(new Date(Date.now() + 30 * 86400000))
  );
  const [taxRate, setTaxRate] = useState('');
  const [discount, setDiscount] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const selectedClientId =
    clients.find((c) => c.id === chosenClientId)?.id || clients[0]?.id || '';
  const clientProjects = projects.filter((p) => p.clientId === selectedClientId);
  const selectedProjectId =
    clientProjects.find((p) => p.id === chosenProjectId)?.id ||
    clientProjects[0]?.id ||
    '';

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      { id: `item_${Date.now()}`, description: '', quantity: '1', rate: '' },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const handleUpdateItem = (
    id: string,
    field: 'description' | 'quantity' | 'rate',
    val: string
  ) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, [field]: val } : it))
    );
  };

  const subtotal = items.reduce((sum, it) => {
    const q = Number(it.quantity) || 0;
    const r = Number(it.rate) || 0;
    return sum + q * r;
  }, 0);
  const taxAmount = subtotal * ((Number(taxRate) || 0) / 100);
  const discountAmount = Number(discount) || 0;
  const total = Math.max(0, subtotal + taxAmount - discountAmount);

  const handleSubmit = (status: 'Draft' | 'Sent') => {
    if (clients.length === 0) {
      setError('Please add a client before creating an invoice');
      return;
    }
    if (!selectedProjectId) {
      setError('Please create a project for this client before creating an invoice');
      return;
    }
    const validItems = items.map((it, idx) => {
      const q = Number(it.quantity) || 1;
      const r = Number(it.rate) || 0;
      return {
        id: it.id || `item_${Date.now()}_${idx}`,
        description: it.description.trim() || 'Professional Services',
        quantity: q,
        rate: r,
        amount: q * r,
      };
    });
    if (validItems.some((it) => it.rate <= 0)) {
      setError('Please provide a rate greater than 0 for all items');
      return;
    }
    if (!parseDate(dueDate)) {
      setError('Please enter a valid due date (YYYY-MM-DD)');
      return;
    }

    try {
      const created = addInvoice({
        clientId: selectedClientId,
        projectId: selectedProjectId,
        dueDate,
        items: validItems,
        taxRate: Number(taxRate) || undefined,
        discount: Number(discount) || undefined,
        notes: notes.trim() || undefined,
        status,
      });

      closeModal();
      setItems([{ id: 'item_1', description: '', quantity: '1', rate: '' }]);
      setTaxRate('');
      setDiscount('');
      setNotes('');
      setError('');
      Alert.alert('Invoice Created', `Invoice #${created.invoiceNumber} has been successfully created!`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save invoice.');
    }
  };

  const selectedClient = clients.find((c) => c.id === selectedClientId) || clients[0];

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
          <TouchableOpacity
            style={styles.backButton}
            onPress={closeModal}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather name="arrow-left" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create invoice</Text>
          <TouchableOpacity style={styles.headerRight} onPress={closeModal}>
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
          {/* Card: Client Selection */}
          <Text style={styles.fieldLabel}>Select Client</Text>
          {clients.length === 0 ? (
            <TouchableOpacity
              style={styles.emptyNoticeCard}
              onPress={() => {
                closeModal();
                openAddClientModal();
              }}
            >
              <Ionicons name="person-add-outline" size={18} color={colors.buttonPrimary} />
              <Text style={styles.emptyNoticeText}>No clients added yet. Tap to add a client.</Text>
            </TouchableOpacity>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.horizontalPicker}
            >
              {clients.map((c) => {
                const isSelected = c.id === selectedClientId;
                return (
                  <TouchableOpacity
                    key={c.id}
                    style={[
                      styles.pickerCard,
                      isSelected && styles.pickerCardSelected,
                    ]}
                    onPress={() => {
                      setSelectedClientId(c.id);
                      const matching = projects.find((p) => p.clientId === c.id);
                      setSelectedProjectId(matching?.id || '');
                    }}
                  >
                    <Text
                      style={[
                        styles.pickerCardTitle,
                        isSelected && styles.pickerCardTitleSelected,
                      ]}
                    >
                      {c.name}
                    </Text>
                    <Text style={styles.pickerCardSub}>{c.companyName}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}

          {/* Project Selection */}
          <Text style={styles.fieldLabel}>Select Project</Text>
          {clientProjects.length === 0 ? (
            <TouchableOpacity
              style={styles.emptyNoticeCard}
              onPress={() => {
                closeModal();
                openCreateProjectModal();
              }}
            >
              <Ionicons name="folder-open-outline" size={18} color={colors.buttonPrimary} />
              <Text style={styles.emptyNoticeText}>No projects yet. Tap to create a project first.</Text>
            </TouchableOpacity>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.horizontalPicker}
            >
              {clientProjects.map((p) => {
                const isSelected = p.id === selectedProjectId;
                return (
                  <TouchableOpacity
                    key={p.id}
                    style={[
                      styles.pickerCard,
                      isSelected && styles.pickerCardSelected,
                    ]}
                    onPress={() => setSelectedProjectId(p.id)}
                  >
                    <Text
                      style={[
                        styles.pickerCardTitle,
                        isSelected && styles.pickerCardTitleSelected,
                      ]}
                    >
                      {p.title}
                    </Text>
                    <Text style={styles.pickerCardSub}>{p.clientName}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}

          {/* Due Date */}
          <Text style={styles.fieldLabel}>Due Date</Text>
          <View style={styles.inputBox}>
            <Feather name="calendar" size={16} color={colors.buttonPrimary} />
            <TextInput
              style={styles.textInput}
              value={dueDate}
              onChangeText={setDueDate}
              placeholder="YYYY-MM-DD"
            />
          </View>

          {/* Line Items Section */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
            <Text style={styles.fieldLabel}>Line Items ({items.length})</Text>
            <TouchableOpacity onPress={handleAddItem} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Feather name="plus-circle" size={14} color={colors.buttonPrimary} />
              <Text style={{ fontFamily: typography.fonts.bold, fontSize: 12, color: colors.buttonPrimary }}>
                + Add item
              </Text>
            </TouchableOpacity>
          </View>

          {items.map((item, index) => {
            const itemTotal = (Number(item.quantity) || 0) * (Number(item.rate) || 0);
            return (
              <View key={item.id} style={styles.lineItemCard}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <Text style={{ fontFamily: typography.fonts.bold, fontSize: 12, color: colors.textPrimary }}>
                    Item #{index + 1}
                  </Text>
                  {items.length > 1 && (
                    <TouchableOpacity onPress={() => handleRemoveItem(item.id)} style={{ padding: 4 }}>
                      <Feather name="trash-2" size={14} color={colors.textMuted} />
                    </TouchableOpacity>
                  )}
                </View>
                <TextInput
                  style={[styles.inputBox, { marginBottom: 8 }]}
                  placeholder="Item description / milestone"
                  value={item.description}
                  onChangeText={(val) => handleUpdateItem(item.id, 'description', val)}
                />
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 11, fontFamily: typography.fonts.medium, color: colors.textSecondary, marginBottom: 2 }}>
                      Qty
                    </Text>
                    <TextInput
                      style={styles.inputBox}
                      placeholder="1"
                      value={item.quantity}
                      keyboardType="numeric"
                      onChangeText={(val) => handleUpdateItem(item.id, 'quantity', val)}
                    />
                  </View>
                  <View style={{ flex: 2 }}>
                    <Text style={{ fontSize: 11, fontFamily: typography.fonts.medium, color: colors.textSecondary, marginBottom: 2 }}>
                      Rate ({currentUser?.currency || 'LKR'})
                    </Text>
                    <TextInput
                      style={styles.inputBox}
                      placeholder="50,000"
                      value={item.rate}
                      keyboardType="numeric"
                      onChangeText={(val) => handleUpdateItem(item.id, 'rate', val)}
                    />
                  </View>
                  <View style={{ flex: 1.5, justifyContent: 'center', alignItems: 'flex-end' }}>
                    <Text style={{ fontSize: 10, fontFamily: typography.fonts.regular, color: colors.textSecondary }}>
                      Amount
                    </Text>
                    <Text style={{ fontSize: 13, fontFamily: typography.fonts.bold, color: colors.textPrimary }}>
                      {money(itemTotal, currentUser?.currency || 'LKR')}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}

          {/* Tax and Discount */}
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.fieldLabel}>Tax Rate (%)</Text>
              <TextInput
                style={styles.inputBox}
                placeholder="0"
                value={taxRate}
                keyboardType="numeric"
                onChangeText={setTaxRate}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.fieldLabel}>Discount ({currentUser?.currency || 'LKR'})</Text>
              <TextInput
                style={styles.inputBox}
                placeholder="0"
                value={discount}
                keyboardType="numeric"
                onChangeText={setDiscount}
              />
            </View>
          </View>

          {/* Notes */}
          <Text style={styles.fieldLabel}>Notes & Instructions</Text>
          <TextInput
            style={[styles.inputBox, { minHeight: 60 }]}
            placeholder="Payment details, bank account info, or terms..."
            value={notes}
            onChangeText={setNotes}
            multiline
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Summary Preview */}
          <View style={styles.previewBox}>
            <Text style={styles.previewTitle}>Invoice Calculation Summary</Text>
            <View style={styles.previewRow}>
              <Text style={styles.previewLabel}>Client:</Text>
              <Text style={styles.previewVal}>{selectedClient?.name}</Text>
            </View>
            <View style={styles.previewRow}>
              <Text style={styles.previewLabel}>Subtotal:</Text>
              <Text style={styles.previewVal}>{money(subtotal, currentUser?.currency || 'LKR')}</Text>
            </View>
            {taxAmount > 0 && (
              <View style={styles.previewRow}>
                <Text style={styles.previewLabel}>Tax ({taxRate}%):</Text>
                <Text style={styles.previewVal}>+{money(taxAmount, currentUser?.currency || 'LKR')}</Text>
              </View>
            )}
            {discountAmount > 0 && (
              <View style={styles.previewRow}>
                <Text style={styles.previewLabel}>Discount:</Text>
                <Text style={[styles.previewVal, { color: '#DC2626' }]}>
                  -{money(discountAmount, currentUser?.currency || 'LKR')}
                </Text>
              </View>
            )}
            <View style={[styles.previewRow, { borderTopWidth: 1, borderTopColor: '#ECEAF5', paddingTop: 6, marginTop: 4 }]}>
              <Text style={[styles.previewLabel, { fontFamily: typography.fonts.bold }]}>Total Due:</Text>
              <Text style={[styles.previewVal, { fontFamily: typography.fonts.bold, color: colors.buttonPrimary, fontSize: 16 }]}>
                {money(total, currentUser?.currency || 'LKR')}
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Bar with Save Draft and Issue Invoice */}
        <View
          style={[
            styles.bottomBar,
            { paddingBottom: Math.max(insets.bottom, 16) },
          ]}
        >
          <TouchableOpacity
            style={styles.draftBtn}
            onPress={() => handleSubmit('Draft')}
            activeOpacity={0.8}
          >
            <Feather name="file-text" size={16} color={colors.textSecondary} />
            <Text style={styles.draftBtnText}>Save Draft</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={() => handleSubmit('Sent')}
            activeOpacity={0.8}
          >
            <Ionicons name="paper-plane-outline" size={16} color={colors.white} />
            <Text style={styles.submitBtnText}>Issue Invoice</Text>
          </TouchableOpacity>
        </View>
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
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EFF6',
    backgroundColor: colors.white,
    paddingBottom: 16,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary
  },
  headerRight: {
    padding: 4,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  fieldLabel: {
    fontSize: 13,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary,
    marginBottom: 8,
    marginTop: 12,
  },
  horizontalPicker: {
    marginBottom: 8,
  },
  emptyNoticeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FAF8FE',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#DDD6FE',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  emptyNoticeText: {
    fontSize: 12,
    fontFamily: typography.fonts.medium,
    color: colors.buttonPrimary,
    flex: 1,
  },
  pickerCard: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginRight: 10,
    minWidth: 140,
  },
  pickerCardSelected: {
    borderColor: colors.buttonPrimary,
    backgroundColor: '#FAF8FE',
  },
  pickerCardTitle: {
    fontSize: 13,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary,
  },
  pickerCardTitleSelected: {
    color: colors.buttonPrimary,
  },
  pickerCardSub: {
    fontSize: 11,
    fontFamily: typography.fonts.regular,
    color: colors.textMuted,
    marginTop: 2,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 10,
  },
  inputBoxError: {
    borderColor: '#E11D48',
  },
  currencyPrefix: {
    fontSize: 14,
    fontFamily: typography.fonts.bold,
    color: colors.textSecondary,
  },
  amountInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: typography.fonts.medium,
    color: colors.textPrimary,
  },
  errorText: {
    fontSize: 11,
    color: '#E11D48',
    marginTop: 4,
  },
  previewBox: {
    backgroundColor: '#F3EFFC',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#DDD6FE',
    marginTop: 20,
    gap: 8,
  },
  previewTitle: {
    fontSize: 13,
    fontFamily: typography.fonts.bold,
    color: colors.buttonPrimary,
    marginBottom: 4,
  },
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  previewLabel: {
    fontSize: 12,
    fontFamily: typography.fonts.medium,
    color: colors.textSecondary,
  },
  previewVal: {
    fontSize: 12,
    fontFamily: typography.fonts.bold,
    color: colors.textPrimary,
  },
  lineItemCard: {
    backgroundColor: '#F8F7FC',
    borderRadius: 12,
    padding: 10,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#ECEAF5',
  },
  bottomBar: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: '#F0EFF6',
    paddingHorizontal: 20,
    paddingTop: 14,
    flexDirection: 'row',
    gap: 10,
    shadowColor: '#493068',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
  },
  draftBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 24,
    paddingVertical: 14,
  },
  draftBtnText: {
    fontSize: 14,
    fontFamily: typography.fonts.bold,
    color: colors.textSecondary,
  },
  submitBtn: {
    flex: 1.3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.buttonPrimary,
    borderRadius: 24,
    paddingVertical: 14,
  },
  submitBtnText: {
    fontSize: 14,
    fontFamily: typography.fonts.bold,
    color: colors.white,
  },
});
