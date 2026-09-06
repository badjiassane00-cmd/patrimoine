import { useRef } from "react";

/**
 * Détecte un balayage horizontal (swipe) sur un élément tactile. Ignore les
 * gestes trop verticaux (pour ne pas interférer avec le scroll de la page)
 * et les gestes trop courts (pour ne pas déclencher sur un simple tap).
 */
export function useSwipe({ onSwipeLeft, onSwipeRight, threshold = 55 } = {}) {
  const start = useRef(null);

  const onTouchStart = (event) => {
    const touch = event.touches[0];
    start.current = { x: touch.clientX, y: touch.clientY, time: Date.now() };
  };

  const onTouchEnd = (event) => {
    if (!start.current) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - start.current.x;
    const dy = touch.clientY - start.current.y;
    const dt = Date.now() - start.current.time;
    start.current = null;

    if (dt > 600) return;
    if (Math.abs(dx) < threshold) return;
    if (Math.abs(dy) > Math.abs(dx) * 0.6) return;

    if (dx < 0) onSwipeLeft?.();
    else onSwipeRight?.();
  };

  return { onTouchStart, onTouchEnd };
}
