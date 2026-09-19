import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useTheme } from '../../hooks/useTheme';
import AppText from './AppText';

const BANNER_BACKGROUND = '#1A1512';
const BANNER_TITLE_COLOR = '#FAF7F5';
const BANNER_MESSAGE_COLOR = 'rgba(250,247,245,0.72)';

export default function OfflineBanner({ visible = false, style }) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  if (!visible) {
    return null;
  }

  return (
    <View style={[styles.banner, style]}>
      <Ionicons name="cloud-offline-outline" size={18} color={BANNER_TITLE_COLOR} />

      <View style={styles.copy}>
        <AppText variant="caption" color={BANNER_TITLE_COLOR}>
          You&apos;re offline
        </AppText>

        <AppText variant="caption" color={BANNER_MESSAGE_COLOR}>
          Showing your last saved data
        </AppText>
      </View>
    </View>
  );
}

const makeStyles = (theme) =>
  StyleSheet.create({
    banner: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      backgroundColor: BANNER_BACKGROUND,
    },
    copy: {
      flex: 1,
    },
  });
