// @todo
// import groq from 'groq-sdk';

/**
 * Create a new Groq client
 */
const createClient = () => {};

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
