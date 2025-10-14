import { useEffect, useState } from 'react';

/**
 * Creates and manages an object URL for a Blob/File with automatic cleanup
 * to prevent memory leaks.
 */
export const useObjectUrl = (blob: Blob | File | null | undefined): string => {
  const [url, setUrl] = useState<string>('');

  useEffect(() => {
    if (!blob) {
      setUrl('');
      return;
    }

    const objectUrl = URL.createObjectURL(blob);
    setUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [blob]);

  return url;
};
