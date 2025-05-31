import cosineSimilarity from './cosineSimilarity';
import dotProduct from './dotProduct';
import euclideanDistance from './euclideanDistance';

/**
 * Similarity function mapping
 */
const similarityFunctions = {
  cosine: cosineSimilarity,
  dot: dotProduct,
  euclidean: euclideanDistance,
} as const;

type SimilarityType = keyof typeof similarityFunctions;

/**
 * Get similarity function based on the similarity type
 *
 * @param similarity
 * @returns Function
 */
const getSimilarityFunction = (similarity: SimilarityType | string) => {
  const fn = similarityFunctions[similarity as SimilarityType];
  if (!fn) {
    throw new Error(`Invalid similarity function: "${similarity}"`);
  }
  return fn;
};

export { getSimilarityFunction };

export default similarityFunctions;
