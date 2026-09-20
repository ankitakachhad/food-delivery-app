import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ROUTES } from './routes';
import { useTheme } from '../hooks/useTheme';
import BottomTabs from './BottomTabs';
import RestaurantDetailsScreen from '../screens/RestaurantDetailsScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import OrderTrackingScreen from '../screens/OrderTrackingScreen';
import OrderDetailsScreen from '../screens/OrderDetailsScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const theme = useTheme();

  const navigationTheme = {
    ...(theme.isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(theme.isDark ? DarkTheme : DefaultTheme).colors,
      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.text,
      border: theme.colors.border,
      primary: theme.colors.primary,
    },
  };

  const screenOptions = {
    headerShown: false,
    contentStyle: { backgroundColor: theme.colors.background },
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen name={ROUTES.TABS} component={BottomTabs} />
        <Stack.Screen name={ROUTES.RESTAURANT_DETAILS} component={RestaurantDetailsScreen} />
        <Stack.Screen name={ROUTES.CHECKOUT} component={CheckoutScreen} />
        <Stack.Screen
          name={ROUTES.ORDER_TRACKING}
          component={OrderTrackingScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen name={ROUTES.ORDER_DETAILS} component={OrderDetailsScreen} />
        <Stack.Screen name={ROUTES.SETTINGS} component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
