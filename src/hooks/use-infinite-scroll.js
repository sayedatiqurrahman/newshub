import { useCallback, useRef, useEffect } from 'react';


export function useInfiniteScroll({
  loading,
  hasMore,
  onLoadMore,
  rootMargin = '0px',
  threshold = 0,
}) {
  const observer = useRef(null);
  const elementRef = useRef(null);

  const lastElementCallback = useCallback(
    (node) => {
      if (loading) return;

      if (observer.current) {
        observer.current.disconnect();
      }

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore && !loading) {
            onLoadMore();
          }
        },
        { rootMargin, threshold }
      );

      if (node) {
        observer.current.observe(node);
      }
    },
    [loading, hasMore, onLoadMore, rootMargin, threshold]
  );

  useEffect(() => {
    const currentRef = elementRef.current;
    const currentObserver = observer.current;

    return () => {
      if (currentRef && currentObserver) {
        currentObserver.unobserve(currentRef);
      }
    };
  }, []);

  useEffect(() => {
    const currentRef = elementRef.current;
    if (currentRef) {
      lastElementCallback(currentRef);
    }
  }, [lastElementCallback, loading, hasMore]);

  return [elementRef];
}
