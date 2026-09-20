import { useCallback, useMemo } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { ROUTES } from '../navigation/routes';
import { useTheme } from '../hooks/useTheme';
import { formatCurrency } from '../utils/format';
import {
  decreaseQuantity,
  increaseQuantity,
  removeItem,
  selectCartItems,
  selectCartRestaurantName,
  selectCartTotals,
} from '../store/slices/cartSlice';
import AppText from '../components/common/AppText';
import EmptyState from '../components/common/EmptyState';
import ScreenContainer from '../components/common/ScreenContainer';
import CartItemRow from '../components/cart/CartItemRow';
import CartRestaurantStrip from '../components/cart/CartRestaurantStrip';
import CartSummaryBar from '../components/cart/CartSummaryBar';
import PriceBreakdown from '../components/cart/PriceBreakdown';

export default function CartScreen({ navigation }) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const totals = useSelector(selectCartTotals);
  const restaurantName = useSelector(selectCartRestaurantName);

  const goToRestaurants = useCallback(() => navigation.navigate(ROUTES.HOME), [navigation]);

  const handleDecrease = useCallback(
    (item) => {
      if (item.quantity > 1) {
        dispatch(decreaseQuantity(item.id));
        return;
      }

      Alert.alert('Remove item?', `${item.name} will be removed from your cart.`, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => dispatch(removeItem(item.id)) },
      ]);
    },
    [dispatch]
  );

  const header = (
    <View style={styles.header}>
      <Pressable onPress={goToRestaurants} hitSlop={8} style={styles.backButton}>
        <Ionicons name="arrow-back" size={20} color={theme.colors.text} />
      </Pressable>
      <AppText variant="display">Your cart</AppText>
    </View>
  );

  if (items.length === 0) {
    return (
      <ScreenContainer scroll contentContainerStyle={styles.content}>
        {header}
        <EmptyState
          icon="bag-handle-outline"
          title="Your cart is empty"
          message="Add something tasty and it will show up here."
          actionLabel="Browse restaurants"
          onAction={goToRestaurants}
        />
      </ScreenContainer>
    );
  }

  return (
    <View style={styles.screen}>
      <ScreenContainer scroll contentContainerStyle={styles.content}>
        {header}

        <CartRestaurantStrip name={restaurantName} image={items[0].image} />

        <View style={styles.itemsCard}>
          {items.map((item) => (
            <CartItemRow
              key={item.id}
              item={item}
              onIncrease={() => dispatch(increaseQuantity(item.id))}
              onDecrease={() => handleDecrease(item)}
            />
          ))}

          <Pressable onPress={goToRestaurants} style={styles.addMoreRow}>
            <Ionicons name="add" size={16} color={theme.colors.primaryDeep} />
            <AppText variant="body" color="primaryDeep">
              Add more items
            </AppText>
          </Pressable>
        </View>

        <PriceBreakdown totals={totals} />

        {totals.deliveryFee === 0 ? (
          <View style={styles.savingsStrip}>
            <Ionicons name="checkmark-circle" size={16} color={theme.colors.success} />
            <AppText variant="caption" color="success">
              You saved {formatCurrency(totals.savings)} on delivery
            </AppText>
          </View>
        ) : null}
      </ScreenContainer>

      <CartSummaryBar
        total={totals.total}
        onProceed={() => navigation.navigate(ROUTES.CHECKOUT)}
      />
    </View>
  );
}

function makeStyles({ colors, spacing, radius }) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.background },
    content: { gap: spacing.lg, paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
    header: { gap: spacing.md },
    backButton: {
      width: 38, height: 38, borderRadius: 19,
      alignItems: 'center', justifyContent: 'center',
      borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface,
    },
    itemsCard: {
      paddingHorizontal: spacing.lg, borderRadius: radius.lg,
      borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface,
    },
    addMoreRow: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
      gap: spacing.xs, paddingVertical: spacing.md,
    },
    savingsStrip: {
      flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
      padding: spacing.md, borderRadius: radius.md, backgroundColor: colors.successSoft,
    },
  });
}
