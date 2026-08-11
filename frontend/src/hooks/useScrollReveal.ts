import { useEffect, useRef, useCallback } from 'react';

export function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target as HTMLElement;
        el.classList.add('revealed');

        // Also reveal children with .reveal class
        const children = el.querySelectorAll('.reveal');
        children.forEach((child) => child.classList.add('revealed'));
      }
    });
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      // Immediately show everything
      if (ref.current) {
        ref.current.classList.add('revealed');
        ref.current.querySelectorAll('.reveal').forEach((el) => el.classList.add('revealed'));
      }
      return;
    }

    const observer = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin: '0px 0px -50px 0px',
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold, handleIntersection]);

  return ref;
}
