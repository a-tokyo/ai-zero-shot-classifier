// __tests__/providers.test.ts

import { getProvider, default as providers } from '.';
import openai from './openai';
import groq from './groq';

// Mock the openai and groq modules
jest.mock('./openai', () => jest.fn(() => 'openai function'));
jest.mock('./groq', () => jest.fn(() => 'groq function'));

describe('getProvider', () => {
  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    jest.clearAllMocks();
  });

  it('should return the openai provider when "openai" is passed', () => {
    const provider = getProvider('openai');
    expect(provider).toBe(openai);
    expect(openai).not.toHaveBeenCalled(); // Ensure it's just returning the function, not calling it
  });

  it('should return the groq provider when "groq" is passed', () => {
    const provider = getProvider('groq');
    expect(provider).toBe(groq);
    expect(groq).not.toHaveBeenCalled(); // Ensure it's just returning the function, not calling it
  });

  it('should throw an error when an invalid provider is passed', () => {
    const invalidProvider = 'invalidProvider';
    expect(() => getProvider(invalidProvider)).toThrowError(
      `Invalid provider: "${invalidProvider}"`
    );
  });

  it('should handle additional valid providers if added', () => {
    // Suppose you add another provider
    const mockNewProvider = jest.fn(() => 'new provider function');
    // Dynamically add to providers
    (providers as any)['newProvider'] = mockNewProvider;

    const provider = getProvider('newProvider');
    expect(provider).toBe(mockNewProvider);
    expect(mockNewProvider).not.toHaveBeenCalled();

    // Clean up
    delete (providers as any)['newProvider'];
  });
});

describe('default export (providers)', () => {
  it('should contain the openai and groq providers', () => {
    expect(providers).toHaveProperty('openai');
    expect(providers).toHaveProperty('groq');
    expect(providers.openai).toBe(openai);
    expect(providers.groq).toBe(groq);
  });

  it('should contain all mocked providers', () => {
    // Ensure that the default export has exactly the mocked providers
    const keys = Object.keys(providers);
    expect(keys).toContain('openai');
    expect(keys).toContain('groq');
    expect(keys.length).toBe(2); // Adjust if more providers are added
  });
});