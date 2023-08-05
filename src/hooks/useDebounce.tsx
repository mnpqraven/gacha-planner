"use client";

import { useCallback, useRef } from "react";

/**
 * @param onChange - callback function that will get executed after the
 * debounce duration
 * @param duration - debounce duration
 * @returns function with debounce behaviour, replace the onChange function
 * with this function
 */
export function useDebounce(onChange: (val: any) => void, duration: number) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const onEdit = useCallback(
    (val: any) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => onChange(val), duration);
    },
    [duration, onChange]
  );
  return onEdit;
}
