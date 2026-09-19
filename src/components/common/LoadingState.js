import { useEffect, useMemo, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { useTheme } from '../../hooks/useTheme';

const MIN_OPACITY = 0.4;
const MAX_OPACITY = 1;
const PULSE_DURATION = 700;

export default function LoadingState({ count = 3, style }) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const shimmerOpacity = useRef(new Animated.Value(MIN_OPACITY)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerOpacity, {
          toValue: MAX_OPACITY,
          duration: PULSE_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerOpacity, {
          toValue: MIN_OPACITY,
          duration: PULSE_DURATION,
          useNativeDriver: true,
        }),
      ])
    );

    pulse.start();

    return () => pulse.stop();
  }, [shimmerOpacity]);

  const skeletonKeys = [...Array(count).keys()];

  return (
    <View style={style} accessibilityRole="progressbar" accessibilityLabel="Loading">
      {skeletonKeys.map((skeletonKey) => (
        <Animated.View key={skeletonKey} style={[styles.card, { opacity: shimmerOpacity }]}>
          <View style={styles.image} />
          <View style={styles.titleLine} />
          <View style={styles.metaLine} />

          <View style={styles.tagRow}>
            <View style={styles.tag} />
            <View style={styles.tag} />
          </View>
        </Animated.View>
      ))}
    </View>
  );
}

const makeStyles = (theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
    image: {
      height: 140,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.skeleton,
    },
    titleLine: {
      height: 18,
      width: '62%',
      borderRadius: theme.radius.sm,
      backgroundColor: theme.colors.skeleton,
      marginTop: theme.spacing.md,
    },
    metaLine: {
      height: 12,
      width: '40%',
      borderRadius: theme.radius.sm,
      backgroundColor: theme.colors.skeleton,
      marginTop: theme.spacing.sm,
    },
    tagRow: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
      marginTop: theme.spacing.md,
    },
    tag: {
      height: 22,
      width: 64,
      borderRadius: theme.radius.pill,
      backgroundColor: theme.colors.skeleton,
    },
  });
