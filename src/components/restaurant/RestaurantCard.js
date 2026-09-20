import { memo, useCallback, useMemo } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import { useTheme } from '../../hooks/useTheme';
import { ROUTES } from '../../navigation/routes';
import { selectIsFavorite, toggleFavorite } from '../../store/slices/favoritesSlice';
import { formatCurrency } from '../../utils/format';
import AppText from '../common/AppText';
import Card from '../common/Card';
import FavoriteButton from '../common/FavoriteButton';
import RatingPill from '../common/RatingPill';

function RestaurantCard({ restaurant, matchedDish }) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const isFavorite = useSelector(selectIsFavorite(restaurant.id));

  const openDetails = useCallback(() => {
    navigation.navigate(ROUTES.RESTAURANT_DETAILS, { restaurantId: restaurant.id });
  }, [navigation, restaurant.id]);

  const handleToggleFavorite = useCallback(() => {
    dispatch(toggleFavorite(restaurant.id));
  }, [dispatch, restaurant.id]);

  return (
    <Card
      onPress={openDetails}
      style={styles.card}
      accessibilityRole="button"
      accessibilityLabel={restaurant.name}
    >
      <View style={styles.imageWrapper}>
        <Image source={{ uri: restaurant.image }} style={styles.image} resizeMode="cover" />

        <View style={styles.favorite}>
          <FavoriteButton isFavorite={isFavorite} onPress={handleToggleFavorite} />
        </View>

        {restaurant.offer ? (
          <View style={styles.offerPill}>
            <AppText variant="micro" color="primaryDeep" numberOfLines={1}>
              {restaurant.offer}
            </AppText>
          </View>
        ) : null}
      </View>

      <View style={styles.titleRow}>
        <AppText variant="h3" style={styles.flexText} numberOfLines={1}>
          {restaurant.name}
        </AppText>
        <RatingPill rating={restaurant.rating} count={restaurant.ratingCount} />
      </View>

      <AppText variant="caption" color="textMuted" numberOfLines={1}>
        {restaurant.cuisines.join(' · ')}
      </AppText>

      <View style={styles.metaRow}>
        <Ionicons name="time-outline" size={14} color={theme.colors.textMuted} />
        <AppText variant="caption" color="textSecondary" style={styles.flexText} numberOfLines={1}>
          {`${restaurant.deliveryTime} · ${restaurant.distanceKm} km · ${formatCurrency(restaurant.priceForTwo)} for two`}
        </AppText>
      </View>

      {matchedDish ? (
        <View style={styles.matchRow}>
          <Ionicons name="restaurant-outline" size={13} color={theme.colors.primaryDeep} />
          <AppText variant="caption" color="primaryDeep" style={styles.flexText} numberOfLines={1}>
            {`${matchedDish} — found in this menu`}
          </AppText>
        </View>
      ) : null}
    </Card>
  );
}

export default memo(RestaurantCard);

function makeStyles({ colors, radius, spacing }) {
  return StyleSheet.create({
    card: { gap: spacing.xs },
    imageWrapper: { marginBottom: spacing.sm },
    image: {
      width: '100%',
      height: 148,
      borderRadius: radius.md,
      backgroundColor: colors.skeleton,
    },
    favorite: { position: 'absolute', top: spacing.sm, right: spacing.sm },
    offerPill: {
      position: 'absolute',
      bottom: spacing.sm,
      left: spacing.sm,
      maxWidth: '85%',
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.sm,
      backgroundColor: colors.surface,
      borderRadius: radius.sm,
    },
    titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    flexText: { flex: 1 },
    metaRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
    matchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      marginTop: spacing.xs,
      paddingTop: spacing.sm,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
  });
}
