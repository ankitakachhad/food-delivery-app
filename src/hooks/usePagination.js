import { useCallback, useEffect, useMemo, useState } from 'react';
import { PAGE_SIZE } from '../constants/config';

export function usePagination(items, pageSize = PAGE_SIZE) {
  const [visibleCount, setVisibleCount] = useState(pageSize);

  useEffect(() => {
    setVisibleCount(pageSize);
  }, [items, pageSize]);

  const visibleItems = useMemo(
    () => items.slice(0, visibleCount),
    [items, visibleCount],
  );

  const hasMore = visibleCount < items.length;

  const loadMore = useCallback(() => {
    if (!hasMore) {
      return;
    }
    setVisibleCount((current) => current + pageSize);
  }, [hasMore, pageSize]);

  return { visibleItems, hasMore, loadMore };
}
