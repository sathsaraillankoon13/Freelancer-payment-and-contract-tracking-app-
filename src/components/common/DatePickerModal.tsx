import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { parseDate, dateKey } from '@/utils/dates';

interface DatePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectDate: (dateString: string, formattedHuman?: string) => void;
  initialDate?: string;
  title?: string;
  outputFormat?: 'iso' | 'human'; // 'iso' = 'YYYY-MM-DD', 'human' = '24 Oct 2026'
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const WEEK_DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

interface CalendarBodyProps {
  initialDate?: string;
  title: string;
  outputFormat: 'iso' | 'human';
  onClose: () => void;
  onSelectDate: (dateString: string, formattedHuman?: string) => void;
}

const CalendarBody: React.FC<CalendarBodyProps> = ({
  initialDate,
  title,
  outputFormat,
  onClose,
  onSelectDate,
}) => {
  const parsedInitial = useMemo(() => {
    if (!initialDate) return new Date();
    const d = parseDate(initialDate);
    return d || new Date();
  }, [initialDate]);

  const [currentYear, setCurrentYear] = useState<number>(() => parsedInitial.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(() => parsedInitial.getMonth());
  const [selectedDay, setSelectedDay] = useState<number>(() => parsedInitial.getDate());

  const daysInMonth = useMemo(
    () => new Date(currentYear, currentMonth + 1, 0).getDate(),
    [currentYear, currentMonth]
  );

  const firstDayOfWeek = useMemo(
    () => new Date(currentYear, currentMonth, 1).getDay(),
    [currentYear, currentMonth]
  );

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleQuickSelect = (offsetDays: number) => {
    const target = new Date();
    target.setDate(target.getDate() + offsetDays);
    setCurrentYear(target.getFullYear());
    setCurrentMonth(target.getMonth());
    setSelectedDay(target.getDate());
  };

  const handleConfirm = () => {
    const d = new Date(currentYear, currentMonth, selectedDay);
    const isoString = dateKey(d);
    const humanString = d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    const output = outputFormat === 'human' ? humanString : isoString;
    onSelectDate(output, humanString);
    onClose();
  };

  const today = new Date();
  const isCurrentMonthToday =
    today.getFullYear() === currentYear && today.getMonth() === currentMonth;

  return (
    <View style={styles.modalCard}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View style={styles.calendarIconBadge}>
            <Feather name="calendar" size={18} color={colors.buttonPrimary} />
          </View>
          <Text style={styles.headerTitle}>{title}</Text>
        </View>
        <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Feather name="x" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Quick Select Buttons */}
      <View style={styles.quickSelectRow}>
        <TouchableOpacity
          style={styles.quickPill}
          onPress={() => handleQuickSelect(0)}
        >
          <Text style={styles.quickPillText}>Today</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.quickPill}
          onPress={() => handleQuickSelect(1)}
        >
          <Text style={styles.quickPillText}>Tomorrow</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.quickPill}
          onPress={() => handleQuickSelect(7)}
        >
          <Text style={styles.quickPillText}>+7 Days</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.quickPill}
          onPress={() => handleQuickSelect(30)}
        >
          <Text style={styles.quickPillText}>+30 Days</Text>
        </TouchableOpacity>
      </View>

      {/* Month & Year Navigation */}
      <View style={styles.navRow}>
        <TouchableOpacity
          style={styles.navBtn}
          onPress={handlePrevMonth}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Feather name="chevron-left" size={20} color={colors.textPrimary} />
        </TouchableOpacity>

        <Text style={styles.monthYearTitle}>
          {MONTH_NAMES[currentMonth]} {currentYear}
        </Text>

        <TouchableOpacity
          style={styles.navBtn}
          onPress={handleNextMonth}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Feather name="chevron-right" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Weekday Labels */}
      <View style={styles.weekDaysRow}>
        {WEEK_DAYS.map((w, idx) => (
          <Text key={idx} style={styles.weekDayText}>
            {w}
          </Text>
        ))}
      </View>

      {/* Calendar Days Grid */}
      <View style={styles.daysGrid}>
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <View key={`empty-${i}`} style={styles.dayCellEmpty} />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dayNum = i + 1;
          const isSelected = selectedDay === dayNum;
          const isToday = isCurrentMonthToday && today.getDate() === dayNum;

          return (
            <TouchableOpacity
              key={`day-${dayNum}`}
              style={[
                styles.dayCell,
                isSelected && styles.dayCellSelected,
                isToday && !isSelected && styles.dayCellToday,
              ]}
              onPress={() => setSelectedDay(dayNum)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.dayText,
                  isSelected && styles.dayTextSelected,
                  isToday && !isSelected && styles.dayTextToday,
                ]}
              >
                {dayNum}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Selected Date Summary Display */}
      <View style={styles.selectionSummaryBox}>
        <Text style={styles.summaryLabel}>Selected date:</Text>
        <Text style={styles.summaryDate}>
          {new Date(currentYear, currentMonth, selectedDay).toLocaleDateString(
            'en-GB',
            { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }
          )}
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={onClose}
          activeOpacity={0.8}
        >
          <Text style={styles.cancelBtnText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.confirmBtn}
          onPress={handleConfirm}
          activeOpacity={0.8}
        >
          <Ionicons name="checkmark-sharp" size={18} color={colors.white} />
          <Text style={styles.confirmBtnText}>Set Date</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const DatePickerModal: React.FC<DatePickerModalProps> = ({
  visible,
  onClose,
  onSelectDate,
  initialDate,
  title = 'Select Date',
  outputFormat = 'iso',
}) => {
  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <CalendarBody
          key={`${visible}_${initialDate || 'today'}`}
          initialDate={initialDate}
          title={title}
          outputFormat={outputFormat}
          onClose={onClose}
          onSelectDate={onSelectDate}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(26, 20, 36, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.cardBackground,
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#ECEAF5',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  calendarIconBadge: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: 16,
    color: colors.textPrimary,
  },
  quickSelectRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 14,
  },
  quickPill: {
    flex: 1,
    backgroundColor: '#F8F6FC',
    borderRadius: 8,
    paddingVertical: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ECEAF5',
  },
  quickPillText: {
    fontFamily: typography.fonts.medium,
    fontSize: 11,
    color: colors.textSecondary,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  navBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F3F0FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthYearTitle: {
    fontFamily: typography.fonts.bold,
    fontSize: 15,
    color: colors.textPrimary,
  },
  weekDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  weekDayText: {
    width: `${100 / 7}%`,
    textAlign: 'center',
    fontFamily: typography.fonts.semiBold,
    fontSize: 11,
    color: colors.textMuted,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCellEmpty: {
    width: `${100 / 7}%`,
    height: 36,
  },
  dayCell: {
    width: `${100 / 7}%`,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginVertical: 1,
  },
  dayCellSelected: {
    backgroundColor: colors.buttonPrimary,
  },
  dayCellToday: {
    borderWidth: 1.5,
    borderColor: colors.buttonPrimary,
    backgroundColor: '#FAF5FF',
  },
  dayText: {
    fontFamily: typography.fonts.medium,
    fontSize: 13,
    color: colors.textPrimary,
  },
  dayTextSelected: {
    fontFamily: typography.fonts.bold,
    color: colors.white,
  },
  dayTextToday: {
    fontFamily: typography.fonts.bold,
    color: colors.buttonPrimary,
  },
  selectionSummaryBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FAF8FD',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ECEAF5',
  },
  summaryLabel: {
    fontFamily: typography.fonts.regular,
    fontSize: 12,
    color: colors.textSecondary,
  },
  summaryDate: {
    fontFamily: typography.fonts.bold,
    fontSize: 12,
    color: colors.buttonPrimary,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 12,
    backgroundColor: '#F3F0FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontFamily: typography.fonts.medium,
    fontSize: 13,
    color: colors.textSecondary,
  },
  confirmBtn: {
    flex: 1.4,
    paddingVertical: 11,
    borderRadius: 12,
    backgroundColor: colors.buttonPrimary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  confirmBtnText: {
    fontFamily: typography.fonts.bold,
    fontSize: 13,
    color: colors.white,
  },
});
