import ZeroShotClassifier from '../ZeroShotClassifier';
import openAIProvider from '../providers/openai';
import { getSimilarityFunction } from '../utils/similarityFunctions';
import chunk from 'lodash.chunk';
import pMap from '../utils/p-map';

jest.mock('../providers/openai', () => ({
  createClient: jest.fn(),
  createEmbedding: jest.fn(),
}));

jest.mock('../utils/similarityFunctions', () => ({
  getSimilarityFunction: jest.fn(),
}));

jest.mock('lodash.chunk', () => jest.fn());
jest.mock('../utils/p-map', () => jest.fn());

describe('ZeroShotClassifier', () => {
  const mockClient = {};
  const mockLabels = ['Positive', 'Negative'];
  const mockData = ['data1', 'data2'];
  const mockEmbeddings = [
    { embedding: [0.1, 0.2, 0.3] }, // Mock embedding
    { embedding: [0.4, 0.5, 0.6] },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    (openAIProvider.createClient as jest.Mock).mockReturnValue(mockClient);

    (chunk as jest.Mock).mockImplementation((array: any[], size: number) => {
      const chunks: any[][] = [];
      for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
      }
      return chunks;
    });

    (pMap as jest.Mock).mockImplementation(
      async (array: any[], mapper: (item: any) => Promise<any>) =>
        Promise.all(array.map(mapper)),
    );

    (getSimilarityFunction as jest.Mock).mockImplementation(() =>
      jest.fn((a: number[], b: number[]) =>
        a.reduce((sum, value, index) => sum + value * b[index], 0),
      ),
    );
  });

  it('should initialize with dataCache and labelsCache', () => {
    const classifier = new ZeroShotClassifier({
      labels: mockLabels,
      dataCache: { data1: [0.1, 0.2, 0.3] },
      labelsCache: { Positive: [0.4, 0.5, 0.6] },
    });

    expect(classifier).toBeDefined();
    expect(classifier['dataCache']).toEqual({ data1: [0.1, 0.2, 0.3] });
    expect(classifier['labelsCache']).toEqual({ Positive: [0.4, 0.5, 0.6] });
  });

  it('should clear all caches', () => {
    const classifier = new ZeroShotClassifier({
      labels: mockLabels,
      dataCache: { data1: [0.1, 0.2, 0.3] },
      labelsCache: { Positive: [0.4, 0.5, 0.6] },
    });

    classifier.clearAllCaches();

    expect(classifier['dataCache']).toEqual({});
    expect(classifier['labelsCache']).toEqual({});
  });

  it('should fetch embeddings and use cache when possible', async () => {
    const classifier = new ZeroShotClassifier({
      labels: mockLabels,
      dataCache: { data1: [0.1, 0.2, 0.3] },
    });

    (openAIProvider.createEmbedding as jest.Mock).mockResolvedValueOnce([mockEmbeddings[1]]);

    const embeddings = await classifier.getEmbeddings(mockData, 1, 1, 'data');

    expect(chunk).toHaveBeenCalledWith(['data2'], 1); // Only fetch uncached
    expect(pMap).toHaveBeenCalled();
    expect(embeddings).toEqual([
      [0.1, 0.2, 0.3], // From cache
      [0.4, 0.5, 0.6], // From API
    ]);
  });

  it('should classify data using cached embeddings', async () => {
    const similarityMock = jest.fn((a: number[], b: number[]) => 0.9);
    (getSimilarityFunction as jest.Mock).mockReturnValue(similarityMock);
  
    const classifier = new ZeroShotClassifier({
      labels: mockLabels,
      dataCache: { data1: [0.1, 0.2, 0.3] },
      labelsCache: { Positive: [0.4, 0.5, 0.6] },
    });
  
    // Mock createEmbedding to handle uncached data
    (openAIProvider.createEmbedding as jest.Mock).mockImplementation((client, { input }) => {
      // Return embeddings for each input
      return input.map(() => ({ embedding: [0.7, 0.8, 0.9] }));
    });
  
    const results = await classifier.classify(mockData, {
      similarity: 'cosine',
      embeddingBatchSizeData: 1,
      embeddingBatchSizeLabels: 1,
    });
  
    expect(chunk).toHaveBeenCalledWith(['data2'], 1); // Only uncached data chunked
    expect(pMap).toHaveBeenCalled();
    expect(getSimilarityFunction).toHaveBeenCalledWith('cosine');
    expect(similarityMock).toHaveBeenCalledTimes(4); // 2 data points x 2 labels
    expect(results).toEqual([
      { label: 'Positive', confidence: 0.9 },
      { label: 'Positive', confidence: 0.9 },
    ]);
  });

  it('should throw an error for an unsupported provider', () => {
    expect(() => {
      new ZeroShotClassifier({ provider: 'unsupported', labels: mockLabels });
    }).toThrowError('Unsupported provider "unsupported". Must be one of openai, groq');
  });
  
  it('should set provider and model and clear caches if changed', () => {
    const classifier = new ZeroShotClassifier({
      labels: mockLabels,
      dataCache: { data1: [0.1, 0.2, 0.3] },
      labelsCache: { Positive: [0.4, 0.5, 0.6] },
    });
  
    classifier.setProviderAndModel('groq', 'new-model', 'new-key', 128);
  
    expect(classifier['provider']).toBe('groq');
    expect(classifier['model']).toBe('new-model');
    expect(classifier['apiKey']).toBe('new-key');
    expect(classifier['dimensions']).toBe(128);
  
    // Check that caches are cleared
    expect(classifier['dataCache']).toEqual({});
    expect(classifier['labelsCache']).toEqual({});
  });
  
  it('should not clear caches if the same provider and model are set', () => {
    const classifier = new ZeroShotClassifier({
      provider: 'openai',
      model: 'text-embedding-3-small',
      dimensions: 256, // Match the dimensions in setProviderAndModel
      labels: mockLabels,
      dataCache: { data1: [0.1, 0.2, 0.3] },
      labelsCache: { Positive: [0.4, 0.5, 0.6] },
    });
  
    classifier.setProviderAndModel('openai', 'text-embedding-3-small', undefined, 256);
  
    expect(classifier['dataCache']).toEqual({ data1: [0.1, 0.2, 0.3] });
    expect(classifier['labelsCache']).toEqual({ Positive: [0.4, 0.5, 0.6] });
  });
  
  it('should handle empty label or data embeddings gracefully', async () => {
    const classifier = new ZeroShotClassifier({ labels: [] });
  
    await expect(classifier.classify(['data1'], { similarity: 'dot' })).rejects.toThrowError('Labels must be set.');
  
    classifier.setLabels(mockLabels);
  
    (openAIProvider.createEmbedding as jest.Mock).mockResolvedValueOnce([]);
    const embeddings = await classifier.getEmbeddings([], 1, 1, 'data');
  
    expect(embeddings).toEqual([]);
  });
});