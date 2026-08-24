"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Toggles `.is-visible` on `.reveal` once the element enters the viewport.
 * Fires once (unobserves after), so it never re-triggers on scroll-back.
 * Pairs with the `.reveal` CSS in globals.css -- no animation library.
 */
export function useScrollReveal<T extends HTMLElement>(): {
  ref: React.RefObject<T>;
  isVisible: boolean;
} {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(node);
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}
