"use client";
import { useState, useEffect } from 'react';

export default function useLoader(initialDelay = 3000) {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const increment = Math.random() * 15 + 5;
        const newProgress = Math.min(prev + increment, 100);
        
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => setIsLoading(false), 500);
        }
        
        return newProgress;
      });
    }, 200);

    // Minimum loading time
    const minLoadTime = setTimeout(() => {
      if (progress >= 100) {
        setIsLoading(false);
      }
    }, initialDelay);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(minLoadTime);
    };
  }, [initialDelay, progress]);

  return { isLoading, progress, setIsLoading };
}