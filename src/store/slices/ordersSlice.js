import { createSlice } from '@reduxjs/toolkit';

import { ORDER_STATUSES, STATUS_STEP_MS } from '../../constants/orderStatus';
import { createOrderId } from '../../utils/id';

const LAST_STATUS_INDEX = ORDER_STATUSES.length - 1;

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    list: [],
  },
  reducers: {
    placeOrder: {
      reducer(state, action) {
        state.list.unshift(action.payload);
      },
      prepare(orderPayload) {
        const timestamp = new Date().toISOString();

        return {
          payload: {
            id: orderPayload.id || createOrderId(),
            restaurantId: orderPayload.restaurantId,
            restaurantName: orderPayload.restaurantName,
            items: orderPayload.items,
            totals: orderPayload.totals,
            address: orderPayload.address,
            instructions: orderPayload.instructions || '',
            paymentMethod: orderPayload.paymentMethod,
            statusIndex: 0,
            placedAt: timestamp,
            updatedAt: timestamp,
          },
        };
      },
    },
    advanceStatus(state, action) {
      const order = state.list.find((entry) => entry.id === action.payload);

      if (!order || order.statusIndex >= LAST_STATUS_INDEX) {
        return;
      }

      order.statusIndex += 1;
      order.updatedAt = new Date().toISOString();
    },
    syncStatusesByTime(state) {
      // Derived from elapsed time rather than a running timer so orders keep progressing while the app is closed.
      const now = Date.now();

      state.list.forEach((order) => {
        const elapsedMs = now - new Date(order.placedAt).getTime();
        const stepsElapsed = Math.floor(elapsedMs / STATUS_STEP_MS);
        const nextStatusIndex = Math.min(stepsElapsed, LAST_STATUS_INDEX);

        if (nextStatusIndex > order.statusIndex) {
          order.statusIndex = nextStatusIndex;
          order.updatedAt = new Date(now).toISOString();
        }
      });
    },
  },
});

export const { placeOrder, advanceStatus, syncStatusesByTime } = ordersSlice.actions;

export const selectOrders = (state) => state.orders.list;

export const selectOrderById = (orderId) => (state) =>
  state.orders.list.find((order) => order.id === orderId);

export const selectActiveOrders = (state) =>
  state.orders.list.filter((order) => order.statusIndex < LAST_STATUS_INDEX);

export default ordersSlice.reducer;
