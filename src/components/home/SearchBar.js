import { useMemo } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useTheme } from '../../hooks/useTheme';

export default function SearchBar({ value, onChangeText, onClear }) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <Ionicons name="search" size={20} color={theme.colors.textMuted} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Search restaurants or dishes"
        placeholderTextColor={theme.colors.textFaint}
        style={styles.input}
        autoCorrect={false}
        returnKeyType="search"
        accessibilityLabel="Search restaurants or dishes"
      />
      {value.length > 0 ? (
        <Pressable
          onPress={onClear}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Clear search"
        >
          <Ionicons name="close-circle" size={20} color={theme.colors.textFaint} />
        </Pressable>
      ) : null}
    </View>
  );
}

function makeStyles({ colors, radius, spacing, textVariants }) {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      height: 50,
      paddingHorizontal: spacing.md,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.md,
    },
    input: {
      flex: 1,
      paddingVertical: 0,
      color: colors.text,
      ...textVariants.body,
    },
  });
}
