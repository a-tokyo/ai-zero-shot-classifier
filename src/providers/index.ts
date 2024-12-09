import openai from './openai';
import groq from './groq';

/**
 * providers
 */
const providers = {
  openai,
  groq,
};

/**
 * Get provider function based on the provider type
 *
 * @param provider
 * @returns Function
 */
const getProvider = (provider: 'openai' | 'groq' | string) => {
  const fn = providers[provider];
  if (!fn) {
    throw new Error(`Invalid provider: "${provider}"`);
  }
  return fn;
};

export { getProvider };

export default providers;
