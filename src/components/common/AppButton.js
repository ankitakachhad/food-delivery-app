import { useMemo } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { useTheme } from '../../hooks/useTheme';
import AppText from './AppText';

const ON_PRIMARY = '#FFFFFF';

const LABEL_COLOR = {
  primary: ON_PRIMARY,
  secondary: 'primaryDeep',
  ghost: 'primary',
};

export default function AppButton({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  icon,
  fullWidth = false,
  style,
}) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const isPressBlocked = disabled || loading;
  const spinnerColor = variant === 'primary' ? ON_PRIMARY : theme.colors.primary;

  return (
    <Pressable
      onPress={onPress}
      disabled={isPressBlocked}
      accessibilityRole="button"
      accessibilityState={{ disabled: isPressBlocked, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        fullWidth && styles.fullWidth,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={spinnerColor} />
      ) : (
        <View style={styles.content}>
          {icon}
          <AppText variant="h3" color={LABEL_COLOR[variant]}>
            {title}
          </AppText>
        </View>
      )}
    </Pressable>
  );
}

const makeStyles = (theme) =>
  StyleSheet.create({
    base: {
      minHeight: 48,
      paddingHorizontal: theme.spacing.xl,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      borderColor: 'transparent',
      alignItems: 'center',
      justifyContent: 'center',
    },
    primary: {
      backgroundColor: theme.colors.primary,
    },
    secondary: {
      backgroundColor: theme.colors.primarySoft,
      borderColor: theme.colors.primaryBorder,
    },
    ghost: {
      backgroundColor: 'transparent',
    },
    fullWidth: {
      alignSelf: 'stretch',
      width: '100%',
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    pressed: {
      opacity: 0.85,
    },
    disabled: {
      opacity: 0.45,
    },
  });
