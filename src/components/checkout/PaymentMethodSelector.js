import { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useTheme } from '../../hooks/useTheme';
import AppText from '../common/AppText';

const PAYMENT_METHODS = [
  {
    id: 'UPI',
    title: 'UPI',
    subtitle: 'Google Pay, PhonePe, Paytm',
    icon: 'phone-portrait-outline',
  },
  {
    id: 'Card',
    title: 'Credit & debit card',
    subtitle: 'Visa, Mastercard, RuPay',
    icon: 'card-outline',
  },
  {
    id: 'Cash',
    title: 'Cash on delivery',
    subtitle: 'Pay the rider on arrival',
    icon: 'cash-outline',
  },
];

export default function PaymentMethodSelector({ value, onChange }) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  return (
    <View style={styles.list}>
      {PAYMENT_METHODS.map((method) => {
        const isSelected = value === method.id;

        return (
          <Pressable
            key={method.id}
            onPress={() => onChange(method.id)}
            style={[styles.row, isSelected && styles.rowSelected]}
          >
            <View style={styles.iconBadge}>
              <Ionicons name={method.icon} size={18} color={theme.colors.primaryDeep} />
            </View>

            <View style={styles.details}>
              <AppText variant="body">{method.title}</AppText>
              <AppText variant="caption" color="textMuted">
                {method.subtitle}
              </AppText>
            </View>

            <View style={[styles.radio, isSelected && styles.radioSelected]}>
              {isSelected ? <View style={styles.radioDot} /> : null}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

function makeStyles({ colors, spacing, radius }) {
  return StyleSheet.create({
    list: { gap: spacing.sm },
    row: {
      flexDirection: 'row', alignItems: 'center', gap: spacing.md,
      padding: spacing.md, borderRadius: radius.lg,
      borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface,
    },
    rowSelected: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
    iconBadge: {
      width: 36, height: 36, borderRadius: radius.md,
      alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceAlt,
    },
    details: { flex: 1, gap: 2 },
    radio: {
      width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.borderStrong,
      alignItems: 'center', justifyContent: 'center',
    },
    radioSelected: { borderColor: colors.primary },
    radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  });
}
