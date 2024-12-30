import Dexie, { type EntityTable } from 'dexie';

export type Point = [x: number, y: number];

export type ImageObject = {
  id: number;
  oid: number;
  name: string;
  stroke: Point[];
};

export const db = new Dexie('AbcDatabase') as Dexie & {
  imageObjects: EntityTable<ImageObject, 'id'>;
};

db.version(1).stores({
  imageObjects: '++id, oid, name, stroke',
});
