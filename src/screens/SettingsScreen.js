import { useCallback, useMemo } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useTheme } from '../hooks/useTheme';
import { clearCart } from '../store/slices/cartSlice';
import { selectFavoriteIds, toggleFavorite } from '../store/slices/favoritesSlice';
import { setThemeMode } from '../store/slices/themeSlice';
import AppText from '../components/common/AppText';
import ScreenContainer from '../components/common/ScreenContainer';

const THEME_OPTIONS = [
  { mode: 'system', title: 'System', subtitle: 'Follow device appearance', icon: 'phone-portrait-outline' },
  { mode: 'light', title: 'Light', subtitle: 'Always bright', icon: 'sunny-outline' },
  { mode: 'dark', title: 'Dark', subtitle: 'Easier on the eyes at night', icon: 'moon-outline' },
];

export default function SettingsScreen({ navigation }) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const dispatch = useDispatch();
  const activeMode = useSelector((state) => state.theme.mode);
  const favoriteIds = useSelector(selectFavoriteIds);

  const handleClearData = useCallback(() => {
    Alert.alert(
      'Clear cart and favourites?',
      'This removes everything you have saved on this device.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            dispatch(clearCart());
            // The favourites slice only exposes a toggle, so clearing means switching each saved id off.
            favoriteIds.forEach((restaurantId) => dispatch(toggleFavorite(restaurantId)));
          },
        },
      ]
    );
  }, [dispatch, favoriteIds]);

  return (
    <ScreenContainer scroll contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Pressable onPress={navigation.goBack} hitSlop={8} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color={theme.colors.text} />
        </Pressable>
        <AppText variant="display">Settings</AppText>
      </View>

      <View style={styles.section}>
        <AppText variant="micro" color="textMuted">APPEARANCE</AppText>
        {THEME_OPTIONS.map((option) => {
          const isActive = activeMode === option.mode;

          return (
            <Pressable
              key={option.mode}
              onPress={() => dispatch(setThemeMode(option.mode))}
              style={[styles.row, isActive && styles.rowActive]}
            >
              <View style={styles.rowIcon}>
                <Ionicons name={option.icon} size={18} color={theme.colors.primaryDeep} />
              </View>
              <View style={styles.rowText}>
                <AppText variant="body">{option.title}</AppText>
                <AppText variant="caption" color="textMuted">
                  {option.subtitle}
                </AppText>
              </View>
              {isActive ? (
                <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
              ) : null}
            </Pressable>
          );
        })}
      </View>

      <View style={styles.section}>
        <AppText variant="micro" color="textMuted">DATA</AppText>
        <Pressable onPress={handleClearData} style={[styles.row, styles.rowDanger]}>
          <View style={[styles.rowIcon, styles.rowIconDanger]}>
            <Ionicons name="trash-outline" size={18} color={theme.colors.danger} />
          </View>
          <View style={styles.rowText}>
            <AppText variant="body" color="danger">
              Clear cart and favourites
            </AppText>
            <AppText variant="caption" color="textMuted">
              This cannot be undone
            </AppText>
          </View>
          <Ionicons name="chevron-forward" size={18} color={theme.colors.textFaint} />
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

function makeStyles({ colors, spacing, radius }) {
  return StyleSheet.create({
    content: { gap: spacing.xl, paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
    header: { gap: spacing.md },
    backButton: {
      width: 38, height: 38, borderRadius: 19,
      alignItems: 'center', justifyContent: 'center',
      borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface,
    },
    section: { gap: spacing.sm },
    row: {
      flexDirection: 'row', alignItems: 'center', gap: spacing.md,
      padding: spacing.md, borderRadius: radius.lg,
      borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface,
    },
    rowActive: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
    rowDanger: { borderColor: colors.dangerSoft },
    rowIcon: {
      width: 34, height: 34, borderRadius: radius.md,
      alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceAlt,
    },
    rowIconDanger: { backgroundColor: colors.dangerSoft },
    rowText: { flex: 1, gap: 2 },
  });
}
