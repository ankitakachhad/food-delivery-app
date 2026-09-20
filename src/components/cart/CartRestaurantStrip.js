import { useMemo } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { useTheme } from '../../hooks/useTheme';
import AppText from '../common/AppText';

export default function CartRestaurantStrip({ name, image }) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  return (
    <View style={styles.strip}>
      <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
      <View style={styles.text}>
        <AppText variant="h3" numberOfLines={1}>
          {name}
        </AppText>
        <AppText variant="caption" color="textMuted">
          Satellite · 30-35 min
        </AppText>
      </View>
    </View>
  );
}

function makeStyles({ colors, spacing, radius }) {
  return StyleSheet.create({
    strip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      padding: spacing.md,
      borderRadius: radius.lg,
      backgroundColor: colors.surfaceAlt,
    },
    image: {
      width: 44,
      height: 44,
      borderRadius: radius.md,
      backgroundColor: colors.skeleton,
    },
    text: { flex: 1, gap: 2 },
  });
}
