import { db, ImageObject } from '@abc/storage';
import { useLiveQuery } from 'dexie-react-hooks';

/**
 * Hook to fetch a single area by ID from the database
 * @param areaId - The ID of the area to fetch
 */
export const useArea = (areaId: number): ImageObject | undefined => {
  return useLiveQuery(() => db.imageObjects.get(areaId), [areaId]);
};
