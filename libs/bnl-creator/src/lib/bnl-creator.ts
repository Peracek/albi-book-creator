import { BnlYamlFile } from '../typings';
import * as fs from 'fs';

const getRandomArray = (length: number): number[] => {
  return Array.from({ length }, () => Math.floor(Math.random() * 256));
};

const keygen = (preKey: number[], pk: number): number[] => {
  const keygenTbl = [
    [0, 1, 1, 2, 0, 1, 1, 2],
    [3, 3, 2, 1, 1, 2, 2, 1],
    [2, 2, 3, 1, 2, 2, 3, 1],
    [1, 0, 0, 0, 1, 0, 0, 0],
    [1, 2, 0, 1, 1, 2, 0, 1],
    [1, 2, 0, 2, 1, 2, 2, 2],
    [2, 1, 0, 0, 2, 1, 0, 0],
    [2, 3, 2, 2, 2, 3, 2, 2],
    [3, 0, 3, 1, 3, 0, 3, 1],
    [0, 0, 1, 1, 0, 3, 1, 1],
    [2, 2, 3, 0, 2, 2, 3, 1],
    [3, 1, 0, 0, 3, 1, 0, 0],
    [3, 3, 0, 2, 3, 3, 1, 2],
    [1, 2, 0, 0, 1, 2, 0, 0],
    [2, 1, 0, 3, 2, 1, 3, 3],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ];

  const key = new Array(512).fill(0);

  for (let pkPtr = 0; pkPtr < preKey.length; pkPtr++) {
    for (let block = 0; block < 8; block++) {
      key[block * 16 * 4 + pkPtr * 4 + keygenTbl[pkPtr][block]] =
        (preKey[pkPtr] + pk) & 0xff;
    }
  }
  return key;
};

export const bnlCreator = (bnlYaml: BnlYamlFile, outputFilePath: string) => {
  const [header, quiz, oids] = bnlYaml;

  //   globals for user
  const encryption = 1;

  const blockHeader = Buffer.alloc(0x200, 0xff);
  let headerKey: number;
  let prekey: number[];
  let realKey: number[];
  let prekeyDw: number;

  if (header.encryption) {
    console.log('Encryption: from input file');
    headerKey = header.encryption.header_key;
    prekeyDw = header.encryption.prekey_dw;
    prekey = header.encryption.prekey;
  } else {
    if (encryption === 1) {
      console.log('Encryption: generated strong');
      headerKey = getRandomArray(4).reduce((acc, val) => (acc << 8) | val, 0);
      prekeyDw = getRandomArray(4).reduce((acc, val) => (acc << 8) | val, 0);
      prekeyDw = (prekeyDw & 0xffffff00) | ((0xf5 - (headerKey >> 24)) & 0xff);
      prekey = getRandomArray(16);
    } else {
      console.log('Encryption: generated weak');
      headerKey = 0x00000100;
      prekeyDw = 0xf5;
      prekey = new Array(16).fill(0);
    }
  }

  if (prekey.length !== 16) throw new Error('Incorrect encryption key length');
  if ((((headerKey >> 24) + (prekeyDw & 0xff)) & 0xff) !== 0xf5)
    throw new Error('Incorrect encryption check');

  blockHeader.writeUInt32LE(headerKey, 0);
  blockHeader.writeUInt32LE(0x200 ^ headerKey, 4);
  blockHeader.writeUInt32LE(prekeyDw, 0x140);
  blockHeader.set(Buffer.from(prekey), 0x144);
  //   realKey = keygen(prekey, (headerKey >> 24) & 0xff);

  // Write the binary file
  fs.writeFileSync(outputFilePath, blockHeader);
  console.log(
    `Created ${outputFilePath}, ${fs.statSync(outputFilePath).size} bytes long.`
  );
};
