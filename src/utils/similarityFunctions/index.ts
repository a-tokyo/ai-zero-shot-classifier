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
};

/**
 * Get similarity function based on the similarity type
 *
 * @param similarity
 * @returns Function
 */
const getSimilarityFunction = (similarity: 'cosine' | 'dot' | 'euclidean' | string) => {
  const fn = similarityFunctions[similarity];
  if (!fn) {
    throw new Error(`Invalid similarity function: "${similarity}"`);
  }
  return fn;
};

export { getSimilarityFunction };

export default similarityFunctions;
