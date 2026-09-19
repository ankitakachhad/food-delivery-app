import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useTheme } from '../../hooks/useTheme';
import AppButton from './AppButton';
import AppText from './AppText';

export default function ErrorState({
  title,
  message,
  actionLabel,
  onAction,
  icon = 'alert-circle-outline',
  style,
}) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconCircle}>
        <Ionicons name={icon} size={30} color={theme.colors.danger} />
      </View>

      <AppText variant="h2" style={styles.title}>
        {title}
      </AppText>

      {message ? (
        <AppText variant="body" color="textMuted" style={styles.message}>
          {message}
        </AppText>
      ) : null}

      {actionLabel ? (
        <AppButton title={actionLabel} onPress={onAction} style={styles.action} />
      ) : null}
    </View>
  );
}

const makeStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.xxl,
    },
    iconCircle: {
      width: 68,
      height: 68,
      borderRadius: theme.radius.pill,
      backgroundColor: theme.colors.dangerSoft,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.lg,
    },
    title: {
      textAlign: 'center',
    },
    message: {
      textAlign: 'center',
      maxWidth: 300,
      marginTop: theme.spacing.sm,
    },
    action: {
      marginTop: theme.spacing.xl,
    },
  });
