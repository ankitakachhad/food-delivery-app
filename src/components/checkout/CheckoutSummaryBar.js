import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '../../hooks/useTheme';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { formatCurrency } from '../../utils/format';
import AppButton from '../common/AppButton';
import AppText from '../common/AppText';

export default function CheckoutSummaryBar({ total, onPlaceOrder }) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const insets = useSafeAreaInsets();
  const isOffline = useNetworkStatus();

  return (
    <View style={[styles.bar, { paddingBottom: insets.bottom + theme.spacing.md }]}>
      {isOffline ? (
        <AppText variant="caption" color="danger">
          You are offline. Reconnect to place this order.
        </AppText>
      ) : null}

      <View style={styles.row}>
        <View>
          <AppText variant="micro" color="textMuted">
            TO PAY
          </AppText>
          <AppText variant="display">{formatCurrency(total)}</AppText>
        </View>
        <View style={styles.action}>
          <AppButton title="Place order" fullWidth disabled={isOffline} onPress={onPlaceOrder} />
        </View>
      </View>
    </View>
  );
}

function makeStyles({ colors, spacing }) {
  return StyleSheet.create({
    bar: {
      gap: spacing.sm,
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.md,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.surface,
    },
    row: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
    action: { flex: 1 },
  });
}
