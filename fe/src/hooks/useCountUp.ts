'use client';

import { useState, useEffect, useRef } from 'react';

export function useCountUp(
  end: number,
  duration: number = 800,
  trigger: boolean = true,
  decimals: number = 0
): number {
  const [value, setValue] = useState(0);
  const startTime = useRef<number | null>(null);
  const animationFrame = useRef<number>(0);

  useEffect(() => {
    if (!trigger) {
      setValue(0);
      return;
    }

    startTime.current = null;
    const step = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const progress = Math.min((timestamp - startTime.current) / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * end;

      setValue(parseFloat(current.toFixed(decimals)));

      if (progress < 1) {
        animationFrame.current = requestAnimationFrame(step);
      }
    };

    animationFrame.current = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animationFrame.current);
    };
  }, [end, duration, trigger, decimals]);

  return value;
}
