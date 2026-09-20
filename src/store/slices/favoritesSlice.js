import { createSlice } from '@reduxjs/toolkit';

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
    ids: [],
  },
  reducers: {
    toggleFavorite(state, action) {
      const restaurantId = action.payload;
      const existingIndex = state.ids.indexOf(restaurantId);

      if (existingIndex === -1) {
        state.ids.push(restaurantId);
        return;
      }

      state.ids.splice(existingIndex, 1);
    },
  },
});

export const { toggleFavorite } = favoritesSlice.actions;

export const selectFavoriteIds = (state) => state.favorites.ids;

export const selectIsFavorite = (restaurantId) => (state) =>
  state.favorites.ids.includes(restaurantId);

export default favoritesSlice.reducer;
