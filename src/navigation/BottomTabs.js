import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';

import { ROUTES } from './routes';
import { useTheme } from '../hooks/useTheme';
import { selectCartCount } from '../store/slices/cartSlice';
import Badge from '../components/common/Badge';
import HomeScreen from '../screens/HomeScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import CartScreen from '../screens/CartScreen';
import OrderHistoryScreen from '../screens/OrderHistoryScreen';

const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  [ROUTES.HOME]: ['home', 'home-outline'],
  [ROUTES.FAVORITES]: ['heart', 'heart-outline'],
  [ROUTES.CART]: ['bag-handle', 'bag-handle-outline'],
  [ROUTES.ORDERS]: ['receipt', 'receipt-outline'],
};

function TabIcon({ routeName, focused, color, cartCount }) {
  const [filled, outline] = TAB_ICONS[routeName];

  return (
    <View>
      <Ionicons name={focused ? filled : outline} size={24} color={color} />
      {routeName === ROUTES.CART ? (
        <View style={{ position: 'absolute', top: -6, right: -10 }}>
          <Badge count={cartCount} />
        </View>
      ) : null}
    </View>
  );
}

export default function BottomTabs() {
  const theme = useTheme();
  const cartCount = useSelector(selectCartCount);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primaryDeep,
        tabBarInactiveTintColor: theme.colors.textFaint,
        tabBarStyle: {
          height: 84,
          paddingTop: 8,
          paddingBottom: 24,
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
        },
        tabBarLabelStyle: {
          fontFamily: 'PlusJakartaSans_600SemiBold',
          fontSize: 11,
        },
        tabBarIcon: ({ focused, color }) => (
          <TabIcon
            routeName={route.name}
            focused={focused}
            color={color}
            cartCount={cartCount}
          />
        ),
      })}
    >
      <Tab.Screen name={ROUTES.HOME} component={HomeScreen} />
      <Tab.Screen name={ROUTES.FAVORITES} component={FavoritesScreen} />
      <Tab.Screen name={ROUTES.CART} component={CartScreen} />
      <Tab.Screen name={ROUTES.ORDERS} component={OrderHistoryScreen} options={{ title: 'Orders' }} />
    </Tab.Navigator>
  );
}
