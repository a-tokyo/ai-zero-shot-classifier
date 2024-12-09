import { classify, ZeroShotClassifier } from '.';

describe('index', () => {
  it('exports all modules', () => {
    expect(classify).toEqual(expect.any(Function));
    expect(ZeroShotClassifier).toEqual(expect.any(Function));
  });
});
