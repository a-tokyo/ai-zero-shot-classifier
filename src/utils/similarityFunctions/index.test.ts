import similarityFunctions, { getSimilarityFunction } from '.';
import cosineSimilarity from './cosineSimilarity';
import dotProduct from './dotProduct';
import euclideanDistance from './euclideanDistance';

describe('similarityFunctions Module', () => {
  describe('getSimilarityFunction', () => {
    it('should return cosineSimilarity function when "cosine" is passed', () => {
      const similarity = getSimilarityFunction('cosine');
      expect(similarity).toBe(cosineSimilarity);
    });

    it('should return dotProduct function when "dot" is passed', () => {
      const similarity = getSimilarityFunction('dot');
      expect(similarity).toBe(dotProduct);
    });

    it('should return euclideanDistance function when "euclidean" is passed', () => {
      const similarity = getSimilarityFunction('euclidean');
      expect(similarity).toBe(euclideanDistance);
    });

    it('should throw an error when an invalid similarity type is passed', () => {
      // @ts-ignore: Testing runtime error for invalid input
      expect(() => getSimilarityFunction('invalid')).toThrowError(
        'Invalid similarity function: "invalid"'
      );
    });
  });

  describe('similarityFunctions mapping', () => {
    it('should contain "cosine" key mapping to cosineSimilarity function', () => {
      expect(similarityFunctions).toHaveProperty('cosine', cosineSimilarity);
    });

    it('should contain "dot" key mapping to dotProduct function', () => {
      expect(similarityFunctions).toHaveProperty('dot', dotProduct);
    });

    it('should contain "euclidean" key mapping to euclideanDistance function', () => {
      expect(similarityFunctions).toHaveProperty('euclidean', euclideanDistance);
    });

    it('should not contain keys other than "cosine", "dot", and "euclidean"', () => {
      const keys = Object.keys(similarityFunctions);
      expect(keys).toEqual(['cosine', 'dot', 'euclidean']);
    });
  });

  describe('Default export', () => {
    it('should default export similarityFunctions mapping correctly', () => {
      expect(similarityFunctions).toEqual({
        cosine: cosineSimilarity,
        dot: dotProduct,
        euclidean: euclideanDistance,
      });
    });
  });
});