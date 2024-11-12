import { useState, useEffect } from "react";

/**
 * Custom hook for debouncing a value.
 * @param {any} value The input value to debounce.
 * @param {number} delay The debounce delay time in milliseconds.
 * @returns The debounced value.
 */
function useDebounce(value, delay) {
  // State to store the debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set up a delay before updating the value
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup the timeout if value or delay changes
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
