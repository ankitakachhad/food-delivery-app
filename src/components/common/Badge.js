import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '../../hooks/useTheme';
import AppText from './AppText';

const BADGE_LABEL_COLOR = '#FFFFFF';

export default function Badge({ count = 0, max = 99, style }) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  if (!count) {
    return null;
  }

  const label = count > max ? `${max}+` : `${count}`;

  return (
    <View style={[styles.badge, style]}>
      <AppText variant="micro" color={BADGE_LABEL_COLOR} style={styles.label}>
        {label}
      </AppText>
    </View>
  );
}

const makeStyles = (theme) =>
  StyleSheet.create({
    badge: {
      minWidth: 20,
      height: 20,
      paddingHorizontal: theme.spacing.xs,
      borderRadius: theme.radius.pill,
      backgroundColor: theme.colors.primary,
      borderWidth: 2,
      borderColor: theme.colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    label: {
      letterSpacing: 0,
    },
  });
