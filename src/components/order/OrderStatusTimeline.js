import { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useTheme } from '../../hooks/useTheme';
import { ORDER_STATUSES, STATUS_STEP_MS } from '../../constants/orderStatus';
import AppText from '../common/AppText';

function formatExpectedTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

export default function OrderStatusTimeline({ statusIndex, placedAt }) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const pulse = useRef(new Animated.Value(0)).current;
  const placedAtMs = new Date(placedAt).getTime();

  useEffect(() => {
    pulse.setValue(0);
    const animation = Animated.loop(
      Animated.timing(pulse, {
        toValue: 1,
        duration: 1800,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      })
    );
    animation.start();

    return () => animation.stop();
  }, [pulse, statusIndex]);

  const ringStyle = {
    opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0] }),
    transform: [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 2.2] }) }],
  };

  return (
    <View style={styles.timeline}>
      {ORDER_STATUSES.map((status, index) => {
        const isComplete = index < statusIndex;
        const isCurrent = index === statusIndex;
        let markerStyle = styles.markerPending;
        let labelColor = 'textMuted';

        if (isComplete) {
          markerStyle = styles.markerComplete;
          labelColor = 'text';
        }
        if (isCurrent) {
          markerStyle = styles.markerCurrent;
          labelColor = 'primaryDeep';
        }

        return (
          <View key={status.key} style={styles.step}>
            <View style={styles.markerColumn}>
              {isCurrent ? <Animated.View style={[styles.ring, ringStyle]} /> : null}
              <View style={[styles.marker, markerStyle]}>
                {isComplete ? <Ionicons name="checkmark" size={14} color="#FFFFFF" /> : null}
                {isCurrent ? <Ionicons name={status.icon} size={14} color="#FFFFFF" /> : null}
              </View>
              {index === ORDER_STATUSES.length - 1 ? null : (
                <View style={[styles.connector, isComplete && styles.connectorComplete]} />
              )}
            </View>

            <View style={styles.stepDetails}>
              <View style={styles.labelRow}>
                <AppText variant="h3" color={labelColor}>
                  {status.label}
                </AppText>
                {isCurrent ? (
                  <View style={styles.nowPill}>
                    <AppText variant="micro" color="primaryDeep">
                      NOW
                    </AppText>
                  </View>
                ) : null}
              </View>
              {isComplete || isCurrent ? null : (
                <AppText variant="caption" color="textFaint">
                  Expected {formatExpectedTime(placedAtMs + index * STATUS_STEP_MS)}
                </AppText>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

function makeStyles({ colors, spacing, radius }) {
  return StyleSheet.create({
    timeline: {
      padding: spacing.lg, borderRadius: radius.lg,
      borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface,
    },
    step: { flexDirection: 'row', gap: spacing.md },
    markerColumn: { width: 28, alignItems: 'center' },
    marker: {
      width: 28, height: 28, borderRadius: 14,
      alignItems: 'center', justifyContent: 'center',
    },
    markerPending: { borderWidth: 2, borderColor: colors.borderStrong, backgroundColor: colors.surface },
    markerComplete: { backgroundColor: colors.success },
    markerCurrent: { backgroundColor: colors.primary },
    ring: {
      position: 'absolute',
      width: 28, height: 28, borderRadius: 14, backgroundColor: colors.primary,
    },
    connector: { flex: 1, width: 2, marginVertical: spacing.xs, backgroundColor: colors.border },
    connectorComplete: { backgroundColor: colors.success },
    stepDetails: { flex: 1, gap: 2, paddingBottom: spacing.xl },
    labelRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    nowPill: {
      paddingHorizontal: spacing.sm, paddingVertical: 3,
      borderRadius: radius.pill, backgroundColor: colors.primarySoft,
    },
  });
}
