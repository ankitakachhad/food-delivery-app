import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '../../hooks/useTheme';

export default function Divider({ spacing = 'md', style }) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const verticalSpacing = theme.spacing[spacing] ?? spacing;

  return <View style={[styles.line, { marginVertical: verticalSpacing }, style]} />;
}

const makeStyles = (theme) =>
  StyleSheet.create({
    line: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: theme.colors.border,
    },
  });
