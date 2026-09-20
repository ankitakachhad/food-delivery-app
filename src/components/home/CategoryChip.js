import { useMemo } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useTheme } from '../../hooks/useTheme';
import AppText from '../common/AppText';

export default function CategoryChip({ category, isActive, onPress }) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  return (
    <Pressable
      onPress={() => onPress(category.id)}
      style={[styles.chip, isActive && styles.chipActive]}
      accessibilityRole="button"
      accessibilityState={{ selected: isActive }}
      accessibilityLabel={category.name}
    >
      <Ionicons
        name={category.icon}
        size={16}
        color={isActive ? '#FFFFFF' : theme.colors.primary}
      />
      <AppText variant="caption" color={isActive ? '#FFFFFF' : 'textSecondary'}>
        {category.name}
      </AppText>
    </Pressable>
  );
}

function makeStyles({ colors, radius, spacing }) {
  return StyleSheet.create({
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.pill,
    },
    chipActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
  });
}
