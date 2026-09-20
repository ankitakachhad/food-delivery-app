import { useCallback, useMemo } from 'react';
import { FlatList, Image, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { useTheme } from '../hooks/useTheme';
import { ROUTES } from '../navigation/routes';
import { selectFavoriteIds, toggleFavorite } from '../store/slices/favoritesSlice';
import { selectRestaurants } from '../store/slices/restaurantsSlice';
import AppText from '../components/common/AppText';
import Card from '../components/common/Card';
import EmptyState from '../components/common/EmptyState';
import FavoriteButton from '../components/common/FavoriteButton';
import RatingPill from '../components/common/RatingPill';
import ScreenContainer from '../components/common/ScreenContainer';

export default function FavoritesScreen({ navigation }) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const dispatch = useDispatch();
  const favoriteIds = useSelector(selectFavoriteIds);
  const restaurants = useSelector(selectRestaurants);

  const favoriteRestaurants = useMemo(
    () => favoriteIds.map((id) => restaurants.find((item) => item.id === id)).filter(Boolean),
    [favoriteIds, restaurants],
  );

  const countLabel = favoriteRestaurants.length === 1 ? 'restaurant' : 'restaurants';

  const renderFavorite = useCallback(
    ({ item }) => (
      <Card
        onPress={() => navigation.navigate(ROUTES.RESTAURANT_DETAILS, { restaurantId: item.id })}
        style={styles.card}
        accessibilityRole="button"
        accessibilityLabel={item.name}
      >
        <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />

        <View style={styles.info}>
          <View style={styles.titleRow}>
            <AppText variant="h3" style={styles.flexText} numberOfLines={2}>
              {item.name}
            </AppText>
            <FavoriteButton isFavorite onPress={() => dispatch(toggleFavorite(item.id))} />
          </View>

          <AppText variant="caption" color="textMuted" numberOfLines={1}>
            {item.cuisines.join(' · ')}
          </AppText>

          <View style={styles.metaRow}>
            <RatingPill rating={item.rating} count={item.ratingCount} />
            <AppText variant="caption" color="textSecondary" style={styles.flexText} numberOfLines={1}>
              {`${item.deliveryTime} · ${item.distanceKm} km`}
            </AppText>
          </View>
        </View>
      </Card>
    ),
    [dispatch, navigation, styles],
  );

  return (
    <ScreenContainer>
      <FlatList
        data={favoriteRestaurants}
        renderItem={renderFavorite}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.header}>
            <AppText variant="display">Favorites</AppText>
            <AppText variant="caption" color="textMuted">
              {`${favoriteRestaurants.length} ${countLabel} saved`}
            </AppText>
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            icon="heart-outline"
            title="No favourites yet"
            message="Tap the heart on a restaurant to keep it here."
            actionLabel="Browse restaurants"
            onAction={() => navigation.navigate(ROUTES.HOME)}
          />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        initialNumToRender={8}
      />
    </ScreenContainer>
  );
}

function makeStyles({ colors, radius, spacing }) {
  return StyleSheet.create({
    listContent: { gap: spacing.md, paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
    header: { gap: spacing.xs, paddingTop: spacing.sm, paddingBottom: spacing.sm },
    card: { flexDirection: 'row', gap: spacing.md, padding: spacing.md },
    image: { width: 86, height: 86, borderRadius: radius.md, backgroundColor: colors.skeleton },
    info: { flex: 1, gap: spacing.xs },
    titleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
    flexText: { flex: 1 },
    metaRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.xs },
  });
}
