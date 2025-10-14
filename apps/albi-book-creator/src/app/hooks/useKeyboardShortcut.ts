import { useEffect } from 'react';

/**
 * Hook to register a keyboard shortcut
 * @param key - The key to listen for (case-insensitive)
 * @param callback - Function to call when key is pressed
 */
export const useKeyboardShortcut = (
  key: string,
  callback: () => void
): void => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === key.toLowerCase()) {
        callback();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [key, callback]);
};
