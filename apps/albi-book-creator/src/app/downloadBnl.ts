import { appBnlCreate, OidsSpec } from '@abc/bnl-creator';
import { fromPairs } from 'lodash';
import { saveAs } from 'file-saver';
import { ImageObject } from '@abc/storage';

export const downloadBnl = async (areas: ImageObject[]) => {
  const defaultSoundFileNames = [
    'kniha_vitej1.mp3',
    'kniha_vitej2.mp3',
    'mod_vice_inf.mp3',
    'mod_zakladni.mp3',
  ];

  const defaultSoundsPairs = await Promise.all(
    defaultSoundFileNames.map(async (fileName) => {
      const response = await fetch(`default-mp3/${fileName}`);
      return [fileName, await response.blob()];
    })
  );
  // FIXME: Object.fromEntries produceses any
  const defaultSounds = fromPairs(defaultSoundsPairs);

  const oidsSpec: OidsSpec = Object.fromEntries(
    areas.map((area) => [
      `oid_${area.oid}`,
      { mode_0: [area.sound?.name ?? ''], mode_1: [area.sound?.name ?? ''] },
    ])
  );

  const sounds = fromPairs(
    areas
      .map((area) => (area.sound ? [area.sound.name, area.sound] : undefined))
      .filter((x) => x !== undefined)
  );

  const bnlBlob = await appBnlCreate(oidsSpec, {
    ...sounds,
    ...defaultSounds,
  });
  saveAs(bnlBlob, 'test.bnl');
};
