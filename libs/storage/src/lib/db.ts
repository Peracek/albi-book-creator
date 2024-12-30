import Dexie, { type EntityTable } from 'dexie';

export type Point = [x: number, y: number];

export type ImageObject = {
  oid: number;
  name: string;
  stroke: Point[];
};

export const db = new Dexie('FriendsDatabase') as Dexie & {
  imageObjects: EntityTable<ImageObject, 'oid'>;
};

db.version(1).stores({
  imageObjects: '++oid, name, stroke',
});
