import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '../../hooks/useTheme';
import { formatCurrency } from '../../utils/format';
import AppText from '../common/AppText';
import QuantityStepper from '../common/QuantityStepper';

export default function CartItemRow({ item, onIncrease, onDecrease }) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const dietColor = item.isVeg ? theme.colors.success : theme.colors.danger;

  return (
    <View style={styles.row}>
      <View style={[styles.dietMark, { borderColor: dietColor }]}>
        <View style={[styles.dietDot, { backgroundColor: dietColor }]} />
      </View>

      <View style={styles.details}>
        <AppText variant="body" numberOfLines={2}>
          {item.name}
        </AppText>
        <AppText variant="caption" color="textMuted">
          {formatCurrency(item.price)} each
        </AppText>
      </View>

      <QuantityStepper
        quantity={item.quantity}
        onIncrease={onIncrease}
        onDecrease={onDecrease}
        size="sm"
      />

      <View style={styles.amountColumn}>
        <AppText variant="h3">{formatCurrency(item.price * item.quantity)}</AppText>
      </View>
    </View>
  );
}

function makeStyles({ colors, spacing }) {
  return StyleSheet.create({
    row: {
      flexDirection: 'row', alignItems: 'center',
      paddingVertical: spacing.md,
      borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border,
    },
    dietMark: {
      width: 14, height: 14, borderRadius: 3, borderWidth: 1.5,
      alignItems: 'center', justifyContent: 'center',
    },
    dietDot: { width: 6, height: 6, borderRadius: 3 },
    details: { flex: 1, gap: 2, paddingHorizontal: spacing.sm },
    amountColumn: { width: 72, alignItems: 'flex-end' },
  });
}
