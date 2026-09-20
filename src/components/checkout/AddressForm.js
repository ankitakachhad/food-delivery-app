import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useTheme } from '../../hooks/useTheme';
import AppInput from '../common/AppInput';
import AppText from '../common/AppText';

const ADDRESS_LABELS = ['Home', 'Work', 'Other'];

export default function AddressForm({ value, onChange, error }) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const [isEditing, setIsEditing] = useState(false);
  // A blocked checkout puts its error on a field inside the form, so the form has to open itself to show it.
  const isFormOpen = isEditing || Boolean(error);

  return (
    <View style={styles.section}>
      <View style={styles.selectedCard}>
        <View style={styles.iconBadge}>
          <Ionicons name="home" size={16} color={theme.colors.primaryDeep} />
        </View>

        <View style={styles.selectedText}>
          <View style={styles.titleRow}>
            <AppText variant="h3">{value.label}</AppText>
            <View style={styles.defaultPill}>
              <AppText variant="micro" color="textMuted">
                DEFAULT
              </AppText>
            </View>
          </View>
          <AppText variant="caption" color="textMuted" numberOfLines={2}>
            {value.line}
          </AppText>
        </View>

        <Pressable onPress={() => setIsEditing((current) => !current)} hitSlop={8}>
          <AppText variant="caption" color="primaryDeep">
            Change
          </AppText>
        </Pressable>
      </View>

      {isFormOpen ? (
        <View style={styles.form}>
          <AppInput
            label="Full address"
            value={value.line}
            onChangeText={(line) => onChange({ ...value, line })}
            placeholder="Flat, building, street, area"
            multiline
            error={error}
          />
          <AppInput
            label="Landmark (optional)"
            value={value.landmark}
            onChangeText={(landmark) => onChange({ ...value, landmark })}
            placeholder="Near Shell petrol pump"
          />

          <AppText variant="caption" color="textMuted">
            Save this address as
          </AppText>
          <View style={styles.labelRow}>
            {ADDRESS_LABELS.map((addressLabel) => {
              const isSelected = value.label === addressLabel;

              return (
                <Pressable
                  key={addressLabel}
                  onPress={() => onChange({ ...value, label: addressLabel })}
                  style={[styles.labelChip, isSelected && styles.labelChipSelected]}
                >
                  <AppText variant="caption" color={isSelected ? 'primaryDeep' : 'textSecondary'}>
                    {addressLabel}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
        </View>
      ) : null}
    </View>
  );
}

function makeStyles({ colors, spacing, radius }) {
  return StyleSheet.create({
    section: { gap: spacing.md },
    selectedCard: {
      flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md,
      padding: spacing.md, borderRadius: radius.lg,
      borderWidth: 1, borderColor: colors.primaryBorder, backgroundColor: colors.primarySoft,
    },
    iconBadge: {
      width: 32, height: 32, borderRadius: radius.sm,
      alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface,
    },
    selectedText: { flex: 1, gap: 2 },
    titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    defaultPill: {
      paddingHorizontal: spacing.sm, paddingVertical: 3,
      borderRadius: radius.pill, backgroundColor: colors.surfaceAlt,
    },
    form: { gap: spacing.md },
    labelRow: { flexDirection: 'row', gap: spacing.sm },
    labelChip: {
      paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: radius.pill,
      borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface,
    },
    labelChipSelected: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  });
}
