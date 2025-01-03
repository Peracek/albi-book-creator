// import { createFFmpeg } from '@ffmpeg/ffmpeg';

// export async function convertWebmToMp3(webmFile: File): Promise<Blob> {
//   const ffmpeg = createFFmpeg({ log: false });
//   await ffmpeg.load();

//   const inputName = webmFile.name;
//   const outputName = webmFile.name.replace(/\.webm$/, '.mp3');

//   ffmpeg.FS(
//     'writeFile',
//     'input.webm',
//     await fetch(webmFile).then((res) => res.arrayBuffer())
//   );

//   await ffmpeg.run('-i', inputName, outputName);

//   const outputData = ffmpeg.FS('readFile', outputName);
//   const outputBlob = new Blob([outputData.buffer], { type: 'audio/mp3' });
//   const outputFile = new File([outputBlob], outputName, { type: 'audio/mp3' });

//   return outputFile;
// }
