"use client";

import { useEffect, useRef, useState } from "react";

export function useCountUp(value: number, duration = 1400) {
  const [display, setDisplay] = useState(value);
  const previous = useRef(value);
  const frame = useRef<number>();

  useEffect(() => {
    const from = previous.current;
    const start = performance.now();
    const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setDisplay(from + (value - from) * easeOutExpo(progress));
      if (progress < 1) frame.current = requestAnimationFrame(tick);
      else previous.current = value;
    };

    frame.current = requestAnimationFrame(tick);
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [value, duration]);

  return display;
}
