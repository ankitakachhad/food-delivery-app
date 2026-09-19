import { useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { useSelector } from 'react-redux';

import { buildTheme } from '../theme';

export function useTheme() {
  const mode = useSelector((state) => state.theme.mode);
  const systemScheme = useColorScheme();
  const activeScheme = mode === 'system' ? systemScheme : mode;

  return useMemo(() => buildTheme(activeScheme), [activeScheme]);
}

export default useTheme;
