import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';

interface InputProps extends TextInputProps {
  label?: string;
  icon?: any;
  isPassword?: boolean;
  error?: string;
  containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  icon,
  isPassword = false,
  error,
  containerStyle,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(!isPassword);

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputFocused,
          !!error && styles.inputError,
        ]}
      >
        {icon && (
          <Feather
            name={icon}
            size={18}
            color={colors.textSecondary}
            style={{ marginRight: 8 }}
          />
        )}
        <TextInput
          style={styles.input}
          placeholderTextColor={colors.textMuted}
          secureTextEntry={isPassword && !showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {isPassword && (
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowPassword((prev) => !prev)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather
              name={showPassword ? 'eye' : 'eye-off'}
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    fontFamily: typography.fonts.medium,
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderWidth: 1.5,
    borderColor: colors.inputBorder,
    borderRadius: 14,
    backgroundColor: colors.inputBackground,
    paddingHorizontal: 16,
  },
  inputFocused: {
    borderColor: colors.inputBorderFocused,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  input: {
    flex: 1,
    height: '100%',
    fontFamily: typography.fonts.regular,
    fontSize: 15,
    color: colors.textPrimary,
  },
  eyeButton: {
    paddingLeft: 8,
  },
  errorText: {
    fontFamily: typography.fonts.regular,
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
});

export default Input;
