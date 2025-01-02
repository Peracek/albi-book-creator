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
  h: 14028,
  v: 9924,
};
