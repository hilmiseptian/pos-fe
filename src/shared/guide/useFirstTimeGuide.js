import { useMemo, useCallback } from 'react';
import { useCategories } from '@/modules/categories/hooks';
import { useItems } from '@/modules/items/hooks';
import { GUIDE_SEEN_KEY } from './guideConfig';

export function useFirstTimeGuide() {
  const guideSeen = localStorage.getItem(GUIDE_SEEN_KEY) === 'true';

  // Leverages existing cached queries — no extra API calls if already fetched
  const { data: categories = [], isLoading: catLoading, isError: catError } =
    useCategories();
  const { data: items = [], isLoading: itemLoading, isError: itemError } =
    useItems();

  const isLoading = catLoading || itemLoading;
  const hasError = catError || itemError;

  const shouldShow = useMemo(() => {
    if (guideSeen) return false;
    if (isLoading) return false;
    if (hasError) return false;
    // Only on desktop — sidebar is collapsed/hidden on mobile
    if (typeof window !== 'undefined' && window.innerWidth < 1024) return false;
    // System is freshly initialized when both master datasets are empty
    return categories.length === 0 && items.length === 0;
  }, [guideSeen, isLoading, hasError, categories.length, items.length]);

  const markAsSeen = useCallback(() => {
    localStorage.setItem(GUIDE_SEEN_KEY, 'true');
  }, []);

  return { shouldShow, isLoading, markAsSeen };
}