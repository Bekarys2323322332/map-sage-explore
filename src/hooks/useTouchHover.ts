import { useState, useCallback, useEffect } from 'react';

export const useTouchHover = (identifier: string) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Detect if device supports touch
    const checkTouch = () => {
      setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    checkTouch();
    window.addEventListener('touchstart', checkTouch, { once: true });
    
    return () => {
      window.removeEventListener('touchstart', checkTouch);
    };
  }, []);

  const handleClick = useCallback((e: React.MouseEvent | React.TouchEvent, id: string, callback: () => void) => {
    if (!isTouch) {
      // Desktop: just activate
      callback();
      return;
    }

    // Touch devices: show brief hover feedback then activate
    setHoveredId(id);
    setTimeout(() => {
      callback();
      setHoveredId(null);
    }, 150); // Brief visual feedback before activation
  }, [isTouch]);

  const isHovered = useCallback((id: string) => {
    return hoveredId === id;
  }, [hoveredId]);

  const clearHover = useCallback(() => {
    setHoveredId(null);
  }, []);

  return {
    handleClick,
    isHovered,
    clearHover,
    isTouch
  };
};
