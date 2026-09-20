import { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '../../hooks/useTheme';
import { formatCurrency } from '../../utils/format';
import AppText from '../common/AppText';

const ON_PRIMARY = '#FFFFFF';

export default function ViewCartBar({ itemCount, subtotal, onPress }) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const insets = useSafeAreaInsets();
  const itemLabel = itemCount === 1 ? 'ITEM' : 'ITEMS';

  return (
    <Pressable
      onPress={onPress}
      style={[styles.bar, { bottom: insets.bottom + theme.spacing.lg }]}
      accessibilityRole="button"
      accessibilityLabel={`View cart with ${itemCount} ${itemLabel.toLowerCase()}`}
    >
      <View>
        <AppText variant="micro" color={ON_PRIMARY}>
          {`${itemCount} ${itemLabel}`}
        </AppText>
        <AppText variant="h3" color={ON_PRIMARY}>
          {formatCurrency(subtotal)}
        </AppText>
      </View>

      <View style={styles.action}>
        <AppText variant="h3" color={ON_PRIMARY}>
          View cart
        </AppText>
        <Ionicons name="arrow-forward" size={18} color={ON_PRIMARY} />
      </View>
    </Pressable>
  );
}

function makeStyles({ colors, radius, spacing }) {
  return StyleSheet.create({
    bar: {
      position: 'absolute',
      left: spacing.lg,
      right: spacing.lg,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      backgroundColor: colors.primary,
      borderRadius: radius.lg,
      shadowColor: '#000000',
      shadowOpacity: 0.2,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
      elevation: 6,
    },
    action: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  });
}
