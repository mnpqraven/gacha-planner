import { useEffect, useState } from "react";

/**
 * WARN: TESTS NEEDED
 */
export function useLocalStorage<T>(key: string, fallbackValue: T | undefined) {
  const [value, setValue] = useState(fallbackValue);
  useEffect(() => {
    const stored = localStorage.getItem(key);
    if (stored !== "undefined")
      setValue(stored ? JSON.parse(stored) : fallbackValue);
  }, [fallbackValue, key]);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}
