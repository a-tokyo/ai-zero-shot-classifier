// src/utils/euclideanDistance.test.ts

import euclideanDistance from './euclideanDistance';

describe('euclideanDistance', () => {
  it('should compute Euclidean distance correctly for identical vectors', () => {
    const vectorA = [1, 2, 3];
    const vectorB = [1, 2, 3];
    const distance = euclideanDistance(vectorA, vectorB);
    expect(distance).toBe(0);
  });

  it('should compute Euclidean distance correctly for orthogonal vectors', () => {
    const vectorA = [1, 0, 0];
    const vectorB = [0, 1, 0];
    const distance = euclideanDistance(vectorA, vectorB);
    expect(distance).toBeCloseTo(Math.sqrt(2), 5); // sqrt((1-0)^2 + (0-1)^2 + (0-0)^2) = sqrt(2)
  });

  it('should compute Euclidean distance correctly for opposite vectors', () => {
    const vectorA = [1, 2, 3];
    const vectorB = [-1, -2, -3];
    const distance = euclideanDistance(vectorA, vectorB);
    // sqrt((1 - (-1))^2 + (2 - (-2))^2 + (3 - (-3))^2) = sqrt(4 + 16 + 36) = sqrt(56) ≈ 7.4833
    expect(distance).toBeCloseTo(Math.sqrt(56), 5);
  });

  it('should compute Euclidean distance correctly for arbitrary vectors', () => {
    const vectorA = [1, 3, -5];
    const vectorB = [4, -2, -1];
    // sqrt((1-4)^2 + (3-(-2))^2 + (-5-(-1))^2) = sqrt(9 + 25 + 16) = sqrt(50) ≈ 7.0711
    const distance = euclideanDistance(vectorA, vectorB);
    expect(distance).toBeCloseTo(Math.sqrt(50), 4);
  });

  it('should return 0 if both vectors are zero vectors', () => {
    const vectorA = [0, 0, 0];
    const vectorB = [0, 0, 0];
    const distance = euclideanDistance(vectorA, vectorB);
    expect(distance).toBe(0);
  });

  it('should handle vectors with negative numbers correctly', () => {
    const vectorA = [-1, -2, -3];
    const vectorB = [4, 5, 6];
    // sqrt((-1-4)^2 + (-2-5)^2 + (-3-6)^2) = sqrt(25 + 49 + 81) = sqrt(155) ≈ 12.4499
    const distance = euclideanDistance(vectorA, vectorB);
    expect(distance).toBeCloseTo(Math.sqrt(155), 4);
  });

  it('should throw an error if vectors are of different lengths', () => {
    const vectorA = [1, 2];
    const vectorB = [1, 2, 3];
    expect(() => euclideanDistance(vectorA, vectorB)).toThrow(
      'Vectors must be of the same length'
    );
  });

  it('should handle large vectors correctly', () => {
    const size = 1000;
    const vectorA = Array.from({ length: size }, () => 1);
    const vectorB = Array.from({ length: size }, () => 1);
    const distance = euclideanDistance(vectorA, vectorB);
    expect(distance).toBe(0);
  });

  it('should correctly handle vectors with floating point numbers', () => {
    const vectorA = [1.5, 2.5, -3.5];
    const vectorB = [4.0, -2.0, -1.0];
    // sqrt((1.5-4)^2 + (2.5-(-2))^2 + (-3.5-(-1))^2)
    // = sqrt(6.25 + 20.25 + 6.25) = sqrt(32.75) ≈ 5.7185
    const distance = euclideanDistance(vectorA, vectorB);
    expect(distance).toBeCloseTo(Math.sqrt(32.75), 4);
  });

  it('should handle vectors with mixed positive and negative numbers', () => {
    const vectorA = [1, -2, 3];
    const vectorB = [-4, 5, -6];
    // sqrt((1 - (-4))^2 + (-2 - 5)^2 + (3 - (-6))^2)
    // = sqrt(25 + 49 + 81) = sqrt(155) ≈ 12.4499
    const distance = euclideanDistance(vectorA, vectorB);
    expect(distance).toBeCloseTo(Math.sqrt(155), 4);
  });

  it('should handle empty vectors by returning 0', () => {
    const vectorA: number[] = [];
    const vectorB: number[] = [];
    const distance = euclideanDistance(vectorA, vectorB);
    expect(distance).toBe(0);
  });

  it('should throw an error if one vector is empty and the other is not', () => {
    const vectorA: number[] = [];
    const vectorB: number[] = [1, 2, 3];
    expect(() => euclideanDistance(vectorA, vectorB)).toThrow(
      'Vectors must be of the same length'
    );
  });
});