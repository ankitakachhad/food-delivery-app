import { createSelector, createSlice } from '@reduxjs/toolkit';

import { getCartTotals } from '../../utils/pricing';

const initialState = {
  restaurantId: null,
  restaurantName: null,
  items: [],
};

function toCartItem(menuItem) {
  return {
    id: menuItem.id,
    name: menuItem.name,
    price: menuItem.price,
    image: menuItem.image,
    isVeg: menuItem.isVeg,
    quantity: 1,
  };
}

function clearRestaurantWhenEmpty(state) {
  if (state.items.length === 0) {
    state.restaurantId = null;
    state.restaurantName = null;
  }
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // A cart belongs to one restaurant, so addItem ignores items from any other: the screen has to ask the user first and dispatch replaceCartWithItem.
    addItem(state, action) {
      const { restaurantId, restaurantName, item } = action.payload;

      if (state.restaurantId && state.restaurantId !== restaurantId) {
        return;
      }

      state.restaurantId = restaurantId;
      state.restaurantName = restaurantName;

      const existingItem = state.items.find((cartItem) => cartItem.id === item.id);

      if (existingItem) {
        existingItem.quantity += 1;
        return;
      }

      state.items.push(toCartItem(item));
    },
    increaseQuantity(state, action) {
      const cartItem = state.items.find((item) => item.id === action.payload);

      if (cartItem) {
        cartItem.quantity += 1;
      }
    },
    decreaseQuantity(state, action) {
      const cartItem = state.items.find((item) => item.id === action.payload);

      if (!cartItem) {
        return;
      }

      if (cartItem.quantity <= 1) {
        state.items = state.items.filter((item) => item.id !== action.payload);
        clearRestaurantWhenEmpty(state);
        return;
      }

      cartItem.quantity -= 1;
    },
    removeItem(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
      clearRestaurantWhenEmpty(state);
    },
    clearCart() {
      return initialState;
    },
    replaceCartWithItem(state, action) {
      const { restaurantId, restaurantName, item } = action.payload;

      return {
        restaurantId,
        restaurantName,
        items: [toCartItem(item)],
      };
    },
  },
});

export const {
  addItem,
  increaseQuantity,
  decreaseQuantity,
  removeItem,
  clearCart,
  replaceCartWithItem,
} = cartSlice.actions;

const selectCart = (state) => state.cart;

export const selectCartItems = createSelector(selectCart, (cart) => cart.items);

export const selectCartRestaurantId = createSelector(selectCart, (cart) => cart.restaurantId);

export const selectCartRestaurantName = createSelector(selectCart, (cart) => cart.restaurantName);

export const selectCartCount = createSelector(selectCartItems, (items) =>
  items.reduce((count, item) => count + item.quantity, 0)
);

export const selectCartTotals = createSelector(selectCartItems, (items) => getCartTotals(items));

export const selectCartItemQuantity = (itemId) =>
  createSelector(selectCartItems, (items) => {
    const cartItem = items.find((item) => item.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  });

export default cartSlice.reducer;
