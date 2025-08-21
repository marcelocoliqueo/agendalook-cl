'use client';

import { useEffect, useRef, useState } from 'react';

interface UseMagnetOptions {
  strength?: number;
  enabled?: boolean;
}

export function useMagnet(options: UseMagnetOptions = {}) {
  const {
    strength = 0.3,
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

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      
      const moveX = deltaX * strength;
      const moveY = deltaY * strength;
      
      element.style.transform = `translate(${moveX}px, ${moveY}px)`;
    };

    const handleMouseLeave = () => {
      element.style.transform = 'translate(0px, 0px)';
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
      mediaQuery.removeEventListener('change', handleReducedMotionChange);
    };
  }, [strength, enabled, isReducedMotion]);

  return elementRef;
}
