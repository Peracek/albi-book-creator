import { BnlSpec, OidsSpec } from '../typings';
import { bnl_create } from './bnlCreate';
import bnlHeader from './bnlHeader.json';

function blobToBinaryString(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    // Event triggered when the read operation is successfully completed
    reader.onload = () => {
      resolve(reader.result as string); // result will be a binary string
    };

    // Event triggered in case of an error
    reader.onerror = () => {
      reject(reader.error);
    };

    // Read the Blob as a binary string
    reader.readAsBinaryString(blob);
  });
}

export const appBnlCreate = async (
  oids: OidsSpec,
  sounds: Record<string, File>
) => {
  const soundsBinaryStringsPairs = await Promise.all(
    Object.entries(sounds).map(async ([name, mp3File]) => {
      const binaryArray = await blobToBinaryString(mp3File);
      return [name, binaryArray];
    })
  );
  const soundsBinaryStrings = Object.fromEntries(soundsBinaryStringsPairs);

  const bnlSpec: BnlSpec = [bnlHeader, {}, oids];
  const bnl = bnl_create(bnlSpec, soundsBinaryStrings);

  const byteArray = new Uint8Array(bnl);
  const blob = new Blob([byteArray], {
    type: 'application/octet-stream',
  });

  return blob;
};
