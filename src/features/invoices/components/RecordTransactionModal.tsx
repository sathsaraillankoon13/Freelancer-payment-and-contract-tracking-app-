import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { MotionModal, MotionTouchable } from '@/components/ui/Motion';
import { useAppContext } from '@/context/AppContext';
import { dateKey, parseDate } from '@/utils/dates';
import { typography } from '@/theme/typography';

export function RecordTransactionModal({ visible, onClose, currency }: { visible: boolean; onClose: () => void; currency: string }) {
  const { addTransaction } = useAppContext();
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(dateKey(new Date()));
  const [category, setCategory] = useState('');
  const [saving, setSaving] = useState(false);
  const save = () => {
    if (saving) return;
    const parsed = parseDate(date);
    if (!parsed || dateKey(parsed) !== date) { Alert.alert('Check the date', 'Use a valid date in YYYY-MM-DD format.'); return; }
    setSaving(true);
    try {
      addTransaction({ title, amount: Number(amount), type, currency, date, category: category.trim() || (type === 'income' ? 'Other income' : 'General expense') });
      onClose();
    } catch (error) { Alert.alert('Check the details', error instanceof Error ? error.message : 'Unable to save the transaction.'); }
    finally { setSaving(false); }
  };
  return <MotionModal visible={visible} transparent onRequestClose={onClose} animationType="slide">
    <KeyboardAvoidingView style={styles.overlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.sheet}><ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 24 }}>
        <View style={styles.row}><Text style={styles.heading}>Record transaction</Text><MotionTouchable onPress={onClose} accessibilityLabel="Close transaction form"><Text style={styles.close}>Close</Text></MotionTouchable></View>
        <Text style={styles.hint}>Record cash received or an expense in {currency}. Invoice payments are recorded when verified.</Text>
        <View style={[styles.row, { gap: 10, marginVertical: 20 }]}>{(['income', 'expense'] as const).map(value => <MotionTouchable key={value} style={[styles.choice, type === value && styles.selected]} accessibilityState={{ selected: type === value }} onPress={() => setType(value)}><Text style={{ color: type === value ? '#FFFFFF' : '#705590', fontFamily: typography.fonts.bold }}>{value === 'income' ? 'Income' : 'Expense'}</Text></MotionTouchable>)}</View>
        <Text style={styles.label}>Description</Text><TextInput style={styles.input} placeholder="e.g. Software subscription" value={title} onChangeText={setTitle} maxLength={120} />
        <Text style={styles.label}>Amount ({currency})</Text><TextInput style={styles.input} placeholder="0.00" value={amount} onChangeText={setAmount} keyboardType="decimal-pad" />
        <Text style={styles.label}>Date</Text><TextInput style={styles.input} placeholder="YYYY-MM-DD" value={date} onChangeText={setDate} autoCapitalize="none" maxLength={10} />
        <Text style={styles.label}>Category</Text><TextInput style={styles.input} placeholder="e.g. Software, Travel, Other income" value={category} onChangeText={setCategory} maxLength={60} />
        <MotionTouchable disabled={saving} style={styles.save} onPress={save}><Text style={styles.saveText}>Save transaction</Text></MotionTouchable>
      </ScrollView></View>
    </KeyboardAvoidingView>
  </MotionModal>;
}
const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: '#24153077', justifyContent: 'flex-end' }, sheet: { backgroundColor: '#FAF9FD', borderTopLeftRadius: 28, borderTopRightRadius: 28, maxHeight: '92%' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, heading: { fontFamily: typography.fonts.bold, fontSize: 20, color: '#292035' }, close: { fontFamily: typography.fonts.medium, color: '#7852CC', padding: 8 }, hint: { fontFamily: typography.fonts.regular, fontSize: 12, color: '#92869F', lineHeight: 18, marginTop: 10 },
  choice: { flex: 1, padding: 14, borderRadius: 14, alignItems: 'center', backgroundColor: '#F0EAF8' }, selected: { backgroundColor: '#7852CC' }, label: { fontFamily: typography.fonts.medium, fontSize: 12, color: '#675874', marginBottom: 7 }, input: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#EDE7F6', borderRadius: 12, padding: 14, marginBottom: 16, color: '#292035', fontFamily: typography.fonts.regular }, save: { backgroundColor: '#7852CC', padding: 16, borderRadius: 14, alignItems: 'center', marginTop: 8, marginBottom: 16 }, saveText: { color: '#FFFFFF', fontFamily: typography.fonts.bold },
});
