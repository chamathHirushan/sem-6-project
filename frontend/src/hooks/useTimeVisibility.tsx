import { useState, useEffect } from 'react';

export const useTimedVisibility = (initialVisibility = false) => {
    const [isVisible, setIsVisible] = useState(initialVisibility);
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  
    const showDiv = () => {
      setIsVisible(true);
  
      if (timeoutId) clearTimeout(timeoutId);
      const newTimeoutId = setTimeout(() => {
        setIsVisible(false);
      }, 10000);
  
      setTimeoutId(newTimeoutId);
    };
  
    useEffect(() => {
      return () => {
        if (timeoutId) clearTimeout(timeoutId);
      };
    }, [timeoutId]);
  
    return [isVisible, showDiv] as const;
  };
  