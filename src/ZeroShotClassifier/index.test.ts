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
  const mockEmbeddingsData = [
    { embedding: [0.1, 0.2, 0.3] }, // data1
    { embedding: [0.4, 0.5, 0.6] }, // data2
  ];
  const mockEmbeddingsLabels = [
    { embedding: [0.1, 0.2, 0.3] }, // Positive
    { embedding: [0.4, 0.5, 0.6] }, // Negative
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock OpenAI provider
    (openAIProvider.createClient as jest.Mock).mockReturnValue(mockClient);

    // Mock chunk function
    (chunk as jest.Mock).mockImplementation((array: any[], size: number) => {
      const chunks: any[][] = [];
      for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
      }
      return chunks;
    });

    // Mock pMap function
    (pMap as jest.Mock).mockImplementation(
      async (array: any[], mapper: (item: any) => Promise<any>) =>
        Promise.all(array.map(mapper))
    );

    // Mock similarity function
    (getSimilarityFunction as jest.Mock).mockImplementation(() =>
      jest.fn((a: number[], b: number[]) =>
        a.reduce((sum, value, index) => sum + value * b[index], 0)
      )
    );
  });

  it('should initialize with default values', () => {
    const classifier = new ZeroShotClassifier({ labels: mockLabels });

    expect(classifier).toBeDefined();
    expect(openAIProvider.createClient).toHaveBeenCalledWith({
      model: 'text-embedding-3-small',
      provider: 'openai',
      apiKey: undefined,
    });
  });

  it('should validate unsupported provider', () => {
    expect(() => {
      new ZeroShotClassifier({ provider: 'unsupported', labels: mockLabels });
    }).toThrowError('Unsupported provider "unsupported". Must be one of openai');
  });

  it('should set and cache labels', () => {
    const classifier = new ZeroShotClassifier({ labels: [] });

    classifier.setLabels(mockLabels);

    expect(classifier['labels']).toEqual(mockLabels);
    expect(classifier['labelsCache']).toEqual({});
  });

  it('should fetch embeddings in batches', async () => {
    const classifier = new ZeroShotClassifier({ labels: mockLabels });

    // Setup mockResolvedValueOnce for each createEmbedding call
    (openAIProvider.createEmbedding as jest.Mock)
      .mockResolvedValueOnce([mockEmbeddingsData[0]]) // createEmbedding(['data1'])
      .mockResolvedValueOnce([mockEmbeddingsData[1]]); // createEmbedding(['data2'])

    const embeddings = await classifier.getEmbeddings(['data1', 'data2'], 1, 1, 'data');

    expect(chunk).toHaveBeenCalledWith(['data1', 'data2'], 1);
    expect(pMap).toHaveBeenCalled();

    expect(embeddings).toEqual([
      [0.1, 0.2, 0.3],
      [0.4, 0.5, 0.6],
    ]);

    // Ensure createEmbedding was called twice
    expect(openAIProvider.createEmbedding).toHaveBeenCalledTimes(2);
  });

  it('should classify data', async () => {
    const similarityMock = jest.fn((a: number[], b: number[]) => 0.9);
    (getSimilarityFunction as jest.Mock).mockReturnValue(similarityMock);

    const classifier = new ZeroShotClassifier({ labels: mockLabels });

    // Mock createEmbedding for labels and data
    (openAIProvider.createEmbedding as jest.Mock)
      .mockResolvedValueOnce([mockEmbeddingsLabels[0]]) // createEmbedding(['Positive'])
      .mockResolvedValueOnce([mockEmbeddingsLabels[1]]) // createEmbedding(['Negative'])
      .mockResolvedValueOnce([mockEmbeddingsData[0]]) // createEmbedding(['data1'])
      .mockResolvedValueOnce([mockEmbeddingsData[1]]); // createEmbedding(['data2'])

    const results = await classifier.classify(['data1', 'data2'], {
      similarity: 'cosine',
      embeddingBatchSizeData: 1,
      embeddingBatchSizeLabels: 1,
    });

    expect(getSimilarityFunction).toHaveBeenCalledWith('cosine');
    expect(similarityMock).toHaveBeenCalledTimes(4); // 2 data points x 2 labels
    expect(results).toEqual([
      { label: 'Positive', confidence: 0.9 },
      { label: 'Positive', confidence: 0.9 },
    ]);

    // Ensure createEmbedding was called four times
    expect(openAIProvider.createEmbedding).toHaveBeenCalledTimes(4);
  });

  it('should throw an error when no labels are set', async () => {
    const classifier = new ZeroShotClassifier({ labels: [] });

    await expect(classifier.classify(['data1', 'data2'])).rejects.toThrow(
      'Labels must be set.',
    );
  });

  it('should handle embedding cache for labels', async () => {
    const classifier = new ZeroShotClassifier({ labels: mockLabels });

    // Mock createEmbedding for labels
    (openAIProvider.createEmbedding as jest.Mock)
      .mockResolvedValueOnce([mockEmbeddingsLabels[0]]) // createEmbedding(['Positive'])
      .mockResolvedValueOnce([mockEmbeddingsLabels[1]]); // createEmbedding(['Negative'])

    await classifier.getEmbeddings(mockLabels, 1, 1, 'label');

    expect(classifier['labelsCache']['Positive']).toEqual([0.1, 0.2, 0.3]);
    expect(classifier['labelsCache']['Negative']).toEqual([0.4, 0.5, 0.6]);

    // Ensure createEmbedding was called twice
    expect(openAIProvider.createEmbedding).toHaveBeenCalledTimes(2);
  });
});