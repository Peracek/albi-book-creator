const mmToInch = 1 / 25.4;
const DPI = 1200;

export const a4Dimensions = {
  width: 297,
  heigh: 210,
};

export const a4AspectRatio = a4Dimensions.width / a4Dimensions.heigh;

export const a4Dots = {
  h: 297 * DPI * mmToInch,
  v: 210 * DPI * mmToInch,
};

// Dimensions of A4 paper in points at 1200 DPI
export const a4Points = {
  // PERO: my calculations
  // h: 14028,
  // v: 9924,

  // calculations from slepicka.png
  //13458 × 9358
  // h: 13458,
  // v: 9358,

  // online search
  h: 14031,
  v: 9921
};
