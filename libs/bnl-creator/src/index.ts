import { bnl_create } from './lib/bnlCreate';
import { BnlSpec } from './typings';

export const bnlCreate = (
  bnlSpec: BnlSpec,
  getSound: (name: string) => string
) => {
  const bnl = bnl_create(bnlSpec, getSound);

  const byteArray = new Uint8Array(bnl);
  const blob = new Blob([byteArray], {
    type: 'application/octet-stream',
  });

  return blob;
};
