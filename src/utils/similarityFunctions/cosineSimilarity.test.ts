// src/utils/cosineSimilarity.test.ts

import cosineSimilarity from './cosineSimilarity';

describe('cosineSimilarity', () => {
  it('should compute cosine similarity correctly for identical vectors', () => {
    const vectorA = [1, 2, 3];
    const vectorB = [1, 2, 3];
    const similarity = cosineSimilarity(vectorA, vectorB);
    expect(similarity).toBeCloseTo(1);
  });

  it('should compute cosine similarity correctly for orthogonal vectors', () => {
    const vectorA = [1, 0, 0];
    const vectorB = [0, 1, 0];
    const similarity = cosineSimilarity(vectorA, vectorB);
    expect(similarity).toBeCloseTo(0);
  });

  it('should compute cosine similarity correctly for opposite vectors', () => {
    const vectorA = [1, 2, 3];
    const vectorB = [-1, -2, -3];
    const similarity = cosineSimilarity(vectorA, vectorB);
    expect(similarity).toBeCloseTo(-1);
  });

  it('should compute cosine similarity correctly for arbitrary vectors', () => {
    const vectorA = [1, 3, -5];
    const vectorB = [4, -2, -1];
    // Cosine similarity: (1*4 + 3*(-2) + (-5)*(-1)) / (sqrt(1^2+3^2+5^2) * sqrt(4^2+2^2+1^2))
    // = (4 -6 +5) / (sqrt(35) * sqrt(21)) = 3 / sqrt(735) ≈ 0.111
    const similarity = cosineSimilarity(vectorA, vectorB);
    expect(similarity).toBeCloseTo(0.111, 3);
  });

  it('should return 0 if one vector is all zeros', () => {
    const vectorA = [0, 0, 0];
    const vectorB = [1, 2, 3];
    const similarity = cosineSimilarity(vectorA, vectorB);
    expect(similarity).toBe(0);
  });

  it('should return 0 if both vectors are all zeros', () => {
    const vectorA = [0, 0, 0];
    const vectorB = [0, 0, 0];
    const similarity = cosineSimilarity(vectorA, vectorB);
    expect(similarity).toBe(0);
  });

  it('should handle vectors with negative numbers correctly', () => {
    const vectorA = [-1, -2, -3];
    const vectorB = [1, 2, 3];
    const similarity = cosineSimilarity(vectorA, vectorB);
    expect(similarity).toBeCloseTo(-1);
  });

  it('should handle empty vectors by returning 0', () => {
    const vectorA: number[] = [];
    const vectorB: number[] = [];
    const similarity = cosineSimilarity(vectorA, vectorB);
    expect(similarity).toBe(0);
  });

  it('should throw an error if vectors are of different lengths', () => {
    const vectorA = [1, 2];
    const vectorB = [1, 2, 3];
    expect(() => cosineSimilarity(vectorA, vectorB)).toThrowError(
      'Vectors must be of the same length'
    );
  });

  it('should handle vectors of different lengths by throwing an error', () => {
    const vectorA = [1, 2];
    const vectorB = [1, 2, 3];
    expect(() => cosineSimilarity(vectorA, vectorB)).toThrow(
      'Vectors must be of the same length'
    );
  });

  it('should handle vectors of different lengths by processing up to the length of the first vector', () => {
    const vectorA = [1, 2];
    const vectorB = [1, 2, 3];
    // With the updated function, this should throw an error
    expect(() => cosineSimilarity(vectorA, vectorB)).toThrow(
      'Vectors must be of the same length'
    );
  });

  it('should correctly handle large vectors', () => {
    const size = 1000;
    const vectorA = Array.from({ length: size }, () => 1);
    const vectorB = Array.from({ length: size }, () => 1);
    const similarity = cosineSimilarity(vectorA, vectorB);
    expect(similarity).toBeCloseTo(1);
  });

  it('should correctly handle vectors with floating point numbers', () => {
    const vectorA = [1.5, 2.5, -3.5];
    const vectorB = [4.0, -2.0, -1.0];
    // Compute manually:
    // dotProduct = 1.5*4 + 2.5*(-2) + (-3.5)*(-1) = 6 -5 +3.5 = 4.5
    // normASq = 1.5^2 + 2.5^2 + 3.5^2 = 2.25 + 6.25 + 12.25 = 20.75, normA = sqrt(20.75) ≈ 4.5552
    // normBSq = 4^2 + (-2)^2 + (-1)^2 = 16 + 4 + 1 = 21, normB = sqrt(21) ≈ 4.5837
    // similarity = 4.5 / (4.5552 * 4.5837) ≈ 4.5 / 20.8 ≈ 0.216
    const similarity = cosineSimilarity(vectorA, vectorB);
    expect(similarity).toBeCloseTo(0.216, 3);
  });

  it('should handle vectors with mixed positive and negative numbers', () => {
    const vectorA = [1, -2, 3];
    const vectorB = [-4, 5, -6];
    // dotProduct = 1*(-4) + (-2)*5 + 3*(-6) = -4 -10 -18 = -32
    // normASq = 1 + 4 + 9 = 14, normBSq = 16 + 25 + 36 = 77
    // similarity = -32 / (sqrt(14) * sqrt(77)) = -32 / (3.7417 * 8.77496) ≈ -32 / 32.8329 ≈ -0.9746
    const similarity = cosineSimilarity(vectorA, vectorB);
    expect(similarity).toBeCloseTo(-0.9746, 4);
  });
});