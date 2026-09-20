import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '../../hooks/useTheme';
import { formatCurrency } from '../../utils/format';
import { DELIVERY_FEE, TAX_RATE } from '../../constants/config';
import AppText from '../common/AppText';
import Divider from '../common/Divider';

export default function PriceBreakdown({ totals, items, compact }) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const isDeliveryFree = totals.deliveryFee === 0;

  return (
    <View style={compact ? null : styles.container}>
      {compact ? null : (
        <AppText variant="micro" color="textMuted" style={styles.sectionLabel}>
          BILL DETAILS
        </AppText>
      )}

      {items
        ? items.map((item) => (
            <View key={item.id} style={styles.row}>
              <AppText variant="body" color="textSecondary" numberOfLines={1} style={styles.itemName}>
                {item.quantity} × {item.name}
              </AppText>
              <AppText variant="body">{formatCurrency(item.price * item.quantity)}</AppText>
            </View>
          ))
        : null}
      {items ? <Divider spacing="md" /> : null}

      <View style={styles.row}>
        <AppText variant="body" color="textSecondary">
          Item subtotal
        </AppText>
        <AppText variant="body">{formatCurrency(totals.subtotal)}</AppText>
      </View>

      <View style={styles.row}>
        <AppText variant="body" color="textSecondary">
          Delivery fee
        </AppText>
        {isDeliveryFree ? (
          <View style={styles.freeGroup}>
            <AppText variant="caption" color="textFaint" style={styles.struckPrice}>
              {formatCurrency(DELIVERY_FEE)}
            </AppText>
            <AppText variant="micro" color="success">
              FREE
            </AppText>
          </View>
        ) : (
          <AppText variant="body">{formatCurrency(totals.deliveryFee)}</AppText>
        )}
      </View>

      <View style={styles.row}>
        <AppText variant="body" color="textSecondary">
          {`Taxes & charges (${Math.round(TAX_RATE * 100)}%)`}
        </AppText>
        <AppText variant="body">{formatCurrency(totals.tax)}</AppText>
      </View>

      <Divider spacing="md" />

      <View style={styles.row}>
        <AppText variant="h3">To pay</AppText>
        <AppText variant="display">{formatCurrency(totals.total)}</AppText>
      </View>
    </View>
  );
}

function makeStyles({ colors, spacing, radius }) {
  return StyleSheet.create({
    container: {
      padding: spacing.lg, borderRadius: radius.lg,
      borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface,
    },
    sectionLabel: { marginBottom: spacing.md },
    row: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      gap: spacing.sm, paddingVertical: spacing.xs,
    },
    itemName: { flex: 1 },
    freeGroup: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    struckPrice: { textDecorationLine: 'line-through' },
  });
}
