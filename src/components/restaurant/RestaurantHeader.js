import { useCallback, useMemo } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import { useTheme } from '../../hooks/useTheme';
import { selectIsFavorite, toggleFavorite } from '../../store/slices/favoritesSlice';
import { formatCurrency } from '../../utils/format';
import AppText from '../common/AppText';
import Divider from '../common/Divider';
import FavoriteButton from '../common/FavoriteButton';

export default function RestaurantHeader({ restaurant }) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const isFavorite = useSelector(selectIsFavorite(restaurant.id));

  const handleToggleFavorite = useCallback(() => {
    dispatch(toggleFavorite(restaurant.id));
  }, [dispatch, restaurant.id]);

  return (
    <View>
      <Image source={{ uri: restaurant.image }} style={styles.hero} resizeMode="cover" />

      <View style={[styles.heroActions, { top: insets.top + theme.spacing.sm }]}>
        <Pressable
          onPress={navigation.goBack}
          style={styles.roundButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={22} color={theme.colors.text} />
        </Pressable>

        <FavoriteButton isFavorite={isFavorite} onPress={handleToggleFavorite} />
      </View>

      <View style={styles.infoCard}>
        <AppText variant="display" numberOfLines={2}>
          {restaurant.name}
        </AppText>

        <AppText variant="caption" color="textMuted" numberOfLines={2}>
          {restaurant.cuisines.join(' · ')}
        </AppText>

        <View style={styles.metaRow}>
          <Ionicons name="time-outline" size={15} color={theme.colors.textMuted} />
          <AppText variant="caption" color="textSecondary" style={styles.flexText} numberOfLines={1}>
            {`${restaurant.deliveryTime} · ${restaurant.distanceKm} km · ${formatCurrency(restaurant.priceForTwo)} for two`}
          </AppText>
        </View>

        <Divider />

        {restaurant.offer ? (
          <View style={styles.offerStrip}>
            <Ionicons name="pricetag" size={16} color={theme.colors.primary} />
            <AppText variant="caption" color="primaryDeep" style={styles.flexText} numberOfLines={2}>
              {restaurant.offer}
            </AppText>
          </View>
        ) : null}
      </View>
    </View>
  );
}

function makeStyles({ colors, radius, spacing }) {
  return StyleSheet.create({
    hero: { width: '100%', height: 226, backgroundColor: colors.skeleton },
    heroActions: {
      position: 'absolute',
      left: spacing.lg,
      right: spacing.lg,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    roundButton: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surface,
      borderRadius: radius.pill,
      shadowColor: '#000000',
      shadowOpacity: 0.12,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
      elevation: 3,
    },
    infoCard: {
      marginTop: -30,
      marginHorizontal: spacing.lg,
      padding: spacing.lg,
      gap: spacing.xs,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.lg,
    },
    metaRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
    flexText: { flex: 1 },
    offerStrip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      padding: spacing.md,
      backgroundColor: colors.primarySoft,
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: colors.primaryBorder,
      borderRadius: radius.md,
    },
  });
}
