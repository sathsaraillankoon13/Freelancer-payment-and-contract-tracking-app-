import { ScreenBackdrop, HeroGradient } from '@/components/ui/Surface';
import { openAttachment } from '@/services/attachments';
import { CashflowChart } from '../components/CashflowChart';
import { RecordTransactionModal } from '../components/RecordTransactionModal';
import { financeSummary as summarize, money } from '@/utils/finance';
import { exportFinanceReport, exportInvoice } from '@/services/financeExport';
import { MotionTouchable as TouchableOpacity } from '@/components/ui/Motion';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppContext } from '@/context/AppContext';
import type { Invoice } from '@/types';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';

export const FinanceScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const {
    invoices,
    transactions,
    openCreateInvoiceModal,
    openSubmitPaymentModal,
    verifyPayment,
    rejectPayment,
    issueInvoice,
    voidInvoice,
    deleteInvoice,
    recordDirectPayment,
    deleteTransaction,
    currentUser,
    canManageFinances,
  } = useAppContext();

  const [activeFilter, setActiveFilter] = useState<'All' | 'Partially paid' | 'Draft' | 'Sent'>('All');

  const [currency, setCurrency] = useState(currentUser?.currency || 'LKR');
  const [recording, setRecording] = useState(false);
  const [exporting, setExporting] = useState(false);
  const currencies = Array.from(new Set([currentUser?.currency || 'LKR', ...invoices.map(i => i.currency), ...transactions.map(t => t.currency)]));
  const financialSummary = summarize(invoices, transactions, currency);
  const visibleTransactions = transactions.filter(t => t.currency === currency);
  const downloadReport = async () => {
    if (exporting) return;
    setExporting(true);
    try { await exportFinanceReport(invoices, transactions, currency, currentUser?.agencyName || currentUser?.name || 'ISAACIFY'); }
    catch (error) { Alert.alert('Report could not be exported', error instanceof Error ? error.message : 'Please try again.'); }
    finally { setExporting(false); }
  };
  const [exportingInvoice, setExportingInvoice] = useState<string | null>(null);
  const shareInvoice = async (invoice: Invoice) => {
    if (exportingInvoice) return;
    setExportingInvoice(invoice.id);
    try { await exportInvoice(invoice, currentUser?.agencyName || currentUser?.name || 'ISAACIFY'); }
    catch (error) { Alert.alert('Invoice could not be exported', error instanceof Error ? error.message : 'Please try again.'); }
    finally { setExportingInvoice(null); }
  };
  const isClient = currentUser?.role === 'client';

  const filteredInvoices = invoices.filter((inv) => {
    if (inv.currency !== currency) return false;
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Partially paid') return inv.status === 'Partially Paid';
    if (activeFilter === 'Draft') return inv.status === 'Draft';
    if (activeFilter === 'Sent') return inv.status === 'Sent' || inv.status === 'Partially Paid';
    return true;
  });

  const handleVerify = (submissionId: string, amount: number, invoiceCurrency: string) => {
    Alert.alert(
      'Verify Payment',
      `Confirm receipt of ${money(amount, invoiceCurrency)} into your account?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm & Verify',
          onPress: () => verifyPayment(submissionId),
        },
      ]
    );
  };

  const handleReject = (submissionId: string) => {
    Alert.alert(
      'Reject Payment Proof',
      'Select reason for rejection:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unmatched Reference / Deposit Not Found',
          style: 'destructive',
          onPress: () => rejectPayment(submissionId, 'Unmatched reference / deposit not found'),
        },
        {
          text: 'Receipt Image Unreadable',
          style: 'destructive',
          onPress: () => rejectPayment(submissionId, 'Receipt image is blurry or unreadable'),
        },
        {
          text: 'Incorrect Amount Deposited',
          style: 'destructive',
          onPress: () => rejectPayment(submissionId, 'Deposited amount differs from submitted proof'),
        },
      ]
    );
  };

  const handleDirectPayment = (inv: Invoice) => {
    Alert.alert(
      'Record Direct Payment',
      `Record payment for ${inv.invoiceNumber}? Current outstanding balance: ${money(inv.outstandingAmount, inv.currency)}.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: `Full: ${money(inv.outstandingAmount, inv.currency)}`,
          onPress: () => {
            recordDirectPayment({
              invoiceId: inv.id,
              amount: inv.outstandingAmount,
              paymentMethod: 'Bank Transfer',
              referenceNumber: `DIR-${Date.now().toString().slice(-6)}`,
              note: 'Direct provider recorded payment',
            });
          },
        },
        {
          text: `50%: ${money(Math.round(inv.outstandingAmount / 2), inv.currency)}`,
          onPress: () => {
            recordDirectPayment({
              invoiceId: inv.id,
              amount: Math.round(inv.outstandingAmount / 2),
              paymentMethod: 'Bank Transfer',
              referenceNumber: `DIR-${Date.now().toString().slice(-6)}`,
              note: 'Direct 50% partial payment',
            });
          },
        },
      ]
    );
  };

  const handleVoidInvoice = (inv: Invoice) => {
    Alert.alert(
      'Void Invoice',
      `Are you sure you want to void ${inv.invoiceNumber}? This will remove outstanding balance obligations while keeping audit history.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Void Invoice',
          style: 'destructive',
          onPress: () => voidInvoice(inv.id),
        },
      ]
    );
  };

  const handleDeleteDraft = (inv: Invoice) => {
    Alert.alert(
      'Delete Draft Invoice',
      `Are you sure you want to delete draft ${inv.invoiceNumber}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Draft',
          style: 'destructive',
          onPress: () => {
            const res = deleteInvoice(inv.id);
            if (!res.success) {
              Alert.alert('Cannot Delete', res.reason);
            }
          },
        },
      ]
    );
  };

  const handleDeleteTransaction = (txId: string, title: string) => {
    Alert.alert(
      'Delete Transaction',
      `Are you sure you want to delete transaction "${title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteTransaction(txId),
        },
      ]
    );
  };

  // Permission gate for company members without financial authorization
  if (!canManageFinances && !isClient) {
    return (
      <View
        style={[
          styles.container,
          {
            paddingTop: Math.max(insets.top, 24) + 40,
            paddingHorizontal: 24,
            alignItems: 'center',
            justifyContent: 'center',
          },
        ]}
      >
        <ScreenBackdrop />
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: '#EDE9FE',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
          }}
        >
          <Ionicons name="lock-closed" size={30} color={colors.buttonPrimary} />
        </View>
        <Text
          style={{
            fontFamily: typography.fonts.bold,
            fontSize: 18,
            color: colors.textPrimary,
            textAlign: 'center',
          }}
        >
          Finance Access Restricted
        </Text>
        <Text
          style={{
            fontFamily: typography.fonts.regular,
            fontSize: 13,
            color: colors.textSecondary,
            textAlign: 'center',
            marginTop: 8,
            lineHeight: 20,
          }}
        >
          Company members do not have permission to view or manage company financial records. Please contact your workspace owner or administrator.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenBackdrop />
      {/* Top Header */}
      <View style={[styles.headerBar, { paddingTop: Math.max(insets.top, 12) }]}>
        <View style={styles.headerLeft}>
          <View style={styles.companyAvatar}>
            <Text style={styles.companyAvatarText}>
              {(currentUser?.firstName || 'IS').slice(0, 2).toUpperCase()}
            </Text>
          </View>
          <View>
            <Text style={styles.headerSubtitle}>
              {currentUser?.agencyName || currentUser?.name}
            </Text>
            <Text style={styles.headerTitle}>{isClient ? 'Billing & Payments' : 'Finance'}</Text>
          </View>
        </View>

        {!isClient && canManageFinances && (
          <TouchableOpacity
            style={styles.bellButton}
            onPress={downloadReport}
            disabled={exporting}
            accessibilityLabel="Export finance report"
          >
            <Feather name="download" size={18} color={colors.buttonPrimary} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 20) + 70 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Action Buttons (Only for providers) */}
        {!isClient && canManageFinances && (
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity
              style={styles.createInvoiceBtn}
              onPress={openCreateInvoiceModal}
              activeOpacity={0.8}
            >
              <Feather name="plus" size={16} color={colors.white} />
              <Text style={styles.createInvoiceBtnText}>Create invoice</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.recordPaymentBtn}
              onPress={() => setRecording(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="card-outline" size={16} color={colors.buttonPrimary} />
              <Text style={styles.recordPaymentBtnText}>Record cash</Text>
            </TouchableOpacity>
          </View>
        )}

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
          <View style={styles.filterRow}>{currencies.map(value => <TouchableOpacity key={value} onPress={() => setCurrency(value)} accessibilityLabel={`Show ${value} balances`} accessibilityState={{ selected: currency === value }} style={[styles.filterPill, currency === value && styles.filterPillSelected]}><Text style={[styles.filterPillText, currency === value && styles.filterPillTextSelected]}>{value}</Text></TouchableOpacity>)}</View>
        </ScrollView>
        {!isClient && canManageFinances && <CashflowChart transactions={transactions} currency={currency} />}
        {/* Financial Summary Cards */}
        {!isClient && canManageFinances ? (
          <>
            {/* Net Profit Card */}
            <View style={styles.netProfitCard}>
              <HeroGradient />
              <View style={styles.netProfitHeader}>
                <Text style={styles.netProfitLabel}>NET CASHFLOW</Text>
                <View style={styles.walletIconBox}>
                  <Ionicons name="wallet-outline" size={18} color={colors.buttonPrimary} />
                </View>
              </View>
              <Text style={styles.netProfitAmount}>
                {money(financialSummary.netProfit, currency)}
              </Text>
              <View style={styles.positiveBadge}>
                <Feather name="trending-up" size={12} color="#059669" />
                <Text style={styles.positiveBadgeText}>{financialSummary.cashflowStatus} cashflow</Text>
              </View>
            </View>

            {/* Collected & Expenses Row */}
            <View style={styles.twoColRow}>
              <View style={styles.colCard}>
                <View style={styles.colCardHeader}>
                  <Text style={styles.colCardLabel}>Collected</Text>
                  <Feather name="arrow-down-circle" size={16} color="#059669" />
                </View>
                <Text style={styles.colCardAmount}>
                  {money(financialSummary.received, currency)}
                </Text>
                <Text style={styles.colCardSub}>Recorded income</Text>
              </View>

              <View style={styles.colCard}>
                <View style={styles.colCardHeader}>
                  <Text style={styles.colCardLabel}>Expenses</Text>
                  <Feather name="arrow-up-circle" size={16} color="#E11D48" />
                </View>
                <Text style={styles.colCardAmount}>
                  {money(financialSummary.expenses, currency)}
                </Text>
                <Text style={styles.colCardSub}>Recorded expenses</Text>
              </View>
            </View>
          </>
        ) : null}

        {/* Outstanding Invoices Alert Card */}
        <View style={styles.outstandingCard}>
          <View style={styles.outstandingHeader}>
            <View style={styles.outstandingLeft}>
              <Feather name="clock" size={16} color="#B45309" />
              <Text style={styles.outstandingLabel}>
                {isClient ? 'Total Outstanding to Pay' : 'Outstanding Invoices'}
              </Text>
            </View>
            <View style={styles.pendingBadge}>
              <Text style={styles.pendingBadgeText}>Pending</Text>
            </View>
          </View>
          <Text style={styles.outstandingAmount}>
            {money(financialSummary.outstanding, currency)}
          </Text>
          <Text style={styles.outstandingNote}>
            {isClient
              ? 'Please submit payment confirmation slips for verification.'
              : 'Outstanding invoices are tracked until client payment is verified.'}
          </Text>
        </View>

        {/* Issued Invoices Section */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>{isClient ? 'My Invoices' : 'Issued Invoices'}</Text>
          {!isClient && canManageFinances && (
            <TouchableOpacity onPress={openCreateInvoiceModal} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 44 }}>
              <Feather name="plus-circle" size={16} color={colors.buttonPrimary} /><Text style={styles.sectionActionText}>New invoice</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Pills */}
        <View style={styles.filterRow}>
          {(['All', 'Partially paid', 'Draft', 'Sent'] as const).map((filter) => {
            const isSelected = activeFilter === filter;
            return (
              <TouchableOpacity
                key={filter}
                style={[styles.filterPill, isSelected && styles.filterPillSelected]}
                onPress={() => setActiveFilter(filter)}
              >
                <Text style={[styles.filterPillText, isSelected && styles.filterPillTextSelected]}>
                  {filter}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Empty State for Invoices */}
        {filteredInvoices.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="receipt-outline" size={38} color={colors.buttonPrimary} />
            <Text style={styles.emptyTitle}>No invoices found</Text>
            <Text style={styles.emptySubtitle}>
              {isClient
                ? 'You have no invoices awaiting payment.'
                : 'Create your first invoice to bill clients and track payments.'}
            </Text>
            {!isClient && canManageFinances && (
              <TouchableOpacity
                style={styles.emptyCreateBtn}
                onPress={openCreateInvoiceModal}
                activeOpacity={0.8}
              >
                <Text style={styles.emptyCreateBtnText}>+ Create invoice</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          filteredInvoices.map((inv) => {
            const isDraft = inv.status === 'Draft';
            const isPartiallyPaid = inv.status === 'Partially Paid';
            const isPaid = inv.status === 'Paid';

            // Check if any payment submissions on this invoice
            const pendingSubmissions = inv.payments.filter((p) => p.status === 'pending_review');

            return (
              <View key={inv.id} style={styles.invoiceCard}>
                <View style={styles.invoiceCardHeader}>
                  <View>
                    <Text style={styles.invoiceNumText}>{inv.invoiceNumber}</Text>
                    <Text style={styles.invoiceClientText}>{inv.clientName}</Text>
                    <Text style={styles.invoiceProjectText}>{inv.projectTitle}</Text>
                  </View>
                  <View
                    style={[
                      styles.invoiceStatusBadge,
                      isPaid
                        ? styles.badgePaid
                        : isPartiallyPaid
                        ? styles.badgePartiallyPaid
                        : isDraft
                        ? styles.badgeDraft
                        : styles.badgeSent,
                    ]}
                  >
                    <Text
                      style={[
                        styles.invoiceStatusBadgeText,
                        isPaid
                          ? styles.textPaid
                          : isPartiallyPaid
                          ? styles.textPartiallyPaid
                          : isDraft
                          ? styles.textDraft
                          : styles.textSent,
                      ]}
                    >
                      {inv.status}
                    </Text>
                  </View>
                </View>

                <View style={styles.datesRow}>
                  <Text style={styles.dateLabel}>Due: {inv.dueDate}</Text>
                </View>

                <View style={styles.invoiceFinancials}>
                  <View style={styles.invoiceTotalRow}>
                    <Text style={styles.totalInvoicedLabel}>Total Invoiced</Text>
                    <Text style={styles.totalInvoicedAmount}>
                      {money(inv.totalAmount, inv.currency)}
                    </Text>
                  </View>

                  {inv.paidAmount > 0 && (
                    <View style={styles.splitRow}>
                      <Text style={styles.splitLabel}>
                        • Received: {money(inv.paidAmount, inv.currency)}
                      </Text>
                      <Text style={styles.splitLabel}>
                        • Balance: {money(inv.outstandingAmount, inv.currency)}
                      </Text>
                    </View>
                  )}
                </View>

                {!isClient && canManageFinances && isDraft && (
                  <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
                    <TouchableOpacity
                      style={[styles.payProofBtn, { flex: 1.2, backgroundColor: colors.buttonPrimary }]}
                      onPress={() =>
                        Alert.alert(
                          'Issue Invoice?',
                          'This will issue the invoice, update outstanding receivables, and notify your client.',
                          [
                            { text: 'Cancel', style: 'cancel' },
                            { text: 'Issue Now', onPress: () => issueInvoice(inv.id) },
                          ]
                        )
                      }
                    >
                      <Ionicons name="paper-plane-outline" size={16} color={colors.white} />
                      <Text style={styles.payProofBtnText}>Issue Invoice</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.recordPaymentBtn,
                        { flex: 1, borderColor: '#FCA5A5', backgroundColor: '#FEF2F2' },
                      ]}
                      onPress={() => handleDeleteDraft(inv)}
                    >
                      <Feather name="trash-2" size={14} color="#DC2626" />
                      <Text style={[styles.recordPaymentBtnText, { color: '#DC2626' }]}>
                        Delete Draft
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

                {!isClient && canManageFinances && !isDraft && inv.status !== 'Void' && (
                  <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
                    {inv.outstandingAmount > 0 && (
                      <TouchableOpacity
                        style={[styles.recordPaymentBtn, { flex: 1.2 }]}
                        onPress={() => handleDirectPayment(inv)}
                      >
                        <Feather name="plus-circle" size={14} color={colors.buttonPrimary} />
                        <Text style={styles.recordPaymentBtnText}>Record Payment</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      style={[
                        styles.recordPaymentBtn,
                        { flex: inv.outstandingAmount > 0 ? 0.8 : 1, borderColor: '#FCA5A5' },
                      ]}
                      onPress={() => handleVoidInvoice(inv)}
                    >
                      <Feather name="slash" size={14} color="#DC2626" />
                      <Text style={[styles.recordPaymentBtnText, { color: '#DC2626' }]}>Void</Text>
                    </TouchableOpacity>
                  </View>
                )}

                <TouchableOpacity
                  disabled={!!exportingInvoice}
                  onPress={() => shareInvoice(inv)}
                  style={[styles.recordPaymentBtn, { marginTop: 12, padding: 12 }]}
                >
                  <Feather name="download" size={15} color={colors.buttonPrimary} />
                  <Text style={styles.recordPaymentBtnText}>
                    {exportingInvoice === inv.id ? 'Preparing PDF…' : 'Download / share PDF'}
                  </Text>
                </TouchableOpacity>
                {/* Client Action: Submit Payment */}
                {isClient && !isDraft && inv.outstandingAmount > 0 && (
                  <TouchableOpacity
                    style={styles.payProofBtn}
                    onPress={() => openSubmitPaymentModal(inv.id)}
                    activeOpacity={0.8}
                  >
                    <MaterialCommunityIcons name="receipt-text-check-outline" size={16} color={colors.white} />
                    <Text style={styles.payProofBtnText}>Submit Payment Proof</Text>
                  </TouchableOpacity>
                )}

                {/* Provider Verification Action: Pending submissions */}
                {!isClient && pendingSubmissions.length > 0 && (
                  <View style={styles.pendingReviewBox}>
                    <Text style={styles.pendingReviewTitle}>⚠️ Client Payment Submitted:</Text>
                    {pendingSubmissions.map((sub) => (
                      <View key={sub.id} style={styles.subItemRow}>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.subAmount}>
                            {money(sub.amount, inv.currency)} ({sub.paymentMethod})
                          </Text>
                          {(sub.attachment || sub.proofAttachment) && (
                            <TouchableOpacity
                              onPress={() => {
                                const file = sub.attachment || { uri: sub.proofAttachment!, name: 'Receipt.pdf' };
                                void openAttachment(file).catch((error) =>
                                  Alert.alert('Receipt unavailable', error.message)
                                );
                              }}
                            >
                              <Text style={styles.sectionActionText}>View receipt</Text>
                            </TouchableOpacity>
                          )}
                          {sub.proofNote ? (
                            <Text style={styles.subNote}>&quot;{sub.proofNote}&quot;</Text>
                          ) : null}
                        </View>
                        <View style={styles.subActionButtons}>
                          <TouchableOpacity
                            style={styles.verifyBtn}
                            onPress={() => handleVerify(sub.id, sub.amount, inv.currency)}
                          >
                            <Text style={styles.verifyBtnText}>Verify</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.rejectBtn}
                            onPress={() => handleReject(sub.id)}
                          >
                            <Text style={styles.rejectBtnText}>Reject</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            );
          })
        )}

        {/* Recent Transactions Section (for providers) */}
        {!isClient && visibleTransactions.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { marginTop: 24, marginBottom: 12 }]}>
              Recent Transactions
            </Text>
            <View style={styles.transactionsCard}>
              {visibleTransactions.map((tx) => {
                const isIncome = tx.type === 'income';
                return (
                  <View key={tx.id} style={styles.transactionRow}>
                    <View
                      style={[
                        styles.txIconBox,
                        isIncome ? styles.txIconIncome : styles.txIconExpense,
                      ]}
                    >
                      <Feather
                        name={isIncome ? 'arrow-down-left' : 'arrow-up-right'}
                        size={16}
                        color={isIncome ? '#059669' : '#E11D48'}
                      />
                    </View>
                    <View style={styles.txInfo}>
                      <Text style={styles.txTitle}>{tx.title}</Text>
                      <Text style={styles.txSubtitle}>
                        {tx.subtitle} • {tx.date}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.txAmount,
                        isIncome ? styles.txAmountIncome : styles.txAmountExpense,
                      ]}
                    >
                      {isIncome ? '+' : '-'} {money(tx.amount, tx.currency)}
                    </Text>
                    {!isClient && canManageFinances && (
                      <TouchableOpacity
                        onPress={() => handleDeleteTransaction(tx.id, tx.title)}
                        style={{ padding: 6, marginLeft: 8 }}
                      >
                        <Feather name="trash-2" size={14} color={colors.textMuted} />
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}
            </View>
          </>
        )}
      </ScrollView>
      {recording && <RecordTransactionModal visible onClose={() => setRecording(false)} currency={currency} />}
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
    borderBottomWidth: 0,
    borderBottomColor: '#F0EDF7'
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  companyAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.buttonPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  companyAvatarText: {
    fontFamily: typography.fonts.bold,
    fontSize: 16,
    color: colors.white,
  },
  headerSubtitle: {
    fontFamily: typography.fonts.medium,
    fontSize: 12,
    color: colors.textSecondary,
  },
  headerTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: 24,
    color: colors.textPrimary
  },
  bellButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#493068',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3
  },
  scrollArea: { flex: 1 },
  scrollContent: {
    padding: spacing.lg,
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 36
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  createInvoiceBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.buttonPrimary,
    paddingVertical: 14,
    borderRadius: 14,
  },
  createInvoiceBtnText: {
    fontFamily: typography.fonts.bold,
    fontSize: 14,
    color: colors.white,
  },
  recordPaymentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F3EEFF',
    paddingVertical: 14,
    borderRadius: 14,
  },
  recordPaymentBtnText: {
    fontFamily: typography.fonts.bold,
    fontSize: 14,
    color: colors.buttonPrimary,
  },
  netProfitCard: {
    backgroundColor: '#6D4BCB',
    borderRadius: 22,
    padding: 20,
    borderWidth: 0,
    borderColor: '#EEE8F6',
    marginBottom: 20,
    shadowColor: '#493068',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3
  },
  netProfitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  netProfitLabel: {
    fontFamily: typography.fonts.bold,
    fontSize: 12,
    color: '#E8DCFF',
    letterSpacing: 0.5
  },
  walletIconBox: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center'
  },
  netProfitAmount: {
    fontFamily: typography.fonts.bold,
    fontSize: 34,
    color: '#FFFFFF',
    marginVertical: 14
  },
  positiveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  positiveBadgeText: {
    fontFamily: typography.fonts.medium,
    fontSize: 12,
    color: '#059669',
  },
  twoColRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  colCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EEE8F6',
    shadowColor: '#493068',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3
  },
  colCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  colCardLabel: {
    fontFamily: typography.fonts.medium,
    fontSize: 13,
    color: colors.textSecondary,
  },
  colCardAmount: {
    fontFamily: typography.fonts.bold,
    fontSize: 20,
    color: colors.textPrimary
  },
  colCardSub: {
    fontFamily: typography.fonts.regular,
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  outstandingCard: {
    backgroundColor: '#FFF7ED',
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F6DFC1',
    marginBottom: 20,
    shadowColor: '#493068',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3
  },
  outstandingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  outstandingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  outstandingLabel: {
    fontFamily: typography.fonts.medium,
    fontSize: 13,
    color: '#B45309',
  },
  pendingBadge: {
    backgroundColor: '#FEF3E8',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  pendingBadgeText: {
    fontFamily: typography.fonts.medium,
    fontSize: 11,
    color: '#B45309',
  },
  outstandingAmount: {
    fontFamily: typography.fonts.bold,
    fontSize: 24,
    color: '#B45309',
    marginVertical: 4,
  },
  outstandingNote: {
    fontFamily: typography.fonts.regular,
    fontSize: 12,
    color: colors.textSecondary,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: 18,
    color: colors.textPrimary,
  },
  sectionActionText: {
    fontFamily: typography.fonts.bold,
    fontSize: 14,
    color: colors.buttonPrimary,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
    flexWrap: 'wrap'
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2D9F3'
  },
  filterPillSelected: {
    backgroundColor: colors.buttonPrimary,
    borderColor: colors.buttonPrimary,
  },
  filterPillText: {
    fontFamily: typography.fonts.medium,
    fontSize: 12,
    color: colors.textSecondary,
  },
  filterPillTextSelected: {
    color: colors.white,
    fontFamily: typography.fonts.bold,
  },
  invoiceCard: {
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
  invoiceCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  invoiceNumText: {
    fontFamily: typography.fonts.bold,
    fontSize: 15,
    color: colors.textPrimary,
  },
  invoiceClientText: {
    fontFamily: typography.fonts.medium,
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  invoiceProjectText: {
    fontFamily: typography.fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
  },
  invoiceStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  invoiceStatusBadgeText: {
    fontSize: 11,
    fontFamily: typography.fonts.bold,
  },
  badgePaid: { backgroundColor: '#ECFDF5' },
  textPaid: { color: '#059669', fontSize: 11, fontFamily: typography.fonts.bold },
  badgePartiallyPaid: { backgroundColor: '#F1EAFD' },
  textPartiallyPaid: { color: colors.buttonPrimary, fontSize: 11, fontFamily: typography.fonts.bold },
  badgeDraft: { backgroundColor: '#F3F4F6' },
  textDraft: { color: '#4B5563', fontSize: 11, fontFamily: typography.fonts.bold },
  badgeSent: { backgroundColor: '#FEF3E8' },
  textSent: { color: '#B45309', fontSize: 11, fontFamily: typography.fonts.bold },
  datesRow: {
    marginTop: 8,
    marginBottom: 8,
  },
  dateLabel: {
    fontFamily: typography.fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
  },
  invoiceFinancials: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F6F4FB',
  },
  invoiceTotalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalInvoicedLabel: {
    fontFamily: typography.fonts.medium,
    fontSize: 13,
    color: colors.textSecondary,
  },
  totalInvoicedAmount: {
    fontFamily: typography.fonts.bold,
    fontSize: 16,
    color: colors.textPrimary,
  },
  splitRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  splitLabel: {
    fontFamily: typography.fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
  },
  payProofBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.buttonPrimary,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 12,
  },
  payProofBtnText: {
    fontFamily: typography.fonts.bold,
    fontSize: 13,
    color: colors.white,
  },
  pendingReviewBox: {
    backgroundColor: '#FEF9EE',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  pendingReviewTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: 12,
    color: '#92400E',
    marginBottom: 6,
  },
  subItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  subAmount: {
    fontFamily: typography.fonts.bold,
    fontSize: 13,
    color: colors.textPrimary,
  },
  subRef: {
    fontFamily: typography.fonts.regular,
    fontSize: 11,
    color: colors.textSecondary,
  },
  subNote: {
    fontFamily: typography.fonts.regular,
    fontSize: 11,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  subActionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  verifyBtn: {
    backgroundColor: '#10B981',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  verifyBtnText: {
    color: colors.white,
    fontFamily: typography.fonts.bold,
    fontSize: 12,
  },
  rejectBtn: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  rejectBtnText: {
    color: colors.white,
    fontFamily: typography.fonts.bold,
    fontSize: 12,
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EEE8F6',
    marginVertical: 20,
    shadowColor: '#493068',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
    marginBottom: 20
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
    marginTop: 4,
    lineHeight: 18,
  },
  emptyCreateBtn: {
    backgroundColor: colors.buttonPrimary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 16,
  },
  emptyCreateBtnText: {
    color: colors.white,
    fontFamily: typography.fonts.bold,
    fontSize: 13,
  },
  transactionsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: '#EEE8F6',
    shadowColor: '#493068',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
    marginBottom: 20
  },
  transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F9F8FD',
  },
  txIconBox: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txIconIncome: { backgroundColor: '#ECFDF5' },
  txIconExpense: { backgroundColor: '#FEF2F2' },
  txInfo: {
    flex: 1,
    marginLeft: 12,
  },
  txTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: 13,
    color: colors.textPrimary,
  },
  txSubtitle: {
    fontFamily: typography.fonts.regular,
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  txAmount: {
    fontFamily: typography.fonts.bold,
    fontSize: 14,
  },
  txAmountIncome: { color: '#059669' },
  txAmountExpense: { color: '#E11D48' },
});
