import chunk from 'lodash.chunk';
import pMap from '../utils/p-map';

import { getProvider } from '../providers';
import { getSimilarityFunction } from '../utils/similarityFunctions';

interface ClassifyConfig {
  /** Similarity function to use, defaults to cosine */
  similarity?: 'cosine' | 'dot' | 'euclidean' | string;
  /** Embedding batch size for data, defaults to 50 */
  embeddingBatchSizeData?: number;
  /** Embedding batch size for labels, defaults to 50 */
  embeddingBatchSizeLabels?: number;
  /** Embedding concurrency for data, defaults to 5 */
  embeddingConcurrencyData?: number;
  /** Embedding concurrency for labels, defaults to 5 */
  embeddingConcurrencyLabels?: number;
  /** Comparing concurrency for top level, defaults to 10 */
  comparingConcurrencyTop?: number;
  /** Comparing concurrency for bottom level, defaults to 10 */
  comparingConcurrencyBottom?: number;
}

/**
 * Supported providers
 */
const SUPPORTED_PROVIDERS = ['openai', 'groq'];

/**
 * Validate provider
 *
 * @param provider
 * @throws Error if provider is not supported
 */
const _validateProvider = (provider: string) => {
  if (!SUPPORTED_PROVIDERS.includes(provider)) {
    throw new Error(
      `Unsupported provider "${provider}". Must be one of ${SUPPORTED_PROVIDERS.join(', ')}`,
    );
  }
};

/**
 * Zero-shot classifier
 */
class ZeroShotClassifier {
  /** Provider used for API */
  private provider: string;

  /** Model used for classification */
  private model: string;

  /** Provider API Key */
  private apiKey: string | undefined;

  /** Labels to classify against */
  private labels: string[];

  /** Dimensions used for embeddings */
  private dimensions: number | undefined;

  /** Labels cache */
  private labelsCache: Record<string, number[]>;

  /** Data cache */
  private dataCache: Record<string, number[]>;

  /** API client */
  private client;

  constructor(config: {
    /** Provider used for API, defaults to openAI */
    provider?: string;
    /** Model used for classification, defaults to a value based on the provider. eg: text-embedding-3-small for openAI */
    model?: string;
    /** Provider API Key */
    apiKey?: string;
    /** Labels to classify against, can be provided later via setLabels */
    labels: string[];
    /** Dimensions used for embeddings */
    dimensions?: number;
    /** Labels cache */
    labelsCache?: Record<string, number[]>;
    /** Data cache */
    dataCache?: Record<string, number[]>;
  }) {
    const {
      model = 'text-embedding-3-small',
      provider = 'openai',
      apiKey,
      labels = [],
      dimensions,
      labelsCache = {},
      dataCache = {},
    } = config;
    _validateProvider(provider);
    this.model = model;
    this.provider = provider;
    this.apiKey = apiKey;
    this.labels = labels || [];
    this.dimensions = dimensions;
    this.labelsCache = labelsCache || {};
    this.dataCache = dataCache || {};

    this._createAndSetClient({ model, provider, apiKey });
  }

  /**
   * Create and set client based on provider, model and config
   * @param config
   */
  _createAndSetClient(config): void {
    this.client = getProvider(config.provider).createClient(config);
  }

  /**
   * Set labels to classify against and clear labels cache
   * @param labels string[]
   */
  setLabels(labels: string[]): void {
    this.labels = labels;
    // Clear cache from stale entries based on updated labels
    this.labelsCache = Object.fromEntries(
      Object.entries(this.labelsCache).filter(([key]) => labels.includes(key)),
    );
  }

  /**
   * Set model and provider used for classification
   * @param model string
   * @param provider string
   */
  setProviderAndModel(
    provider: string = 'openai',
    model: string,
    apiKey?: string,
    dimensions?: number,
  ): void {
    _validateProvider(provider);

    // clear cache if provider or model changes
    if (provider !== this.provider || model !== this.model || dimensions !== this.dimensions) {
      this.clearAllCaches();
    }

    this.provider = provider;
    this.model = model;
    this.apiKey = apiKey;
    this.dimensions = dimensions;

    this._createAndSetClient({
      model: this.model,
      provider: this.provider,
      apiKey: this.apiKey,
    });
  }

  /**
   * Get embeddings in batches with concurrency
   */
  async getEmbeddings(
    texts: string[],
    batchSize: number,
    concurrency: number,
    type: 'label' | 'data' = 'data',
  ): Promise<number[][]> {
    const cache = type === 'label' ? this.labelsCache : this.dataCache;
    const uncachedTexts = texts.filter((text) => !cache[text]);
    const chunks = chunk(uncachedTexts, batchSize);

    const embeddings = await pMap(
      chunks,
      async (currChunk: string[]) => {
        const response = await (getProvider(this.provider)).createEmbedding(this.client, {
          model: this.model,
          input: currChunk,
          dimensions: this.dimensions,
        });
        currChunk.forEach((text, index) => {
          cache[text] = response[index].embedding;
        });
        return response.map((r) => r.embedding);
      },
      { concurrency },
    );

    // Return cached embeddings combined with the new ones
    return texts.map((text) => cache[text]);
  }

  /**
   * Clear cache for data embeddings
   */
  clearDataCache(): void {
    this.dataCache = {};
  }

  /**
   * Clear cache for label embeddings
   */
  clearLabelsCache(): void {
    this.labelsCache = {};
  }

  /**
   * Clear all caches
   */
  clearAllCaches(): void {
    this.clearDataCache();
    this.clearLabelsCache();
  }

  /**
   * Classify data
   *
   * @param data string[]
   * @param config object
   * @returns Object[]
   */
  async classify(
    data: string[],
    config: ClassifyConfig = {},
  ): Promise<
    {
      label: string;
      confidence: number;
    }[]
  > {
    if (!this.labels.length) {
      throw new Error('Labels must be set.');
    }

    const {
      similarity = 'cosine',
      embeddingBatchSizeData = 50, // @todo - calculate dynamically based on length
      embeddingBatchSizeLabels = 50, // @todo - calculate dynamically based on length
      embeddingConcurrencyData = 5,
      embeddingConcurrencyLabels = 5,
      comparingConcurrencyTop = 10,
      comparingConcurrencyBottom = 10,
    } = config;

    // Parallel embedding computation for labels and data
    const [labelsEmbeddings, dataEmbeddings] = await Promise.all([
      this.getEmbeddings(this.labels, embeddingBatchSizeLabels, embeddingConcurrencyLabels, 'label'),
      this.getEmbeddings(data, embeddingBatchSizeData, embeddingConcurrencyData, 'data'),
    ]);

    /** similarity getter function */
    const getSimilarity = getSimilarityFunction(similarity);

    const result: { label: string; confidence: number }[] = await pMap(
      dataEmbeddings,
      async (dataEmbedding) => {
        const similarities = await pMap(
          labelsEmbeddings,
          async (labelEmbedding): Promise<number> =>
            getSimilarity(dataEmbedding, labelEmbedding),
          { concurrency: comparingConcurrencyBottom },
        );

        // find closest label based on similarity
        const bestIndex = similarities.indexOf(
          Math[similarity === 'euclidean' ? 'min' : 'max'](...similarities),
        );

        return {
          label: this.labels[bestIndex],
          confidence: similarities[bestIndex], // Include confidence score
        };
      },
      { concurrency: comparingConcurrencyTop },
    );

    return result;
  }
}

export default ZeroShotClassifier;