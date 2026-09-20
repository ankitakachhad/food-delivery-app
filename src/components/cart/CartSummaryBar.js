import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useTheme } from '../../hooks/useTheme';
import { formatCurrency } from '../../utils/format';
import AppButton from '../common/AppButton';
import AppText from '../common/AppText';

export default function CartSummaryBar({ total, onProceed }) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  return (
    <View style={styles.bar}>
      <View>
        <AppText variant="micro" color="textMuted">
          TOTAL
        </AppText>
        <AppText variant="display">{formatCurrency(total)}</AppText>
      </View>
      <View style={styles.action}>
        <AppButton
          title="Proceed to checkout"
          fullWidth
          icon={<Ionicons name="arrow-forward" size={18} color="#FFFFFF" />}
          onPress={onProceed}
        />
      </View>
    </View>
  );
}

function makeStyles({ colors, spacing }) {
  return StyleSheet.create({
    bar: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.lg,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.surface,
    },
    action: { flex: 1 },
  });
}
