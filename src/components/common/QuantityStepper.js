import { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useTheme } from '../../hooks/useTheme';
import AppText from './AppText';

const BUTTON_STYLE_KEY = { sm: 'smallButton', md: 'mediumButton' };
const ICON_SIZE = { sm: 14, md: 18 };
const LABEL_VARIANT = { sm: 'caption', md: 'body' };

export default function QuantityStepper({
  quantity,
  onIncrease,
  onDecrease,
  size = 'md',
  style,
}) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const sizedButtonStyle = styles[BUTTON_STYLE_KEY[size]];
  const isLastUnit = quantity <= 1;

  return (
    <View style={[styles.container, style]}>
      <Pressable
        onPress={onDecrease}
        accessibilityRole="button"
        accessibilityLabel={isLastUnit ? 'Remove item' : 'Decrease quantity'}
        style={({ pressed }) => [styles.button, sizedButtonStyle, pressed && styles.pressed]}
      >
        <Ionicons
          name={isLastUnit ? 'trash-outline' : 'remove'}
          size={ICON_SIZE[size]}
          color={theme.colors.primaryDeep}
        />
      </Pressable>

      <AppText variant={LABEL_VARIANT[size]} style={styles.quantity}>
        {quantity}
      </AppText>

      <Pressable
        onPress={onIncrease}
        accessibilityRole="button"
        accessibilityLabel="Increase quantity"
        style={({ pressed }) => [styles.button, sizedButtonStyle, pressed && styles.pressed]}
      >
        <Ionicons name="add" size={ICON_SIZE[size]} color={theme.colors.primaryDeep} />
      </Pressable>
    </View>
  );
}

const makeStyles = (theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      backgroundColor: theme.colors.primarySoft,
      borderWidth: 1,
      borderColor: theme.colors.primaryBorder,
      borderRadius: theme.radius.pill,
    },
    button: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    smallButton: {
      width: 32,
      height: 32,
    },
    mediumButton: {
      width: 44,
      height: 44,
    },
    quantity: {
      minWidth: 24,
      textAlign: 'center',
    },
    pressed: {
      opacity: 0.6,
    },
  });
