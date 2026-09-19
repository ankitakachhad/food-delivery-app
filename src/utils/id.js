let orderSequence = Math.floor(Date.now() / 1000) % 10000;

export function createOrderId() {
  orderSequence = (orderSequence + 1) % 10000;

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const counter = String(orderSequence).padStart(4, '0');

  return `ORD-${year}${month}${day}-${counter}`;
}
