import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useTheme } from '../../hooks/useTheme';
import AppText from './AppText';

const PILL_CONTENT_COLOR = '#FFFFFF';
const PILL_COUNT_COLOR = 'rgba(255,255,255,0.78)';

export default function RatingPill({ rating, count, style }) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const numericRating = Number(rating);

  if (!Number.isFinite(numericRating)) {
    return null;
  }

  return (
    <View style={[styles.pill, style]}>
      <Ionicons name="star" size={11} color={PILL_CONTENT_COLOR} />

      <AppText variant="micro" color={PILL_CONTENT_COLOR}>
        {numericRating.toFixed(1)}
      </AppText>

      {count ? (
        <AppText variant="micro" color={PILL_COUNT_COLOR}>
          ({count})
        </AppText>
      ) : null}
    </View>
  );
}

const makeStyles = (theme) =>
  StyleSheet.create({
    pill: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      gap: theme.spacing.xs,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.radius.pill,
      backgroundColor: theme.colors.success,
    },
  });
