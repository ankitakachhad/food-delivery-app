import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getRestaurants } from '../../data/mockApi';

export const fetchRestaurants = createAsyncThunk('restaurants/fetch', async () => {
  const restaurants = await getRestaurants();
  return restaurants;
});

const restaurantsSlice = createSlice({
  name: 'restaurants',
  initialState: {
    data: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchRestaurants.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchRestaurants.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchRestaurants.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Something went wrong.';
      });
  },
});

export const selectRestaurants = (state) => state.restaurants.data;

export const selectRestaurantsStatus = (state) => state.restaurants.status;

export const selectRestaurantsError = (state) => state.restaurants.error;

export const selectRestaurantById = (restaurantId) => (state) =>
  state.restaurants.data.find((restaurant) => restaurant.id === restaurantId);

export default restaurantsSlice.reducer;
