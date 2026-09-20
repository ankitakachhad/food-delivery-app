import { useCallback, useMemo } from 'react';
import { Alert, Image, Pressable, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { ROUTES } from '../navigation/routes';
import { useTheme } from '../hooks/useTheme';
import { useOrderSimulation } from '../hooks/useOrderSimulation';
import { ORDER_STATUSES } from '../constants/orderStatus';
import { formatCurrency, formatItemCount } from '../utils/format';
import AppButton from '../components/common/AppButton';
import AppText from '../components/common/AppText';
import ErrorState from '../components/common/ErrorState';
import ScreenContainer from '../components/common/ScreenContainer';
import OrderStatusTimeline from '../components/order/OrderStatusTimeline';

// The simulation advances a step every few seconds; the ETA still reads like a real delivery window.
const MINUTES_PER_STEP = 6;

const STATUS_NOTES = [
  'We have sent your order to the restaurant.',
  'The restaurant has accepted your order.',
  'Your food is being cooked fresh.',
  'Your rider is on the way to you.',
  'Delivered. Enjoy your meal!',
];

export default function OrderTrackingScreen({ navigation, route }) {
  const { orderId } = route.params;
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const order = useSelector((state) => state.orders.list.find((entry) => entry.id === orderId));

  useOrderSimulation(order);

  const goHome = useCallback(() => navigation.navigate(ROUTES.TABS), [navigation]);

  const showSupportInfo = useCallback(() => {
    Alert.alert('We are here to help', 'Our support team is available 24x7 on 1800 200 300.');
  }, []);

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

  const stepsRemaining = ORDER_STATUSES.length - 1 - order.statusIndex;
  let etaLabel = 'ARRIVING IN';
  let etaValue = `${stepsRemaining * MINUTES_PER_STEP} min`;

  if (stepsRemaining === 0) {
    etaLabel = 'ORDER COMPLETE';
    etaValue = 'Delivered';
  }

  return (
    <ScreenContainer scroll contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Pressable onPress={navigation.goBack} hitSlop={8} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color={theme.colors.text} />
        </Pressable>
        <View>
          <AppText variant="h1">Track order</AppText>
          <AppText variant="caption" color="textFaint" style={styles.orderId}>
            {order.id}
          </AppText>
        </View>
      </View>

      <View style={styles.etaCard}>
        <AppText variant="micro" color="primaryDeep">{etaLabel}</AppText>
        <AppText variant="display">{etaValue}</AppText>
        <AppText variant="body" color="textSecondary">
          {STATUS_NOTES[order.statusIndex]}
        </AppText>
      </View>

      <OrderStatusTimeline statusIndex={order.statusIndex} placedAt={order.placedAt} />

      <View style={styles.orderStrip}>
        <Image
          source={{ uri: order.items[0].image }}
          style={styles.restaurantImage}
          resizeMode="cover"
        />
        <View style={styles.stripText}>
          <AppText variant="h3" numberOfLines={1}>
            {order.restaurantName}
          </AppText>
          <AppText variant="caption" color="textMuted">
            {formatItemCount(order.items.length)} · Paid via {order.paymentMethod}
          </AppText>
        </View>
        <AppText variant="h3">{formatCurrency(order.totals.total)}</AppText>
      </View>

      <AppButton
        title="Need help with this order?"
        variant="secondary"
        fullWidth
        icon={<Ionicons name="headset-outline" size={18} color={theme.colors.primaryDeep} />}
        onPress={showSupportInfo}
      />
    </ScreenContainer>
  );
}

function makeStyles({ colors, spacing, radius }) {
  return StyleSheet.create({
    content: { gap: spacing.lg, paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
    header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    backButton: {
      width: 38, height: 38, borderRadius: 19,
      alignItems: 'center', justifyContent: 'center',
      borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface,
    },
    orderId: { letterSpacing: 1.2 },
    etaCard: {
      gap: spacing.xs, padding: spacing.lg, borderRadius: radius.lg,
      borderWidth: 1, borderColor: colors.primaryBorder, backgroundColor: colors.primarySoft,
    },
    orderStrip: {
      flexDirection: 'row', alignItems: 'center', gap: spacing.md,
      padding: spacing.md, borderRadius: radius.lg, backgroundColor: colors.surfaceAlt,
    },
    restaurantImage: { width: 44, height: 44, borderRadius: radius.md, backgroundColor: colors.skeleton },
    stripText: { flex: 1, gap: 2 },
  });
}
