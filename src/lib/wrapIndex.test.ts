import wrapIndex from './wrapIndex';

describe('wrapIndex', () => {
  it('moves forward and back inside the list', () => {
    expect(wrapIndex(2, 1, 5)).toBe(3);
    expect(wrapIndex(2, -1, 5)).toBe(1);
  });

  it('wraps from the last item to the first, and from the first to the last', () => {
    expect(wrapIndex(4, 1, 5)).toBe(0);
    expect(wrapIndex(0, -1, 5)).toBe(4);
  });

  it('stays on the only item of a one-item list', () => {
    expect(wrapIndex(0, 1, 1)).toBe(0);
    expect(wrapIndex(0, -1, 1)).toBe(0);
  });

  it('copes with a step larger than the list', () => {
    expect(wrapIndex(1, 7, 5)).toBe(3);
    expect(wrapIndex(1, -7, 5)).toBe(4);
  });

  it('returns 0 for an empty list instead of NaN', () => {
    expect(wrapIndex(0, 1, 0)).toBe(0);
  });
});
