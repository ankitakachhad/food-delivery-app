import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { advanceStatus, syncStatusesByTime } from '../store/slices/ordersSlice';
import { ORDER_STATUSES, STATUS_STEP_MS } from '../constants/orderStatus';

export function useOrderSimulation(order) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(syncStatusesByTime());
  }, [dispatch]);

  useEffect(() => {
    if (!order || order.statusIndex >= ORDER_STATUSES.length - 1) {
      return undefined;
    }

    const timer = setInterval(() => {
      dispatch(advanceStatus(order.id));
    }, STATUS_STEP_MS);

    return () => clearInterval(timer);
  }, [dispatch, order]);
}
