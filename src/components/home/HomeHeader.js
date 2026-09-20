import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

import categories from '../../data/categories.json';
import { useTheme } from '../../hooks/useTheme';
import { ROUTES } from '../../navigation/routes';
import AppText from '../common/AppText';
import CategoryChip from './CategoryChip';
import SearchBar from './SearchBar';

export default function HomeHeader({
  query,
  onChangeQuery,
  onClearSearch,
  activeCategoryId,
  onSelectCategory,
  restaurantCount,
  onSeeAll,
}) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const navigation = useNavigation();
  const countLabel = restaurantCount === 1 ? 'restaurant' : 'restaurants';

  return (
    <View style={styles.header}>
      <View style={styles.locationRow}>
        <View style={styles.locationGroup}>
          <AppText variant="micro" color="primary">
            DELIVER TO
          </AppText>
          <View style={styles.locationNameRow}>
            <AppText variant="h2" numberOfLines={1}>
              Satellite, Ahmedabad
            </AppText>
            <Ionicons name="chevron-down" size={18} color={theme.colors.text} />
          </View>
        </View>

        <Pressable
          onPress={() => navigation.navigate(ROUTES.SETTINGS)}
          style={styles.avatar}
          accessibilityRole="button"
          accessibilityLabel="Profile and settings"
        >
          <Ionicons name="person" size={20} color={theme.colors.primaryDeep} />
        </Pressable>
      </View>

      <SearchBar value={query} onChangeText={onChangeQuery} onClear={onClearSearch} />

      <AppText variant="h3">What are you craving?</AppText>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
      >
        {categories.map((category) => (
          <CategoryChip
            key={category.id}
            category={category}
            isActive={category.id === activeCategoryId}
            onPress={onSelectCategory}
          />
        ))}
      </ScrollView>

      <View style={styles.sectionRow}>
        <View style={styles.sectionTitles}>
          <AppText variant="h1">Popular near you</AppText>
          <AppText variant="caption" color="textMuted">
            {`${restaurantCount} ${countLabel} delivering now`}
          </AppText>
        </View>

        <Pressable onPress={onSeeAll} hitSlop={10} accessibilityRole="button">
          <AppText variant="caption" color="primaryDeep">
            See all
          </AppText>
        </Pressable>
      </View>
    </View>
  );
}

function makeStyles({ colors, radius, spacing }) {
  return StyleSheet.create({
    header: { gap: spacing.lg, paddingTop: spacing.sm },
    locationRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    locationGroup: { flex: 1, gap: spacing.xs },
    locationNameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
    avatar: {
      width: 44,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primarySoft,
      borderWidth: 1,
      borderColor: colors.primaryBorder,
      borderRadius: radius.pill,
    },
    chipRow: { gap: spacing.sm, paddingRight: spacing.lg },
    sectionRow: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.md },
    sectionTitles: { flex: 1, gap: spacing.xs },
  });
}
