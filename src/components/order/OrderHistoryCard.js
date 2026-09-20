import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useTheme } from '../../hooks/useTheme';
import { ORDER_STATUSES } from '../../constants/orderStatus';
import { formatCurrency, formatOrderDate } from '../../utils/format';
import AppButton from '../common/AppButton';
import AppText from '../common/AppText';
import Card from '../common/Card';
import Divider from '../common/Divider';

export default function OrderHistoryCard({ order, onDetails, onTrack, onReorder }) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const isDelivered = order.statusIndex === ORDER_STATUSES.length - 1;

  return (
    <Card>
      <View style={styles.headerRow}>
        <View style={styles.headerText}>
          <AppText variant="h3" numberOfLines={1}>
            {order.restaurantName}
          </AppText>
          <AppText variant="caption" color="textFaint">
            {order.id}
          </AppText>
        </View>

        <View style={[styles.statusPill, isDelivered && styles.statusPillDelivered]}>
          {isDelivered ? (
            <Ionicons name="checkmark-circle" size={13} color={theme.colors.success} />
          ) : null}
          <AppText variant="micro" color={isDelivered ? 'success' : 'primaryDeep'}>
            {ORDER_STATUSES[order.statusIndex].label.toUpperCase()}
          </AppText>
        </View>
      </View>

      <AppText variant="caption" color="textMuted" numberOfLines={2} style={styles.itemNames}>
        {order.items.map((item) => item.name).join(', ')}
      </AppText>

      <Divider spacing="md" />

      <View style={styles.footerText}>
        <AppText variant="display">{formatCurrency(order.totals.total)}</AppText>
        <AppText variant="caption" color="textMuted">
          {formatOrderDate(order.placedAt)}
        </AppText>
      </View>

      <View style={styles.actions}>
        <AppButton title="Details" variant="secondary" onPress={onDetails} style={styles.actionButton} />
        {isDelivered ? (
          <AppButton title="Reorder" onPress={onReorder} style={styles.actionButton} />
        ) : (
          <AppButton title="Track" onPress={onTrack} style={styles.actionButton} />
        )}
      </View>
    </Card>
  );
}

function makeStyles({ colors, spacing, radius }) {
  return StyleSheet.create({
    headerRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
    headerText: { flex: 1, gap: 2 },
    statusPill: {
      flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
      paddingHorizontal: spacing.sm, paddingVertical: 5,
      borderRadius: radius.pill, backgroundColor: colors.primarySoft,
    },
    statusPillDelivered: { backgroundColor: colors.successSoft },
    itemNames: { marginTop: spacing.sm },
    footerText: { gap: 2, marginBottom: spacing.md },
    actions: { flexDirection: 'row', gap: spacing.sm },
    actionButton: { flex: 1 },
  });
}
