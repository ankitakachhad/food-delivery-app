import { scale } from './responsive';

export const fontFamilies = {
  headingBold: 'Gabarito_700Bold',
  headingSemiBold: 'Gabarito_600SemiBold',
  bodyRegular: 'PlusJakartaSans_400Regular',
  bodyMedium: 'PlusJakartaSans_500Medium',
  bodySemiBold: 'PlusJakartaSans_600SemiBold',
  bodyBold: 'PlusJakartaSans_700Bold',
  bodyExtraBold: 'PlusJakartaSans_800ExtraBold',
};

export const textVariants = {
  display: {
    fontFamily: fontFamilies.headingBold,
    fontSize: scale(28),
    lineHeight: scale(34),
    letterSpacing: -0.6,
  },
  h1: {
    fontFamily: fontFamilies.headingBold,
    fontSize: scale(24),
    lineHeight: scale(30),
    letterSpacing: -0.4,
  },
  h2: {
    fontFamily: fontFamilies.headingSemiBold,
    fontSize: scale(20),
    lineHeight: scale(26),
    letterSpacing: -0.3,
  },
  h3: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: scale(17),
    lineHeight: scale(23),
  },
  body: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: scale(15),
    lineHeight: scale(21),
  },
  caption: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: scale(13),
    lineHeight: scale(18),
  },
  micro: {
    fontFamily: fontFamilies.bodyExtraBold,
    fontSize: scale(11),
    lineHeight: scale(14),
    letterSpacing: 0.9,
  },
};
