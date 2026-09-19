import { Dimensions } from 'react-native';

const BASE_WIDTH = 390;
const MIN_RATIO = 0.9;
const MAX_RATIO = 1.15;
const SMALL_DEVICE_WIDTH = 360;

const { width: windowWidth } = Dimensions.get('window');

const ratio = Math.min(Math.max(windowWidth / BASE_WIDTH, MIN_RATIO), MAX_RATIO);

export const isSmallDevice = windowWidth < SMALL_DEVICE_WIDTH;

export function scale(size) {
  return Math.round(size * ratio);
}
