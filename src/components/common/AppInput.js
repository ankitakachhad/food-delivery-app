import { useMemo, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { useTheme } from '../../hooks/useTheme';
import AppText from './AppText';

export default function AppInput({
  label,
  error,
  multiline = false,
  style,
  onFocus,
  onBlur,
  ...rest
}) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const [isFocused, setIsFocused] = useState(false);
  const hasError = Boolean(error);

  const handleFocus = (event) => {
    setIsFocused(true);
    onFocus?.(event);
  };

  const handleBlur = (event) => {
    setIsFocused(false);
    onBlur?.(event);
  };

  return (
    <View style={style}>
      {label ? (
        <AppText variant="caption" color="textSecondary" style={styles.label}>
          {label}
        </AppText>
      ) : null}

      <TextInput
        {...rest}
        multiline={multiline}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholderTextColor={theme.colors.textFaint}
        style={[
          styles.field,
          multiline && styles.multilineField,
          isFocused && styles.focusedField,
          hasError && styles.errorField,
        ]}
      />

      {hasError ? (
        <AppText variant="caption" color="danger" style={styles.errorMessage}>
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

const makeStyles = (theme) =>
  StyleSheet.create({
    label: {
      marginBottom: theme.spacing.xs,
    },
    field: {
      ...theme.textVariants.body,
      minHeight: 48,
      color: theme.colors.text,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.md,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
    },
    multilineField: {
      minHeight: 104,
      textAlignVertical: 'top',
    },
    focusedField: {
      borderColor: theme.colors.primary,
    },
    errorField: {
      borderColor: theme.colors.danger,
      backgroundColor: theme.colors.dangerSoft,
    },
    errorMessage: {
      marginTop: theme.spacing.xs,
    },
  });
