import OpenAI from 'openai';

/**
 * Create a new OpenAI client
 */
const createClient = (config: { apiKey?: string; model?: string }) =>
  // @ts-ignore
  new OpenAI({
    apiKey:
      config.apiKey ||
      process.env.OPENAI_API_KEY ||
      process.env.PROVIDER_API_KEY,
    /** this is safe - it simply allows the user to use openAI via the browser. Credentials are not stored or shared in any way */
    dangerouslyAllowBrowser: true,
  });

/**
 * Create embeddings using openAI models
 */
const createEmbedding = async (
  client: OpenAI,
  config: Parameters<typeof client.embeddings.create>[0],
) => {
  const response = await client.embeddings.create(config);

  return response.data;
};

export default {
  createClient,
  createEmbedding,
};
