import Dexie, { type EntityTable } from 'dexie';
import type { Point } from '@abc/shared';

export type ImageObject = {
  id: number;
  oid: number;
  name: string;
  stroke: Point[];
  sound?: File;
};

export const db = new Dexie('AbcDatabase') as Dexie & {
  imageObjects: EntityTable<ImageObject, 'id'>;
  pageImage: EntityTable<{ id: number; image: Blob }, 'id'>;
};

db.version(1).stores({
  imageObjects: '++id, oid, name, stroke', // don't index sound property
  pageImage: '++id', // don't index image property
});

// FIXME: bring back
// const START_OID = 11000;
const START_OID = 11015;

export const getNextOid = async () => {
  const lastRecord = await db.imageObjects.orderBy('oid').last();
  return lastRecord?.oid ? lastRecord.oid + 1 : START_OID;
};
