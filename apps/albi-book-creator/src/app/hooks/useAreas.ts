import { db, ImageObject } from '@abc/storage';
import { useLiveQuery } from 'dexie-react-hooks';

/**
 * Hook to fetch all interactive areas from the database
 */
export const useAreas = (): ImageObject[] => {
  return useLiveQuery(() => db.imageObjects.toArray()) ?? [];
};
