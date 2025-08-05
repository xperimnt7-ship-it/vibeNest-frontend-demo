import { useEffect, useRef, useState, useCallback } from 'react';

export const useInfiniteScroll = (fetchData, options = {}) => {
  const {
    threshold = 0.1,
    rootMargin = '100px',
    enabled = true,
    initialPage = 1,
    pageSize = 10
  } = options;

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(initialPage);
  
  const observerRef = useRef();
  const loadingRef = useRef();

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore || !enabled) return;

    try {
      setIsLoading(true);
      setError(null);

      const result = await fetchData(page, pageSize);
      
      if (result && result.data) {
        const newData = result.data.result || result.data;
        const metadata = result.data.metaData || {};
        
        setData(prev => [...prev, ...newData]);
        setPage(prev => prev + 1);
        
        // Check if there's more data
        if (metadata.hasMore === false || newData.length < pageSize) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Infinite scroll error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [fetchData, page, pageSize, isLoading, hasMore, enabled]);

  // Set up intersection observer
  useEffect(() => {
    if (!enabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    observerRef.current = observer;

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMore, hasMore, isLoading, threshold, rootMargin, enabled]);

  // Reset function
  const reset = useCallback(() => {
    setData([]);
    setPage(initialPage);
    setHasMore(true);
    setError(null);
    setIsLoading(false);
  }, [initialPage]);

  // Manual refresh function
  const refresh = useCallback(async () => {
    reset();
    await loadMore();
  }, [reset, loadMore]);

  return {
    data,
    isLoading,
    hasMore,
    error,
    loadMore,
    reset,
    refresh,
    loadingRef
  };
};