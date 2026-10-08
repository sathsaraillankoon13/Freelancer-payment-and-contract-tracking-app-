import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  StyleProp,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';

interface ButtonProps {
  title?: string;
  label?: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  icon?: string;
  showArrow?: boolean;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  label,
  onPress,
  variant = 'primary',
  icon,
  showArrow = false,
  loading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const buttonTitle = title || label || '';
  const displayArrow = showArrow || icon === 'arrow-right';
  const isPrimary = variant === 'primary';
  const isOutline = variant === 'outline';
  const isText = variant === 'text';

  const containerStyle: StyleProp<ViewStyle> = [
    styles.base,
    isPrimary && styles.primary,
    isOutline && styles.outline,
    isText && styles.textVariant,
    disabled && styles.disabled,
    style,
  ];

  const labelStyle: StyleProp<TextStyle> = [
    styles.baseText,
    isPrimary && styles.primaryText,
    isOutline && styles.outlineText,
    isText && styles.textVariantText,
    disabled && styles.disabledText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={containerStyle}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? colors.white : colors.buttonPrimary} />
      ) : (
        <View style={styles.contentRow}>
          <Text style={labelStyle}>{buttonTitle}</Text>
          {displayArrow && (
            <Feather
              name="arrow-right"
              size={18}
              color={isPrimary ? colors.white : colors.buttonPrimary}
              style={styles.arrowIcon}
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    width: '100%',
  },
  primary: {
    backgroundColor: colors.buttonPrimary,
    shadowColor: colors.buttonPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
  },
  textVariant: {
    backgroundColor: 'transparent',
    height: 'auto',
    paddingHorizontal: 0,
    width: 'auto',
  },
  disabled: {
    opacity: 0.5,
    shadowOpacity: 0,
    elevation: 0,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  baseText: {
    fontFamily: typography.fonts.medium,
    fontSize: 16,
    textAlign: 'center',
  },
  primaryText: {
    color: colors.white,
    fontFamily: typography.fonts.bold,
  },
  outlineText: {
    color: colors.textPrimary,
  },
  textVariantText: {
    color: colors.buttonPrimary,
    fontSize: 14,
  },
  disabledText: {
    color: colors.textMuted,
  },
  arrowIcon: {
    marginLeft: 8,
  },
});

export default Button;
