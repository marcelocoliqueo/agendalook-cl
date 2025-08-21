'use client';

import { useEffect, useRef, useState } from 'react';

interface UseParallaxOptions {
  speed?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  enabled?: boolean;
}

export function useParallax(options: UseParallaxOptions = {}) {
  const {
    speed = 0.5,
    direction = 'up',
    enabled = true
  } = options;

  const elementRef = useRef<HTMLDivElement>(null);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    // Verificar preferencias de movimiento reducido
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleReducedMotionChange);

    if (!enabled || isReducedMotion) return;

    const element = elementRef.current;
    if (!element) return;

    let ticking = false;
    let lastScrollY = window.scrollY;

    const updateParallax = () => {
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const scrolled = window.pageYOffset;
      const rate = scrolled * -speed;

      // Aplicar transformación según la dirección
      switch (direction) {
        case 'up':
          element.style.transform = `translateY(${rate}px)`;
          break;
        case 'down':
          element.style.transform = `translateY(${-rate}px)`;
          break;
        case 'left':
          element.style.transform = `translateX(${rate}px)`;
          break;
        case 'right':
          element.style.transform = `translateX(${-rate}px)`;
          break;
      }

      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    const handleScroll = () => {
      lastScrollY = window.scrollY;
      requestTick();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      mediaQuery.removeEventListener('change', handleReducedMotionChange);
    };
  }, [speed, direction, enabled, isReducedMotion]);

  return elementRef;
}
