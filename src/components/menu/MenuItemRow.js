import { memo, useCallback, useMemo } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useTheme } from '../../hooks/useTheme';
import { fontFamilies } from '../../theme/typography';
import { formatCurrency } from '../../utils/format';
import AppText from '../common/AppText';
import QuantityStepper from '../common/QuantityStepper';

function MenuItemRow({ item, quantity, onAdd, onIncrease, onDecrease }) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const dietColor = item.isVeg ? theme.colors.success : theme.colors.danger;

  const handleAdd = useCallback(() => onAdd(item), [item, onAdd]);
  const handleIncrease = useCallback(() => onIncrease(item.id), [item.id, onIncrease]);
  const handleDecrease = useCallback(() => onDecrease(item.id), [item.id, onDecrease]);

  return (
    <View style={styles.row}>
      <View style={styles.details}>
        <View style={styles.badgeRow}>
          <View style={[styles.dietIndicator, { borderColor: dietColor }]}>
            <View style={[styles.dietDot, { backgroundColor: dietColor }]} />
          </View>
          <Ionicons name="star" size={12} color={theme.colors.star} />
          <AppText variant="micro" color="textSecondary">
            {item.rating}
          </AppText>
        </View>

        <AppText variant="h3" numberOfLines={2}>
          {item.name}
        </AppText>

        <AppText variant="body" style={styles.price}>
          {formatCurrency(item.price)}
        </AppText>

        <AppText variant="caption" color="textMuted" numberOfLines={2}>
          {item.description}
        </AppText>
      </View>

      <View style={styles.imageColumn}>
        <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />

        <View style={styles.control}>
          {quantity > 0 ? (
            <QuantityStepper
              quantity={quantity}
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
              size="sm"
            />
          ) : (
            <Pressable
              onPress={handleAdd}
              style={styles.addButton}
              accessibilityRole="button"
              accessibilityLabel={`Add ${item.name}`}
            >
              <AppText variant="micro" color="primaryDeep">
                ADD
              </AppText>
              <Ionicons name="add" size={14} color={theme.colors.primaryDeep} />
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

export default memo(MenuItemRow);

function makeStyles({ colors, radius, spacing }) {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      gap: spacing.lg,
      paddingTop: spacing.lg,
      paddingBottom: spacing.xl,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    details: { flex: 1, gap: spacing.xs },
    badgeRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
    dietIndicator: {
      width: 14,
      height: 14,
      marginRight: spacing.xs,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1.5,
      borderRadius: 3,
    },
    dietDot: { width: 6, height: 6, borderRadius: 3 },
    price: { fontFamily: fontFamilies.bodyBold, color: colors.text },
    imageColumn: { width: 96 },
    image: {
      width: 96,
      height: 96,
      borderRadius: radius.md,
      backgroundColor: colors.skeleton,
    },
    control: { position: 'absolute', bottom: -14, left: 0, right: 0, alignItems: 'center' },
    addButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.primaryBorder,
      borderRadius: radius.sm,
    },
  });
}
