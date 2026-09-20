import { useCallback, useMemo, useState } from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { useTheme } from '../hooks/useTheme';
import { ROUTES } from '../navigation/routes';
import {
  addItem,
  decreaseQuantity,
  increaseQuantity,
  replaceCartWithItem,
  selectCartCount,
  selectCartItems,
  selectCartRestaurantId,
  selectCartRestaurantName,
  selectCartTotals,
} from '../store/slices/cartSlice';
import { selectRestaurantById } from '../store/slices/restaurantsSlice';
import ErrorState from '../components/common/ErrorState';
import MenuCategoryTabs from '../components/menu/MenuCategoryTabs';
import MenuItemRow from '../components/menu/MenuItemRow';
import RestaurantHeader from '../components/restaurant/RestaurantHeader';
import ViewCartBar from '../components/restaurant/ViewCartBar';

export default function RestaurantDetailsScreen({ route, navigation }) {
  const { restaurantId } = route.params;
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const dispatch = useDispatch();
  const restaurant = useSelector(selectRestaurantById(restaurantId));
  const cartItems = useSelector(selectCartItems);
  const cartCount = useSelector(selectCartCount);
  const cartTotals = useSelector(selectCartTotals);
  const cartRestaurantId = useSelector(selectCartRestaurantId);
  const cartRestaurantName = useSelector(selectCartRestaurantName);
  const [activeCategory, setActiveCategory] = useState(null);

  const menuCategories = useMemo(
    () => Array.from(new Set((restaurant?.menu ?? []).map((menuItem) => menuItem.category))),
    [restaurant],
  );
  const selectedCategory = activeCategory ?? menuCategories[0];

  const menuItems = useMemo(
    () => (restaurant?.menu ?? []).filter((menuItem) => menuItem.category === selectedCategory),
    [restaurant, selectedCategory],
  );

  const quantityByItemId = useMemo(
    () => Object.fromEntries(cartItems.map((cartItem) => [cartItem.id, cartItem.quantity])),
    [cartItems],
  );

  const addMenuItem = useCallback(
    (menuItem) => {
      const payload = { item: menuItem, restaurantId, restaurantName: restaurant.name };

      if (!cartRestaurantId || cartRestaurantId === restaurantId) {
        dispatch(addItem(payload));
        return;
      }

      // A cart maps to one restaurant's delivery run, so another kitchen's items replace it rather than merge.
      Alert.alert(
        'Start a new cart?',
        `Your cart has items from ${cartRestaurantName}. Replace them?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Replace', style: 'destructive', onPress: () => dispatch(replaceCartWithItem(payload)) },
        ],
      );
    },
    [cartRestaurantId, cartRestaurantName, dispatch, restaurant, restaurantId],
  );

  const increaseMenuItem = useCallback((itemId) => dispatch(increaseQuantity(itemId)), [dispatch]);
  const decreaseMenuItem = useCallback((itemId) => dispatch(decreaseQuantity(itemId)), [dispatch]);

  const renderMenuItem = useCallback(
    ({ item }) => (
      <MenuItemRow
        item={item}
        quantity={quantityByItemId[item.id] ?? 0}
        onAdd={addMenuItem}
        onIncrease={increaseMenuItem}
        onDecrease={decreaseMenuItem}
      />
    ),
    [addMenuItem, decreaseMenuItem, increaseMenuItem, quantityByItemId],
  );

  if (!restaurant) {
    return (
      <View style={styles.screen}>
        <ErrorState
          icon="storefront-outline"
          title="Restaurant unavailable"
          message="This place is no longer taking orders."
          actionLabel="Go back"
          onAction={navigation.goBack}
        />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={menuItems}
        renderItem={renderMenuItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View>
            <RestaurantHeader restaurant={restaurant} />
            <MenuCategoryTabs
              categories={menuCategories}
              selectedCategory={selectedCategory}
              onSelectCategory={setActiveCategory}
            />
          </View>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        windowSize={7}
      />

      {cartItems.length > 0 ? (
        <ViewCartBar
          itemCount={cartCount}
          subtotal={cartTotals.subtotal}
          onPress={() => navigation.navigate(ROUTES.TABS, { screen: ROUTES.CART })}
        />
      ) : null}
    </View>
  );
}

function makeStyles({ colors, spacing }) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.background },
    listContent: { paddingHorizontal: spacing.lg, paddingBottom: 120 },
  });
}
