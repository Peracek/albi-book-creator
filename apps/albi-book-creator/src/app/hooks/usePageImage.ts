import { db } from '@abc/storage';
import { useLiveQuery } from 'dexie-react-hooks';

/**
 * Hook to fetch the current page image from the database
 */
export const usePageImage = (): { id: number; image: Blob } | undefined => {
  const images = useLiveQuery(() => db.pageImage.toArray());
  return images?.[0];
};
