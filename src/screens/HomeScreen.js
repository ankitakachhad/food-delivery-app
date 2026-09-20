import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { useDebounce } from '../hooks/useDebounce';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { usePagination } from '../hooks/usePagination';
import { useTheme } from '../hooks/useTheme';
import {
  fetchRestaurants,
  selectRestaurants,
  selectRestaurantsStatus,
} from '../store/slices/restaurantsSlice';
import { searchRestaurants } from '../utils/search';
import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';
import LoadingState from '../components/common/LoadingState';
import OfflineBanner from '../components/common/OfflineBanner';
import ScreenContainer from '../components/common/ScreenContainer';
import HomeHeader from '../components/home/HomeHeader';
import RestaurantCard from '../components/restaurant/RestaurantCard';

export default function HomeScreen() {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const dispatch = useDispatch();
  const isOffline = useNetworkStatus();
  const restaurants = useSelector(selectRestaurants);
  const status = useSelector(selectRestaurantsStatus);
  const [query, setQuery] = useState('');
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const debouncedQuery = useDebounce(query);

  const loadRestaurants = useCallback(() => {
    dispatch(fetchRestaurants());
  }, [dispatch]);

  useEffect(() => {
    loadRestaurants();
  }, [loadRestaurants]);

  const filteredRestaurants = useMemo(() => {
    const matches = searchRestaurants(restaurants, debouncedQuery);
    if (!activeCategoryId) {
      return matches;
    }
    return matches.filter((restaurant) => restaurant.categoryIds.includes(activeCategoryId));
  }, [activeCategoryId, debouncedQuery, restaurants]);

  const { visibleItems, hasMore, loadMore } = usePagination(filteredRestaurants);

  const selectCategory = useCallback((categoryId) => {
    setActiveCategoryId((current) => (current === categoryId ? null : categoryId));
  }, []);

  const clearSearch = useCallback(() => setQuery(''), []);

  const clearFilters = useCallback(() => {
    setQuery('');
    setActiveCategoryId(null);
  }, []);

  const renderRestaurant = useCallback(
    ({ item }) => <RestaurantCard restaurant={item} matchedDish={item.matchedDish} />,
    [],
  );

  let listEmptyComponent = (
    <EmptyState
      icon="search-outline"
      title="No matches yet"
      message="Try another dish, cuisine or category."
      actionLabel="Clear filters"
      onAction={clearFilters}
    />
  );
  if (status === 'loading') {
    listEmptyComponent = <LoadingState count={3} />;
  } else if (status === 'failed') {
    listEmptyComponent = (
      <ErrorState
        title="Couldn't load restaurants"
        message="Something went wrong while finding places near you."
        actionLabel="Try again"
        onAction={loadRestaurants}
      />
    );
  }

  return (
    <ScreenContainer>
      <OfflineBanner visible={isOffline} />
      <FlatList
        data={visibleItems}
        renderItem={renderRestaurant}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <HomeHeader
            query={query}
            onChangeQuery={setQuery}
            onClearSearch={clearSearch}
            activeCategoryId={activeCategoryId}
            onSelectCategory={selectCategory}
            restaurantCount={filteredRestaurants.length}
            onSeeAll={clearFilters}
          />
        }
        ListEmptyComponent={listEmptyComponent}
        ListFooterComponent={
          hasMore ? <ActivityIndicator color={theme.colors.primary} style={styles.footer} /> : null
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.4}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        removeClippedSubviews
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        windowSize={7}
      />
    </ScreenContainer>
  );
}

function makeStyles({ spacing }) {
  return StyleSheet.create({
    listContent: { gap: spacing.lg, paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
    footer: { paddingVertical: spacing.lg },
  });
}
