import openai from './openai';
import groq from './groq';

/**
 * providers
 */
const providers = {
  openai,
  groq,
} as const;

type ProviderName = keyof typeof providers;

/**
 * Get provider function based on the provider type
 *
 * @param provider
 * @returns Function
 */
const getProvider = (provider: ProviderName | string) => {
  const fn = providers[provider as ProviderName];
  if (!fn) {
    throw new Error(`Invalid provider: "${provider}"`);
  }
  return fn;
};

export { getProvider };

export default providers;
