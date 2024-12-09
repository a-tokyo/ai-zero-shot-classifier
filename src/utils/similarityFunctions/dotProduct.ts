/**
 * Computes the dot product similarity between two numerical vectors.
 *
 * @param {number[]} a - The first input vector.
 * @param {number[]} b - The second input vector.
 * @returns {number} - The dot product similarity between vectors `a` and `b`.
 * Returns 0 if both vectors are zero.
 *
 * @complexity
 * Time Complexity: O(n)
 *   - The function processes each element of the vectors `a` and `b` exactly once in a single loop.
 *
 * Space Complexity: O(1)
 *   - The function uses a constant amount of extra space regardless of the input size.
 */
export default function dotProductSimilarity(a: number[], b: number[]): number {
  let dotProduct = 0;

  // Compute the dot product
  for (let i = 0; i < a.length; i += 1) {
    dotProduct += a[i] * b[i];
  }

  // If dotProduct is zero, fallback to 0
  return dotProduct;
}
