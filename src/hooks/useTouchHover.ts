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

  const handleTouchStart = useCallback((id: string) => {
    if (!isTouch) return;
    setHoveredId(id);
  }, [isTouch]);

  const handleClick = useCallback((e: React.MouseEvent | React.TouchEvent, id: string, callback: () => void) => {
    if (!isTouch) {
      callback();
      return;
    }

    // On touch devices, first tap shows hover, second tap activates
    if (hoveredId === id) {
      callback();
      setHoveredId(null);
    } else {
      e.preventDefault();
      setHoveredId(id);
      // Auto-clear hover after 3 seconds
      setTimeout(() => setHoveredId(null), 3000);
    }
  }, [hoveredId, isTouch]);

  const isHovered = useCallback((id: string) => {
    return hoveredId === id;
  }, [hoveredId]);

  const clearHover = useCallback(() => {
    setHoveredId(null);
  }, []);

  return {
    handleTouchStart,
    handleClick,
    isHovered,
    clearHover,
    isTouch
  };
};
