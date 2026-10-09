import React, { useEffect, useMemo, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { MotionTouchable, MotionView } from '@/components/ui/Motion';
import { useReducedMotion } from '@/context/MotionContext';
import { compactMoney, money, monthlyCashflow } from '@/utils/finance';
import { typography } from '@/theme/typography';
import type { TransactionItem } from '@/types';

function Bar({ value, maximum, color, index }: { value: number; maximum: number; color: string; index: number }) {
  const reduced = useReducedMotion();
  const height = value ? Math.max(10, (value / maximum) * 124) : 2;
  const [progress] = useState(() => new Animated.Value(reduced ? 1 : 0));
  useEffect(() => {
    progress.setValue(reduced ? 1 : 0);
    if (reduced) return;
    const animation = Animated.timing(progress, { toValue: 1, duration: 650, delay: index * 45, easing: Easing.out(Easing.cubic), useNativeDriver: true, isInteraction: false });
    animation.start();
    return () => animation.stop();
  }, [height, index, progress, reduced]);
  return <Animated.View style={{ width: 12, height, borderTopLeftRadius: 5, borderTopRightRadius: 5, backgroundColor: value ? color : '#E9E4F2', transform: [
    { translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [height / 2, 0] }) }, { scaleY: progress },
  ] }} />;
}

export function CashflowChart({ transactions, currency }: { transactions: TransactionItem[]; currency: string }) {
  const [period, setPeriod] = useState(6);
  const [selectedKey, setSelectedKey] = useState('');
  const { months, undated } = useMemo(() => monthlyCashflow(transactions, currency, period), [transactions, currency, period]);
  const latestActiveMonth = useMemo(() => {
    for (let i = months.length - 1; i >= 0; i--) {
      if (months[i].income > 0 || months[i].expenses > 0) return months[i];
    }
    return months[months.length - 1];
  }, [months]);
  const activeSelectedKey = selectedKey || latestActiveMonth.key;
  const selected = months.find(m => m.key === activeSelectedKey) || months[months.length - 1];
  const income = months.reduce((sum, m) => sum + m.income, 0);
  const expenses = months.reduce((sum, m) => sum + m.expenses, 0);
  const maximum = Math.max(1, ...months.flatMap(m => [m.income, m.expenses]));
  return (
    <MotionView delay={90} style={styles.card}>
      <View style={styles.header}>
        <View><Text style={styles.eyebrow}>YOUR MONEY, AT A GLANCE</Text><Text style={styles.title}>Cashflow</Text></View>
        <View style={styles.periods}>{[3, 6].map(n => <MotionTouchable key={n} accessibilityLabel={`Show ${n} months`} accessibilityState={{ selected: period === n }} onPress={() => { setPeriod(n); setSelectedKey(''); }} style={[styles.period, period === n && styles.periodActive]}><Text style={[styles.periodText, period === n && { color: '#6E45C3' }]}>{n}M</Text></MotionTouchable>)}</View>
      </View>
      <View style={styles.totals}>
        <View style={{ flex: 1 }}><Text style={styles.caption}>Income · last {period} months</Text><Text style={styles.income}>{money(income, currency)}</Text></View>
        <View style={{ flex: 1 }}><Text style={styles.caption}>Expenses</Text><Text style={styles.expense}>{money(expenses, currency)}</Text></View>
      </View>
      <View style={styles.plot}>
        <View pointerEvents="none" style={styles.grid}>{[1, 0.5, 0].map((ratio, i) => <View key={i} style={styles.gridRow}><Text style={styles.axis}>{compactMoney(maximum * ratio)}</Text><View style={styles.gridLine} /></View>)}</View>
        <View style={styles.columns}>{months.map((month, i) => <MotionTouchable
          key={month.key} style={[styles.column, selected.key === month.key && styles.columnSelected]}
          onPress={() => setSelectedKey(month.key)} accessibilityLabel={`${month.label} ${month.year}, income ${money(month.income, currency)}, expenses ${money(month.expenses, currency)}`} accessibilityState={{ selected: selected.key === month.key }}
        ><View style={styles.bars}><Bar value={month.income} maximum={maximum} color="#7852CC" index={i} /><Bar value={month.expenses} maximum={maximum} color="#F3AF87" index={i} /></View><Text style={[styles.month, selected.key === month.key && { color: '#6E45C3', fontFamily: typography.fonts.bold }]}>{month.label}</Text></MotionTouchable>)}</View>
      </View>
      <View style={styles.legend}><View style={[styles.dot, { backgroundColor: '#7852CC' }]} /><Text style={styles.caption}>Income</Text><View style={[styles.dot, { backgroundColor: '#F3AF87', marginLeft: 16 }]} /><Text style={styles.caption}>Expenses</Text></View>
      <MotionView key={`${currency}-${selected.key}`} style={styles.detail}>
        <View style={styles.header}><Text style={styles.detailTitle}>{selected.label} {selected.year}</Text><Text style={styles.detailCount}>{selected.transactions.length} transactions</Text></View>
        <View style={styles.header}><Text style={styles.caption}>Net cashflow</Text><Text style={[styles.net, { color: selected.income - selected.expenses < 0 ? '#C45763' : '#6E45C3' }]}>{money(selected.income - selected.expenses, currency)}</Text></View>
      </MotionView>
      {income === 0 && expenses === 0 && <View style={styles.empty}><Feather name="bar-chart-2" size={16} color="#8D79AC" /><Text style={styles.emptyText}>Record income or expenses to bring your chart to life.</Text></View>}
      {undated > 0 && <Text style={styles.footnote}>{undated} older {undated === 1 ? 'record has' : 'records have'} no full date and {undated === 1 ? 'is' : 'are'} excluded from the monthly chart.</Text>}
    </MotionView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: '#EEE8F6',
    marginBottom: 20,
    shadowColor: '#493068',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3
  },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  eyebrow: {
    fontFamily: typography.fonts.medium,
    fontSize: 10,
    letterSpacing: 1.3,
    color: '#81718F',
    marginBottom: 5
  },
  title: { fontFamily: typography.fonts.bold, fontSize: 21, color: '#292035' },
  periods: { flexDirection: 'row', backgroundColor: '#F7F4FB', borderRadius: 12, padding: 3 },
  period: { paddingHorizontal: 11, paddingVertical: 8, borderRadius: 9 },
  periodActive: { backgroundColor: '#FFFFFF' }, periodText: {
    fontFamily: typography.fonts.bold,
    fontSize: 11,
    color: '#81718F'
  },
  totals: { flexDirection: 'row', gap: 12, marginTop: 22, marginBottom: 24 }, caption: {
    fontFamily: typography.fonts.regular,
    fontSize: 11,
    color: '#776883'
  },
  income: { fontFamily: typography.fonts.bold, fontSize: 16, color: '#6E45C3', marginTop: 5 }, expense: { fontFamily: typography.fonts.bold, fontSize: 16, color: '#B67657', marginTop: 5 },
  plot: { height: 164 }, grid: { position: 'absolute', top: 0, left: 0, right: 0, height: 126, justifyContent: 'space-between' },
  gridRow: { flexDirection: 'row', alignItems: 'center', gap: 8 }, axis: {
    width: 31,
    fontFamily: typography.fonts.regular,
    fontSize: 9,
    color: '#84738F'
  }, gridLine: { flex: 1, height: 1, backgroundColor: '#F0EBF5' },
  columns: { flexDirection: 'row', height: 158, marginLeft: 37, justifyContent: 'space-around' }, column: { flex: 1, alignItems: 'center', paddingTop: 2, borderRadius: 10 }, columnSelected: { backgroundColor: '#FAF7FF' },
  bars: { height: 126, flexDirection: 'row', gap: 4, alignItems: 'flex-end' }, month: { fontFamily: typography.fonts.medium, fontSize: 10, color: '#A095AA', marginTop: 11 },
  legend: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 8, marginBottom: 20 }, dot: { width: 7, height: 7, borderRadius: 4 },
  detail: { backgroundColor: '#F8F5FC', padding: 14, borderRadius: 14, gap: 9 }, detailTitle: { fontFamily: typography.fonts.bold, fontSize: 12, color: '#5B456F' }, detailCount: { fontFamily: typography.fonts.regular, fontSize: 10, color: '#A08FAD' }, net: { fontFamily: typography.fonts.bold, fontSize: 15 },
  empty: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 14 }, emptyText: { flex: 1, fontFamily: typography.fonts.regular, fontSize: 11, lineHeight: 17, color: '#8D79AC' }, footnote: { fontFamily: typography.fonts.regular, color: '#A092AD', fontSize: 10, lineHeight: 15, marginTop: 12 },
});
