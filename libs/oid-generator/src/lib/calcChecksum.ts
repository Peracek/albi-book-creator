export const calcChecksum = (value: number): number => {
  let checksum =
    (((value >> 2) ^ (value >> 8) ^ (value >> 12) ^ (value >> 14)) & 0x01) << 1;
  checksum |= (value ^ (value >> 4) ^ (value >> 6) ^ (value >> 10)) & 0x01;
  return checksum;
};
