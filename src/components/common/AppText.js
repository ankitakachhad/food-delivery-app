import { useMemo } from 'react';
import { StyleSheet, Text } from 'react-native';

import { useTheme } from '../../hooks/useTheme';

export default function AppText({ variant = 'body', color = 'text', style, children, ...rest }) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const resolvedColor = theme.colors[color] ?? color;

  return (
    <Text {...rest} style={[styles[variant], { color: resolvedColor }, style]}>
      {children}
    </Text>
  );
}

const makeStyles = (theme) => StyleSheet.create(theme.textVariants);
