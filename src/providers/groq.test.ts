import Groq from 'groq-sdk';
import GroqProvider from './groq'; // Adjust the import path if necessary

// Mock the 'groq' module
jest.mock('groq-sdk', () => {
  return jest.fn().mockImplementation(() => ({
    embeddings: {
      create: jest.fn(),
    },
  }));
});

describe('Groq Provider', () => {
  let mockEmbeddingsCreate: jest.Mock;
  let client: any;

  beforeEach(() => {
    jest.clearAllMocks(); // Clear previous mock calls and instances

    // Set environment variables for testing
    process.env.GROQ_API_KEY = 'env-api-key';
    process.env.PROVIDER_API_KEY = '';

    // Instantiate the mock client
    client = GroqProvider.createClient({});
    mockEmbeddingsCreate = client.embeddings.create;
  });

  describe('createClient', () => {
    it('should create a new Groq client with the provided API key', () => {
      const providedApiKey = 'provided-api-key';
      const config = { apiKey: providedApiKey };

      const newClient = GroqProvider.createClient(config);

      // Ensure Groq constructor was called with the provided API key
      expect(Groq).toHaveBeenCalledWith({
        apiKey: 'provided-api-key',
      });

      // Ensure a new instance was created
      expect(newClient).not.toBe(client);

      // Ensure the returned client has the mocked embeddings.create method
      expect(newClient.embeddings.create).toBeDefined();
      expect(typeof newClient.embeddings.create).toBe('function');
    });

    it('should create a new Groq client with the GROQ_API_KEY environment variable if no API key is provided', () => {
      const config = {}; // No apiKey provided

      const newClient = GroqProvider.createClient(config);

      // Ensure Groq constructor was called with the API key from environment variables
      expect(Groq).toHaveBeenCalledWith({
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

      const newClient = GroqProvider.createClient(config);

      // Ensure Groq constructor was called with the provided API key, not the environment variable
      expect(Groq).toHaveBeenCalledWith({
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

      const result = await GroqProvider.createEmbedding(client, mockConfig);

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

      const result = await GroqProvider.createEmbedding(client, mockConfig);

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
        GroqProvider.createEmbedding(client, mockConfig)
      ).rejects.toThrow('Embedding creation failed');

      // Ensure embeddings.create was called with the correct config
      expect(mockEmbeddingsCreate).toHaveBeenCalledWith(mockConfig);
    });
  });
});