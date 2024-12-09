/**
 * Computes the cosine similarity between two numerical vectors.
 *
 * @param {number[]} a - The first input vector.
 * @param {number[]} b - The second input vector.
 * @returns {number} - The cosine similarity between vectors `a` and `b`.
 *                      Range: [-1, 1]. Returns 0 if either vector is zero.
 *
 * @complexity
 * Time Complexity: O(n)
 *   - The function processes each element of the vectors `a` and `b` exactly once in a single loop.
 *
 * Space Complexity: O(1)
 *   - The function uses a constant amount of extra space regardless of the input size.
 */
export default function cosineSimilarity(a: number[], b: number[]): number {
  // Ensure vectors are of the same length
  if (a.length !== b.length) {
    throw new Error('Vectors must be of the same length');
  }

  // Initialize variables for dot product and squared norms
  let dotProduct = 0; // Sum of element-wise products of a and b
  let normASq = 0; // Sum of squares of elements in a
  let normBSq = 0; // Sum of squares of elements in b

  // Loop through the elements of both vectors
  for (let i = 0; i < a.length; i += 1) {
    dotProduct += a[i] * b[i]; // Update dot product
    normASq += a[i] * a[i]; // Update the squared norm for vector a
    normBSq += b[i] * b[i]; // Update the squared norm for vector b
  }

  // If either vector is zero, fallback to 0
  if (normASq === 0 || normBSq === 0) {
    return 0;
  }

  // Calculate the Euclidean norms of both vectors
  const normA = Math.sqrt(normASq);
  const normB = Math.sqrt(normBSq);

  // Compute and return cosine similarity
  return dotProduct / (normA * normB);
}