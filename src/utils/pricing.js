import { DELIVERY_FEE, FREE_DELIVERY_ABOVE, TAX_RATE } from '../constants/config';

export function calcSubtotal(items) {
  if (!items || items.length === 0) {
    return 0;
  }
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function calcDeliveryFee(subtotal) {
  return subtotal >= FREE_DELIVERY_ABOVE ? 0 : DELIVERY_FEE;
}

export function calcTax(subtotal) {
  // Rounded to whole rupees here so the total stored on an order always matches the amounts on screen.
  return Math.round(subtotal * TAX_RATE);
}

export function calcTotal(subtotal, deliveryFee, tax) {
  return subtotal + deliveryFee + tax;
}

export function getCartTotals(items) {
  const subtotal = calcSubtotal(items);
  const deliveryFee = calcDeliveryFee(subtotal);
  const tax = calcTax(subtotal);
  const total = calcTotal(subtotal, deliveryFee, tax);
  const savings = DELIVERY_FEE - deliveryFee;

  return { subtotal, deliveryFee, tax, total, savings };
}
