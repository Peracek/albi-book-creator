import { oidGenerator } from './oid-generator';

describe('oidGenerator', () => {
  it('should work', () => {
    expect(oidGenerator()).toEqual('oid-generator');
  });
});
