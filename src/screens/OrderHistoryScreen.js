import { useCallback, useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';

import { ROUTES } from '../navigation/routes';
import { useTheme } from '../hooks/useTheme';
import { syncStatusesByTime } from '../store/slices/ordersSlice';
import AppText from '../components/common/AppText';
import EmptyState from '../components/common/EmptyState';
import ScreenContainer from '../components/common/ScreenContainer';
import OrderHistoryCard from '../components/order/OrderHistoryCard';

export default function OrderHistoryScreen({ navigation }) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orders.list);

  useFocusEffect(
    useCallback(() => {
      dispatch(syncStatusesByTime());
    }, [dispatch])
  );

  const renderOrder = useCallback(
    ({ item }) => (
      <OrderHistoryCard
        order={item}
        onDetails={() => navigation.navigate(ROUTES.ORDER_DETAILS, { orderId: item.id })}
        onTrack={() => navigation.navigate(ROUTES.ORDER_TRACKING, { orderId: item.id })}
        onReorder={() =>
          navigation.navigate(ROUTES.RESTAURANT_DETAILS, { restaurantId: item.restaurantId })
        }
      />
    ),
    [navigation]
  );

  const header = (
    <View style={styles.header}>
      <AppText variant="display">Your orders</AppText>
      <AppText variant="caption" color="textMuted">
        {orders.length === 1 ? '1 order' : `${orders.length} orders`}
      </AppText>
    </View>
  );

  if (orders.length === 0) {
    return (
      <ScreenContainer>
        <View style={styles.emptyHeader}>{header}</View>
        <EmptyState
          icon="receipt-outline"
          title="No orders yet"
          message="Your past and ongoing orders will show up here."
          actionLabel="Browse restaurants"
          onAction={() => navigation.navigate(ROUTES.HOME)}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrder}
        ListHeaderComponent={header}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </ScreenContainer>
  );
}

function makeStyles({ spacing }) {
  return StyleSheet.create({
    header: { gap: 2, paddingTop: spacing.sm, paddingBottom: spacing.lg },
    emptyHeader: { paddingHorizontal: spacing.lg },
    listContent: {
      gap: spacing.md, paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl,
    },
  });
}
