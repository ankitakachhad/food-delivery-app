import { useCallback, useMemo } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { ROUTES } from '../navigation/routes';
import { useTheme } from '../hooks/useTheme';
import { ORDER_STATUSES } from '../constants/orderStatus';
import { formatCurrency, formatOrderDate } from '../utils/format';
import AppText from '../components/common/AppText';
import Divider from '../components/common/Divider';
import ErrorState from '../components/common/ErrorState';
import ScreenContainer from '../components/common/ScreenContainer';
import PriceBreakdown from '../components/cart/PriceBreakdown';

export default function OrderDetailsScreen({ navigation, route }) {
  const { orderId } = route.params;
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const order = useSelector((state) => state.orders.list.find((entry) => entry.id === orderId));

  const goHome = useCallback(() => navigation.navigate(ROUTES.TABS), [navigation]);

  if (!order) {
    return (
      <ScreenContainer>
        <ErrorState
          title="Order not found"
          message="This order is no longer available on this device."
          actionLabel="Go home"
          onAction={goHome}
        />
      </ScreenContainer>
    );
  }

  const isDelivered = order.statusIndex === ORDER_STATUSES.length - 1;
  const deliveryNote = order.instructions.trim().length > 0 ? order.instructions : 'None added';

  return (
    <ScreenContainer scroll contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Pressable onPress={navigation.goBack} hitSlop={8} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color={theme.colors.text} />
        </Pressable>
        <AppText variant="display">Order details</AppText>
      </View>

      <View style={styles.summaryHead}>
        <View style={styles.summaryHeadText}>
          <AppText variant="h3">{order.id}</AppText>
          <AppText variant="caption" color="textMuted">
            {formatOrderDate(order.placedAt)}
          </AppText>
        </View>
        <View style={[styles.statusPill, isDelivered && styles.statusPillDelivered]}>
          <AppText variant="micro" color={isDelivered ? 'success' : 'primaryDeep'}>
            {ORDER_STATUSES[order.statusIndex].label.toUpperCase()}
          </AppText>
        </View>
      </View>

      <View style={styles.restaurantStrip}>
        <Image
          source={{ uri: order.items[0].image }}
          style={styles.restaurantImage}
          resizeMode="cover"
        />
        <AppText variant="h3" numberOfLines={1} style={styles.restaurantName}>
          {order.restaurantName}
        </AppText>
      </View>

      <View style={styles.block}>
        <AppText variant="micro" color="textMuted">ITEMS</AppText>
        {order.items.map((item) => (
          <View key={item.id} style={styles.itemRow}>
            <AppText variant="body" color="textSecondary" numberOfLines={1} style={styles.itemName}>
              {item.quantity} × {item.name}
            </AppText>
            <AppText variant="body">{formatCurrency(item.price * item.quantity)}</AppText>
          </View>
        ))}
      </View>

      <PriceBreakdown totals={order.totals} />

      <View style={styles.block}>
        <AppText variant="micro" color="textMuted">DELIVERY ADDRESS</AppText>
        <AppText variant="body" color="textSecondary">
          {order.address}
        </AppText>
        <Divider spacing="md" />
        <AppText variant="micro" color="textMuted">DELIVERY INSTRUCTIONS</AppText>
        <AppText variant="body" color="textSecondary">
          {deliveryNote}
        </AppText>
        <Divider spacing="md" />
        <AppText variant="micro" color="textMuted">PAYMENT METHOD</AppText>
        <AppText variant="body" color="textSecondary">
          Paid via {order.paymentMethod}
        </AppText>
      </View>
    </ScreenContainer>
  );
}

function makeStyles({ colors, spacing, radius }) {
  return StyleSheet.create({
    content: { gap: spacing.lg, paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
    header: { gap: spacing.md },
    backButton: {
      width: 38, height: 38, borderRadius: 19,
      alignItems: 'center', justifyContent: 'center',
      borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface,
    },
    summaryHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    summaryHeadText: { flex: 1, gap: 2 },
    statusPill: {
      paddingHorizontal: spacing.md, paddingVertical: 5,
      borderRadius: radius.pill, backgroundColor: colors.primarySoft,
    },
    statusPillDelivered: { backgroundColor: colors.successSoft },
    restaurantStrip: {
      flexDirection: 'row', alignItems: 'center', gap: spacing.md,
      padding: spacing.md, borderRadius: radius.lg, backgroundColor: colors.surfaceAlt,
    },
    restaurantImage: { width: 44, height: 44, borderRadius: radius.md, backgroundColor: colors.skeleton },
    restaurantName: { flex: 1 },
    block: {
      gap: spacing.sm, padding: spacing.lg, borderRadius: radius.lg,
      borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface,
    },
    itemRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    itemName: { flex: 1 },
  });
}
