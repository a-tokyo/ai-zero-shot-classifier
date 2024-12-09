import Groq from 'groq-sdk';

/**
 * Create a new Groq client
 */
const createClient = (config) =>
  new Groq({
    apiKey:
      config.apiKey || process.env.GROQ_API_KEY || process.env.PROVIDER_API_KEY,
  });

/**
 * Create embeddings using groq models
 */
const createEmbedding = async (
  client,
  config: Parameters<typeof client.embeddings.create>[0],
) => {
  const response = await client.embeddings.create(config);

  return response.data;
};

export default {
  createClient,
  createEmbedding,
};
