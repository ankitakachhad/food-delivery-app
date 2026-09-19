import { useMemo, useRef } from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useTheme } from '../../hooks/useTheme';

export default function FavoriteButton({ isFavorite = false, onPress, size = 22, style }) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const pressScale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(pressScale, { toValue: 0.8, duration: 90, useNativeDriver: true }),
      Animated.spring(pressScale, {
        toValue: 1,
        friction: 3,
        tension: 160,
        useNativeDriver: true,
      }),
    ]).start();

    onPress?.();
  };

  return (
    <Pressable
      onPress={handlePress}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityState={{ selected: isFavorite }}
      accessibilityLabel={isFavorite ? 'Remove from favourites' : 'Add to favourites'}
      style={[styles.button, style]}
    >
      <Animated.View style={{ transform: [{ scale: pressScale }] }}>
        <Ionicons
          name={isFavorite ? 'heart' : 'heart-outline'}
          size={size}
          color={isFavorite ? theme.colors.primary : theme.colors.textMuted}
        />
      </Animated.View>
    </Pressable>
  );
}

const makeStyles = (theme) =>
  StyleSheet.create({
    button: {
      padding: theme.spacing.sm,
      borderRadius: theme.radius.pill,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
