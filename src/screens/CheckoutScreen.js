import { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { ROUTES } from '../navigation/routes';
import { useTheme } from '../hooks/useTheme';
import { createOrderId } from '../utils/id';
import {
  clearCart,
  selectCartItems,
  selectCartRestaurantId,
  selectCartRestaurantName,
  selectCartTotals,
} from '../store/slices/cartSlice';
import { placeOrder } from '../store/slices/ordersSlice';
import AppText from '../components/common/AppText';
import Card from '../components/common/Card';
import ScreenContainer from '../components/common/ScreenContainer';
import PriceBreakdown from '../components/cart/PriceBreakdown';
import AddressForm from '../components/checkout/AddressForm';
import CheckoutSummaryBar from '../components/checkout/CheckoutSummaryBar';
import DeliveryInstructionsField from '../components/checkout/DeliveryInstructionsField';
import PaymentMethodSelector from '../components/checkout/PaymentMethodSelector';

const DEFAULT_ADDRESS = {
  label: 'Home',
  line: '42 Riverside Residency, Satellite Road, Ahmedabad 380015',
  landmark: '',
};

export default function CheckoutScreen({ navigation }) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const totals = useSelector(selectCartTotals);
  const restaurantId = useSelector(selectCartRestaurantId);
  const restaurantName = useSelector(selectCartRestaurantName);

  const [address, setAddress] = useState(DEFAULT_ADDRESS);
  const [addressError, setAddressError] = useState('');
  const [instructions, setInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');

  const handleAddressChange = useCallback((nextAddress) => {
    setAddress(nextAddress);
    setAddressError('');
  }, []);

  const handlePlaceOrder = useCallback(() => {
    if (address.line.trim().length === 0) {
      setAddressError('Add a delivery address to continue');
      return;
    }

    const orderId = createOrderId();

    dispatch(
      placeOrder({
        id: orderId,
        restaurantId,
        restaurantName,
        items,
        totals,
        address: [address.label, address.line, address.landmark]
          .filter((part) => part.trim().length > 0)
          .join(' · '),
        instructions,
        paymentMethod,
      })
    );
    dispatch(clearCart());
    navigation.replace(ROUTES.ORDER_TRACKING, { orderId });
  }, [
    address,
    dispatch,
    instructions,
    items,
    navigation,
    paymentMethod,
    restaurantId,
    restaurantName,
    totals,
  ]);

  return (
    <View style={styles.screen}>
      <ScreenContainer scroll contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Pressable onPress={navigation.goBack} hitSlop={8} style={styles.backButton}>
            <Ionicons name="arrow-back" size={20} color={theme.colors.text} />
          </Pressable>
          <AppText variant="display">Checkout</AppText>
        </View>

        <View style={styles.section}>
          <AppText variant="micro" color="textMuted">
            DELIVERY ADDRESS
          </AppText>
          <AddressForm value={address} onChange={handleAddressChange} error={addressError} />
        </View>

        <View style={styles.section}>
          <AppText variant="micro" color="textMuted">
            DELIVERY INSTRUCTIONS
          </AppText>
          <DeliveryInstructionsField value={instructions} onChange={setInstructions} />
        </View>

        <View style={styles.section}>
          <AppText variant="micro" color="textMuted">
            PAYMENT METHOD
          </AppText>
          <PaymentMethodSelector value={paymentMethod} onChange={setPaymentMethod} />
        </View>

        <View style={styles.section}>
          <AppText variant="micro" color="textMuted">
            ORDER SUMMARY
          </AppText>
          <Card>
            <PriceBreakdown totals={totals} items={items} compact />
          </Card>
        </View>
      </ScreenContainer>

      <CheckoutSummaryBar total={totals.total} onPlaceOrder={handlePlaceOrder} />
    </View>
  );
}

function makeStyles({ colors, spacing }) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.background },
    content: { gap: spacing.xl, paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
    header: { gap: spacing.md },
    backButton: {
      width: 38,
      height: 38,
      borderRadius: 19,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    section: { gap: spacing.sm },
  });
}
