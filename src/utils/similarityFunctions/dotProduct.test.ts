// src/utils/dotProduct.test.ts

import dotProduct from './dotProduct';

describe('dotProduct', () => {
  it('should compute dot product correctly for identical vectors', () => {
    const vectorA = [1, 2, 3];
    const vectorB = [1, 2, 3];
    const similarity = dotProduct(vectorA, vectorB);
    expect(similarity).toBe(14); // 1*1 + 2*2 + 3*3 = 1 + 4 + 9 = 14
  });

  it('should compute dot product correctly for orthogonal vectors', () => {
    const vectorA = [1, 0, 0];
    const vectorB = [0, 1, 0];
    const similarity = dotProduct(vectorA, vectorB);
    expect(similarity).toBe(0); // 1*0 + 0*1 + 0*0 = 0
  });

  it('should compute dot product correctly for opposite vectors', () => {
    const vectorA = [1, 2, 3];
    const vectorB = [-1, -2, -3];
    const similarity = dotProduct(vectorA, vectorB);
    expect(similarity).toBe(-14); // 1*(-1) + 2*(-2) + 3*(-3) = -1 -4 -9 = -14
  });

  it('should compute dot product correctly for arbitrary vectors', () => {
    const vectorA = [1, 3, -5];
    const vectorB = [4, -2, -1];
    // Dot product: 1*4 + 3*(-2) + (-5)*(-1) = 4 -6 +5 = 3
    const similarity = dotProduct(vectorA, vectorB);
    expect(similarity).toBe(3);
  });

  it('should return 0 if one vector is all zeros', () => {
    const vectorA = [0, 0, 0];
    const vectorB = [1, 2, 3];
    const similarity = dotProduct(vectorA, vectorB);
    expect(similarity).toBe(0); // 0*1 + 0*2 + 0*3 = 0
  });

  it('should return 0 if both vectors are all zeros', () => {
    const vectorA = [0, 0, 0];
    const vectorB = [0, 0, 0];
    const similarity = dotProduct(vectorA, vectorB);
    expect(similarity).toBe(0); // 0*0 + 0*0 + 0*0 = 0
  });

  it('should handle vectors with negative numbers correctly', () => {
    const vectorA = [-1, -2, -3];
    const vectorB = [1, 2, 3];
    const similarity = dotProduct(vectorA, vectorB);
    expect(similarity).toBe(-14); // (-1)*1 + (-2)*2 + (-3)*3 = -1 -4 -9 = -14
  });

  it('should handle empty vectors by returning 0', () => {
    const vectorA: number[] = [];
    const vectorB: number[] = [];
    const similarity = dotProduct(vectorA, vectorB);
    expect(similarity).toBe(0); // No elements to process, dotProduct remains 0
  });

  it('should return 0 if one vector is empty', () => {
    const vectorA: number[] = [];
    const vectorB: number[] = [1, 2, 3];
    const similarity = dotProduct(vectorA, vectorB);
    expect(similarity).toBe(0); // No elements to process, dotProduct remains 0
  });

  it('should handle vectors of different lengths by processing up to the length of the first vector', () => {
    const vectorA = [1, 2];
    const vectorB = [1, 2, 3];
    // Dot product: 1*1 + 2*2 = 1 + 4 = 5
    const similarity = dotProduct(vectorA, vectorB);
    expect(similarity).toBe(5);
  });

  it('should correctly handle large vectors', () => {
    const size = 1000;
    const vectorA = Array.from({ length: size }, () => 1);
    const vectorB = Array.from({ length: size }, () => 1);
    const similarity = dotProduct(vectorA, vectorB);
    expect(similarity).toBe(1000); // 1*1 * 1000 times = 1000
  });

  it('should correctly handle vectors with floating point numbers', () => {
    const vectorA = [1.5, 2.5, -3.5];
    const vectorB = [4.0, -2.0, -1.0];
    // Dot product: 1.5*4 + 2.5*(-2) + (-3.5)*(-1) = 6 -5 +3.5 = 4.5
    const similarity = dotProduct(vectorA, vectorB);
    expect(similarity).toBeCloseTo(4.5, 5);
  });

  it('should handle vectors with mixed positive and negative numbers', () => {
    const vectorA = [1, -2, 3];
    const vectorB = [-4, 5, -6];
    // Dot product: 1*(-4) + (-2)*5 + 3*(-6) = -4 -10 -18 = -32
    const similarity = dotProduct(vectorA, vectorB);
    expect(similarity).toBe(-32);
  });

  it('should handle vectors with mixed positive, negative, and zero elements', () => {
    const vectorA = [0, -2, 3];
    const vectorB = [-4, 0, -6];
    // Dot product: 0*(-4) + (-2)*0 + 3*(-6) = 0 + 0 -18 = -18
    const similarity = dotProduct(vectorA, vectorB);
    expect(similarity).toBe(-18);
  });

  it('should handle vectors with single elements', () => {
    const vectorA = [3];
    const vectorB = [4];
    const similarity = dotProduct(vectorA, vectorB);
    expect(similarity).toBe(12); // 3*4 = 12
  });

  it('should handle vectors with multiple zeros interspersed', () => {
    const vectorA = [0, 2, 0, 4];
    const vectorB = [1, 0, 3, 0];
    // Dot product: 0*1 + 2*0 + 0*3 + 4*0 = 0
    const similarity = dotProduct(vectorA, vectorB);
    expect(similarity).toBe(0);
  });

  it('should handle vectors with maximum and minimum number values', () => {
    const vectorA = [Number.MAX_VALUE, -Number.MAX_VALUE];
    const vectorB = [Number.MIN_VALUE, Number.MIN_VALUE];
    const similarity = dotProduct(vectorA, vectorB);
    // Dot product: (Number.MAX_VALUE * Number.MIN_VALUE) + (-Number.MAX_VALUE * Number.MIN_VALUE) ≈ 0 - 0 = 0
    expect(similarity).toBeCloseTo(0, 10);
  });

  it('should handle vectors with very large numbers without overflow', () => {
    const vectorA = [1e308, 1e308];
    const vectorB = [1e308, 1e308];
    const similarity = dotProduct(vectorA, vectorB);
    // Dot product: 1e308*1e308 + 1e308*1e308 = Infinity + Infinity = Infinity
    expect(similarity).toBe(Infinity);
  });

  it('should handle vectors with very small numbers without underflow', () => {
    const vectorA = [1e-308, 1e-308];
    const vectorB = [1e-308, 1e-308];
    const similarity = dotProduct(vectorA, vectorB);
    // Dot product: 1e-308*1e-308 + 1e-308*1e-308 ≈ 0 + 0 = 0
    expect(similarity).toBe(0);
  });
});