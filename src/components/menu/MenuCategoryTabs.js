import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { useTheme } from '../../hooks/useTheme';
import AppText from '../common/AppText';

export default function MenuCategoryTabs({ categories, selectedCategory, onSelectCategory }) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.tabsRow}
    >
      {categories.map((category) => {
        const isActive = category === selectedCategory;

        return (
          <Pressable
            key={category}
            onPress={() => onSelectCategory(category)}
            style={[styles.tab, isActive && styles.tabActive]}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
          >
            <AppText variant="caption" color={isActive ? '#FFFFFF' : 'textSecondary'}>
              {category}
            </AppText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

function makeStyles({ colors, radius, spacing }) {
  return StyleSheet.create({
    tabsRow: { gap: spacing.sm, paddingHorizontal: spacing.lg, paddingVertical: spacing.lg },
    tab: {
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.pill,
    },
    tabActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  });
}
