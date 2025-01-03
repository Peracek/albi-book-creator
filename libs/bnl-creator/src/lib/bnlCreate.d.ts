declare function bnl_create(
  jsonOri: BnlSpec,
  getFile: (name: string) => string
): Array;

export { bnl_create };
