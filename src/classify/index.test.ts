import classify from '.';
import ZeroShotClassifier from '../ZeroShotClassifier';

jest.mock('../ZeroShotClassifier');

describe('classify', () => {
  const mockClassify = jest.fn();
  const mockSetLabels = jest.fn();

  beforeEach(() => {
    (ZeroShotClassifier as jest.Mock).mockImplementation(() => ({
      classify: mockClassify,
      setLabels: mockSetLabels,
    }));
    jest.clearAllMocks();
  });

  it('creates a new ZeroShotClassifier with the correct configuration', async () => {
    const input = {
      labels: ['Positive', 'Negative'],
      data: ['I love this product!', 'This is bad.'],
      config: {
        similarity: 'cosine' as 'cosine',
      },
      model: 'text-embedding-3-small',
      provider: 'openai',
    };

    mockClassify.mockResolvedValue([
      { label: 'Positive', confidence: 0.9 },
      { label: 'Negative', confidence: 0.8 },
    ]);

    const result = await classify(input);

    expect(ZeroShotClassifier).toHaveBeenCalledWith({
      model: 'text-embedding-3-small',
      provider: 'openai',
      labels: ['Positive', 'Negative'],
    });
    expect(mockClassify).toHaveBeenCalledWith(['I love this product!', 'This is bad.'], {
      similarity: 'cosine',
    });
    expect(result).toEqual([
      { label: 'Positive', confidence: 0.9 },
      { label: 'Negative', confidence: 0.8 },
    ]);
  });

  it('handles classification with default configuration', async () => {
    const input = {
      labels: ['Positive', 'Negative'],
      data: ['This is amazing!', 'Awful experience.'],
    };

    mockClassify.mockResolvedValue([
      { label: 'Positive', confidence: 0.95 },
      { label: 'Negative', confidence: 0.99 },
    ]);

    const result = await classify(input);

    expect(ZeroShotClassifier).toHaveBeenCalledWith({
      labels: ['Positive', 'Negative'],
    });
    expect(mockClassify).toHaveBeenCalledWith(['This is amazing!', 'Awful experience.'], undefined);
    expect(result).toEqual([
      { label: 'Positive', confidence: 0.95 },
      { label: 'Negative', confidence: 0.99 },
    ]);
  });

  it('throws an error if classification fails', async () => {
    const input = {
      labels: ['Positive', 'Negative'],
      data: ['Error test case.'],
    };

    mockClassify.mockRejectedValue(new Error('Classification failed'));

    await expect(classify(input)).rejects.toThrow('Classification failed');
  });

  it('passes additional configuration parameters to ZeroShotClassifier', async () => {
    const input = {
      labels: ['Spam', 'Ham'],
      data: ['Buy now!', 'How are you?'],
      model: 'text-embedding-2',
      provider: 'mock-provider',
      apiKey: 'mock-api-key',
      config: {
        similarity: 'dot' as 'dot',
      },
    };

    mockClassify.mockResolvedValue([
      { label: 'Spam', confidence: 0.85 },
      { label: 'Ham', confidence: 0.92 },
    ]);

    const result = await classify(input);

    expect(ZeroShotClassifier).toHaveBeenCalledWith({
      labels: ['Spam', 'Ham'],
      model: 'text-embedding-2',
      provider: 'mock-provider',
      apiKey: 'mock-api-key',
    });
    expect(mockClassify).toHaveBeenCalledWith(['Buy now!', 'How are you?'], {
      similarity: 'dot',
    });
    expect(result).toEqual([
      { label: 'Spam', confidence: 0.85 },
      { label: 'Ham', confidence: 0.92 },
    ]);
  });

  it('returns an empty array if no data is provided', async () => {
    const input = {
      labels: ['Label1', 'Label2'],
      data: [],
    };

    mockClassify.mockResolvedValue([]);

    const result = await classify(input);

    expect(ZeroShotClassifier).toHaveBeenCalledWith({
      labels: ['Label1', 'Label2'],
    });
    expect(mockClassify).toHaveBeenCalledWith([], undefined);
    expect(result).toEqual([]);
  });
});