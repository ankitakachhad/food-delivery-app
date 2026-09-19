import { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useTheme } from '../../hooks/useTheme';

export default function Card({ children, onPress, style, ...rest }) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const Container = onPress ? Pressable : View;

  return (
    <Container onPress={onPress} style={[styles.card, style]} {...rest}>
      {children}
    </Container>
  );
}

const makeStyles = (theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.lg,
      padding: theme.spacing.lg,
      shadowColor: '#1A1512',
      shadowOpacity: theme.isDark ? 0 : 0.06,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
      elevation: theme.isDark ? 0 : 2,
    },
  });
