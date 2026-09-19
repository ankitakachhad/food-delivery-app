import { darkColors, lightColors } from './colors';
import { radius } from './radius';
import { spacing } from './spacing';
import { fontFamilies, textVariants } from './typography';
import { isSmallDevice, scale } from './responsive';

export function buildTheme(colorScheme) {
  const isDark = colorScheme === 'dark';

  return {
    colors: isDark ? darkColors : lightColors,
    spacing,
    radius,
    textVariants,
    isDark,
  };
}

export {
  darkColors,
  fontFamilies,
  isSmallDevice,
  lightColors,
  radius,
  scale,
  spacing,
  textVariants,
};
