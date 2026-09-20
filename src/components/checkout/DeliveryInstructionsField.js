import { useCallback, useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useTheme } from '../../hooks/useTheme';
import AppInput from '../common/AppInput';
import AppText from '../common/AppText';

const QUICK_NOTES = ['Leave at the door', 'Do not ring the bell', 'Avoid calling'];
const SEPARATOR = '. ';

export default function DeliveryInstructionsField({ value, onChange }) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  const toggleQuickNote = useCallback(
    (note) => {
      const notes = value.split(SEPARATOR).filter((part) => part.trim().length > 0);

      if (notes.includes(note)) {
        onChange(notes.filter((part) => part !== note).join(SEPARATOR));
        return;
      }

      onChange([...notes, note].join(SEPARATOR));
    },
    [onChange, value]
  );

  return (
    <View style={styles.field}>
      <AppInput
        value={value}
        onChangeText={onChange}
        placeholder="Anything the rider should know?"
        multiline
      />

      <View style={styles.chipRow}>
        {QUICK_NOTES.map((note) => {
          const isActive = value.includes(note);

          return (
            <Pressable
              key={note}
              onPress={() => toggleQuickNote(note)}
              style={[styles.chip, isActive && styles.chipActive]}
            >
              <AppText variant="caption" color={isActive ? 'primaryDeep' : 'textSecondary'}>
                {note}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function makeStyles({ colors, spacing, radius }) {
  return StyleSheet.create({
    field: { gap: spacing.md },
    chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
    chip: {
      paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.pill,
      borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface,
    },
    chipActive: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  });
}
