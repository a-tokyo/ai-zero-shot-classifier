/**
 * Computes the Euclidean distance between two numerical vectors.
 *
 * @param {number[]} a - The first input vector.
 * @param {number[]} b - The second input vector.
 * @returns {number} - The Euclidean distance between vectors `a` and `b`.
 *                      Returns 0 if both vectors are zero or identical.
 *
 * @complexity
 * Time Complexity: O(n)
 *   - The function processes each element of the vectors `a` and `b` exactly once in a single loop.
 *
 * Space Complexity: O(1)
 *   - The function uses a constant amount of extra space regardless of the input size.
 */
export default function euclideanDistance(a: number[], b: number[]): number {
  // Ensure vectors are of the same length
  if (a.length !== b.length) {
    throw new Error('Vectors must be of the same length');
  }

  let sumSquaredDifferences = 0;

  // Compute the sum of squared differences
  for (let i = 0; i < a.length; i += 1) {
    const difference = a[i] - b[i];
    sumSquaredDifferences += difference * difference;
  }

  // Return the square root of the sum of squared differences
  return Math.sqrt(sumSquaredDifferences);
}
