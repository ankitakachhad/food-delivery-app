import { CURRENCY } from '../constants/config';

const MONTH_LABELS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export function formatCurrency(amount) {
  const rupees = Math.round(Number(amount) || 0);
  return `${CURRENCY}${rupees}`;
}

export function formatOrderDate(isoString) {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const day = date.getDate();
  const month = MONTH_LABELS[date.getMonth()];
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const meridiem = hours < 12 ? 'AM' : 'PM';
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;

  return `${day} ${month} ${year}, ${displayHours}:${minutes} ${meridiem}`;
}

export function formatItemCount(count) {
  return count === 1 ? '1 item' : `${count} items`;
}
