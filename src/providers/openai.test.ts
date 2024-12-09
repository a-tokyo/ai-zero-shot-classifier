import OpenAI from 'openai';
import openAIProvider from './openai'; // Adjust the import path if necessary

// Mock the 'openai' module
jest.mock('openai', () => {
  return jest.fn().mockImplementation(() => ({
    embeddings: {
      create: jest.fn(),
    },
  }));
});

describe('OpenAI Provider', () => {
  let mockEmbeddingsCreate: jest.Mock;
  let client: any;

  beforeEach(() => {
    jest.clearAllMocks(); // Clear previous mock calls and instances

    // Set environment variables for testing
    process.env.OPENAI_API_KEY = 'env-api-key';
    process.env.PROVIDER_API_KEY = '';

    // Instantiate the mock client
    client = openAIProvider.createClient({});
    mockEmbeddingsCreate = client.embeddings.create;
  });

  describe('createClient', () => {
    it('should create a new OpenAI client with the provided API key', () => {
      const providedApiKey = 'provided-api-key';
      const config = { apiKey: providedApiKey };

      const newClient = openAIProvider.createClient(config);

      // Ensure OpenAI constructor was called with the provided API key
      expect(OpenAI).toHaveBeenCalledWith({
        dangerouslyAllowBrowser: true,
        apiKey: 'provided-api-key',
      });

      // Ensure a new instance was created
      expect(newClient).not.toBe(client);

      // Ensure the returned client has the mocked embeddings.create method
      expect(newClient.embeddings.create).toBeDefined();
      expect(typeof newClient.embeddings.create).toBe('function');
    });

    it('should create a new OpenAI client with the OPENAI_API_KEY environment variable if no API key is provided', () => {
      const config = {}; // No apiKey provided

      const newClient = openAIProvider.createClient(config);

      // Ensure OpenAI constructor was called with the API key from environment variables
      expect(OpenAI).toHaveBeenCalledWith({
        dangerouslyAllowBrowser: true,
        apiKey: 'env-api-key',
      });

      // Ensure a new instance was created
      expect(newClient).not.toBe(client);

      // Ensure the returned client has the mocked embeddings.create method
      expect(newClient.embeddings.create).toBeDefined();
      expect(typeof newClient.embeddings.create).toBe('function');
    });

    it('should prioritize provided apiKey over environment variables', () => {
      const providedApiKey = 'provided-api-key';
      const config = { apiKey: providedApiKey };

      const newClient = openAIProvider.createClient(config);

      // Ensure OpenAI constructor was called with the provided API key, not the environment variable
      expect(OpenAI).toHaveBeenCalledWith({
        dangerouslyAllowBrowser: true,
        apiKey: 'provided-api-key',
      });

      // Ensure a new instance was created
      expect(newClient).not.toBe(client);

      // Ensure the returned client has the mocked embeddings.create method
      expect(newClient.embeddings.create).toBeDefined();
      expect(typeof newClient.embeddings.create).toBe('function');
    });
  });

  describe('createEmbedding', () => {
    it('should call embeddings.create with correct parameters and return response data', async () => {
      const mockConfig = {
        model: 'text-embedding-ada-002',
        input: ['Hello World'],
      };

      const mockResponse = {
        data: [
          {
            embedding: [0.1, 0.2, 0.3],
          },
        ],
      };

      // Mock embeddings.create to resolve with mockResponse
      mockEmbeddingsCreate.mockResolvedValueOnce(mockResponse);

      const result = await openAIProvider.createEmbedding(client, mockConfig);

      // Ensure embeddings.create was called with the correct config
      expect(mockEmbeddingsCreate).toHaveBeenCalledWith(mockConfig);

      // Ensure the result is the mockResponse.data
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle multiple inputs correctly', async () => {
      const mockConfig = {
        model: 'text-embedding-ada-002',
        input: ['Hello World', 'Test Input'],
      };

      const mockResponse = {
        data: [
          { embedding: [0.1, 0.2, 0.3] },
          { embedding: [0.4, 0.5, 0.6] },
        ],
      };

      // Mock embeddings.create to resolve with mockResponse
      mockEmbeddingsCreate.mockResolvedValueOnce(mockResponse);

      const result = await openAIProvider.createEmbedding(client, mockConfig);

      // Ensure embeddings.create was called with the correct config
      expect(mockEmbeddingsCreate).toHaveBeenCalledWith(mockConfig);

      // Ensure the result is the mockResponse.data
      expect(result).toEqual(mockResponse.data);
    });

    it('should throw an error if embeddings.create fails', async () => {
      const mockConfig = {
        model: 'text-embedding-ada-002',
        input: ['Hello World'],
      };

      const mockError = new Error('Embedding creation failed');

      // Mock embeddings.create to reject with mockError
      mockEmbeddingsCreate.mockRejectedValueOnce(mockError);

      // Expect createEmbedding to reject with the same error
      await expect(
        openAIProvider.createEmbedding(client, mockConfig)
      ).rejects.toThrow('Embedding creation failed');

      // Ensure embeddings.create was called with the correct config
      expect(mockEmbeddingsCreate).toHaveBeenCalledWith(mockConfig);
    });
  });
});