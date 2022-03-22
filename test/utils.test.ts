import { parsePath } from '../src/utils';

describe('utils', () => {
  describe('parsePath', () => {
    test('dot annotation', () => {
      expect(parsePath('a.b.c')).toEqual(['a', 'b', 'c']);
    });
    test('array [] annotation', () => {
      expect(parsePath('a[1].b[0].c')).toEqual(['a', '1', 'b', '0', 'c']);
    });
  });
});
