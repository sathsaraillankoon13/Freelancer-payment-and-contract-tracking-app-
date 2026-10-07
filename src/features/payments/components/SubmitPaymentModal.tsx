import { ScreenBackdrop } from '@/components/ui/Surface';
import { pickAttachment } from '@/services/attachments';
import { money } from '@/utils/finance';
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
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppContext } from '@/context/AppContext';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';

export const SubmitPaymentModal: React.FC = () => {
  const insets = useSafeAreaInsets();
  const {
    activeModal,
    closeModal,
    selectedInvoiceId,
    invoices,
    submitPayment,
  } = useAppContext();

  const isVisible = activeModal === 'submit_payment';
  const invoice = invoices.find((i) => i.id === selectedInvoiceId) || invoices[0];

  const [amount, setAmount] = useState(
    invoice ? String(invoice.outstandingAmount) : ''
  );
  const [method, setMethod] = useState<'Bank Transfer' | 'Direct Deposit' | 'Online'>('Bank Transfer');
  const [refNumber, setRefNumber] = useState('');
  const [proofAttachment, setProofAttachment] = useState<FileAttachment | null>(null);
  const proofFileName = proofAttachment?.name || 'Choose a receipt';
  const chooseProof = async () => { try { const file = await pickAttachment(['image/*', 'application/pdf']); if (file) setProofAttachment(file); } catch (error) { Alert.alert('Unable to attach receipt', error instanceof Error ? error.message : 'Please try again.'); } }; 
  const [proofNote, setProofNote] = useState('');
  const [error, setError] = useState('');

  if (!invoice) return null;

  const handleSubmit = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid payment amount');
      return;
    }
    if (numAmount > invoice.outstandingAmount) {
      setError(`Amount cannot exceed outstanding balance (${money(invoice.outstandingAmount, invoice.currency)})`);
      return;
    }
    if (!refNumber.trim()) {
      setError('Please provide a bank transfer reference number');
      return;
    }

    try { submitPayment({
      invoiceId: invoice.id,
      amount: numAmount,
      paymentMethod: method,
      referenceNumber: refNumber.trim(),
      proofFileName: proofAttachment?.name,
      proofAttachment: proofAttachment || undefined,
      proofNote: proofNote.trim(),
    });

    } catch (error) { setError(error instanceof Error ? error.message : 'Unable to submit payment.'); return; }
    closeModal();
    setRefNumber('');
    setError('');

    Alert.alert(
      'Payment Submitted',
      `Payment submission of ${money(numAmount, invoice.currency)} was saved for review on this device.`,
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
          <Text style={styles.headerTitle}>Submit Payment</Text>
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
          {/* Invoice Summary Card */}
          <View style={styles.invoiceCard}>
            <View style={styles.invoiceCardHeader}>
              <Text style={styles.invoiceNumber}>{invoice.invoiceNumber}</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusBadgeText}>{invoice.status}</Text>
              </View>
            </View>
            <Text style={styles.projectTitle}>{invoice.projectTitle}</Text>
            <View style={styles.divider} />
            <View style={styles.balanceRow}>
              <Text style={styles.balanceLabel}>Outstanding Balance:</Text>
              <Text style={styles.balanceAmount}>
                {invoice.currency} {invoice.outstandingAmount.toLocaleString()}
              </Text>
            </View>
          </View>

          {/* Form */}
          <View style={styles.card}>
            <Text style={styles.fieldLabel}>Payment Amount (LKR) *</Text>
            <View style={styles.inputBox}>
              <Text style={styles.currencyPrefix}>LKR</Text>
              <TextInput
                style={styles.textInput}
                keyboardType="numeric"
                value={amount}
                onChangeText={(t) => {
                  setAmount(t);
                  if (error) setError('');
                }}
              />
            </View>

            <Text style={styles.fieldLabel}>Payment Method</Text>
            <View style={styles.methodsRow}>
              {(['Bank Transfer', 'Direct Deposit', 'Online'] as const).map((m) => (
                <TouchableOpacity
                  key={m}
                  style={[styles.methodPill, method === m && styles.methodPillActive]}
                  onPress={() => setMethod(m)}
                >
                  <Text
                    style={[styles.methodPillText, method === m && styles.methodPillTextActive]}
                  >
                    {m}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.fieldLabel}>Transaction / Reference # *</Text>
            <View style={styles.inputBox}>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. TXN-9842104"
                placeholderTextColor={colors.textMuted}
                value={refNumber}
                onChangeText={(t) => {
                  setRefNumber(t);
                  if (error) setError('');
                }}
              />
            </View>

            <Text style={styles.fieldLabel}>Payment Proof Document</Text>
            <View style={styles.proofBox}>
              <MaterialCommunityIcons name="file-image-outline" size={24} color={colors.buttonPrimary} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.proofFileName}>{proofFileName}</Text>
                <Text style={styles.proofSubText}>{proofAttachment ? 'Saved on this device' : 'Image or PDF · up to 20 MB'}</Text>
              </View>
              <TouchableOpacity
                onPress={chooseProof}
                style={styles.replaceBtn}
              >
                <Text style={styles.replaceBtnText}>Change</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.fieldLabel}>Notes for Provider (Optional)</Text>
            <View style={[styles.inputBox, { height: 75, alignItems: 'flex-start' }]}>
              <TextInput
                style={[styles.textInput, { textAlignVertical: 'top' }]}
                placeholder="e.g. Paid via Commercial Bank online portal."
                placeholderTextColor={colors.textMuted}
                multiline
                numberOfLines={2}
                value={proofNote}
                onChangeText={setProofNote}
              />
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>

          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} activeOpacity={0.8}>
            <Feather name="send" size={18} color={colors.white} />
            <Text style={styles.submitBtnText}>Submit Payment for Verification</Text>
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
  invoiceCard: {
    backgroundColor: '#F3EEFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },
  invoiceCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  invoiceNumber: {
    fontFamily: typography.fonts.bold,
    fontSize: 16,
    color: colors.textPrimary,
  },
  statusBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontFamily: typography.fonts.medium,
    fontSize: 12,
    color: colors.buttonPrimary,
  },
  projectTitle: {
    fontFamily: typography.fonts.regular,
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5DCF8',
    marginVertical: 12,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceLabel: {
    fontFamily: typography.fonts.medium,
    fontSize: 13,
    color: colors.textSecondary,
  },
  balanceAmount: {
    fontFamily: typography.fonts.bold,
    fontSize: 18,
    color: colors.buttonPrimary,
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
  currencyPrefix: {
    fontFamily: typography.fonts.bold,
    fontSize: 14,
    color: colors.buttonPrimary,
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontFamily: typography.fonts.regular,
    fontSize: 14,
    color: colors.textPrimary,
  },
  methodsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  methodPill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#FAF9FD',
    borderWidth: 1,
    borderColor: '#E2D9F3',
    alignItems: 'center',
  },
  methodPillActive: {
    backgroundColor: '#F1EAFD',
    borderColor: colors.buttonPrimary,
  },
  methodPillText: {
    fontFamily: typography.fonts.medium,
    fontSize: 11,
    color: colors.textSecondary,
  },
  methodPillTextActive: {
    color: colors.buttonPrimary,
    fontFamily: typography.fonts.bold,
  },
  proofBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF9FD',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2D9F3',
    padding: 12,
  },
  proofFileName: {
    fontFamily: typography.fonts.medium,
    fontSize: 13,
    color: colors.textPrimary,
  },
  proofSubText: {
    fontFamily: typography.fonts.regular,
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  replaceBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2D9F3',
  },
  replaceBtnText: {
    fontFamily: typography.fonts.medium,
    fontSize: 12,
    color: colors.buttonPrimary,
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
