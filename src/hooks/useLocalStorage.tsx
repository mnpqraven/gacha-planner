import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, fallbackValue?: T) {
  const [value, setValue] = useState(fallbackValue);
  useEffect(() => {
    const stored = localStorage.getItem(key);
    if (stored !== "undefined") {
      setValue(stored ? JSON.parse(stored) : fallbackValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, value]);

  return [value, setValue] as const;
}
