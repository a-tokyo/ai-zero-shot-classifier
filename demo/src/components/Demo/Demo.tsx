'use client';

import React, { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

import './Demo.css';
import classify from '../../../../src/classify';
import GoogleAd from '../GoogleAd/GoogleAd';

interface ClassificationResult {
  text: string;
  label: string;
  confidence: number;
}

function Demo() {
  // Configuration states
  const [apiKey, setApiKey] = useState('');
  const [provider, setProvider] = useState<'openai' | 'groq'>('openai');
  const [model, setModel] = useState('text-embedding-3-small');
  const [labelsInput, setLabelsInput] = useState('Technology, Health, Finance');
  const [delimiter, setDelimiter] = useState(','); // New state for delimiter
  const [similarity, setSimilarity] = useState('cosine');
  const [dimensions, setDimensions] = useState<number | ''>(''); // New state for dimensions

  // Data input state
  const [dataInput, setDataInput] = useState(
    `Artificial Intelligence is transforming industries.
The stock market has seen unprecedented growth.
Healthcare advancements are improving lives.`
  );

  // Classification result state
  const [results, setResults] = useState<ClassificationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Code snippet state
  const [codeString, setCodeString] = useState('');

  // Update the code snippet based on current configuration and input
  useEffect(() => {
    const labelsArray = labelsInput
      .split(delimiter) // Use the selected delimiter
      .map((label) => label.trim())
      .filter((label) => label.length > 0);

    const dataArray = dataInput
      .split('\n')
      .map((data) => data.trim())
      .filter((data) => data.length > 0);

    setCodeString(`import { classify } from 'ai-zero-shot-classifier';

/** Your Provider API Key */
const apiKey = '${apiKey}';

/** Labels for classification */
const labels = [${labelsArray.map((label) => `"${label}"`).join(', ')}];

/** Data to classify */
const data = [
  ${dataArray.map((data) => `"${data}"`).join(',\n  ')}
];

/** Configuration (optional) */
const config = {
  similarity: '${similarity}',
  ${dimensions ? `dimensions: ${dimensions},` : ''}
};

/** Perform classification */
classify({
  provider: '${provider}',
  model: '${model}',
  labels,
  data,
  config,
  apiKey,
  ${dimensions ? `dimensions: ${dimensions},` : ''}
})
  .then((results) => {
    console.log(results);
  })
  .catch((error) => {
    console.error(error);
  });
`);
  }, [apiKey, provider, model, labelsInput, dataInput, similarity, delimiter, dimensions]);

  // Handle classification
  const handleClassify = async () => {
    setLoading(true);
    setError('');
    setResults([]);

    const labels = labelsInput
      .split(delimiter) // Use the selected delimiter
      .map((label) => label.trim())
      .filter((label) => label.length > 0);

    const data = dataInput
      .split('\n')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    if (labels.length === 0) {
      setError('Please provide at least one label.');
      setLoading(false);
      return;
    }

    if (data.length === 0) {
      setError('Please provide at least one data item to classify.');
      setLoading(false);
      return;
    }

    if (!apiKey) {
      setError('Please provide your Provider API Key.');
      setLoading(false);
      return;
    }

    try {
      const classificationResults = await classify({
        labels,
        data,
        provider,
        model,
        config: { similarity },
        apiKey,
        dimensions: dimensions || undefined, // Pass dimensions if provided
      });

      const combinedResults = data.map((text, index) => ({
        text,
        label: classificationResults[index]?.label || 'N/A',
        confidence: classificationResults[index]?.confidence || 0,
      }));

      setResults(combinedResults);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during classification.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <article className="wrapper">
      <header>
        <h1>AI Zero-Shot Classifier Demo</h1>
        <p>Classify text data against predefined labels using AI-powered embeddings.</p>
      </header>
      <div className="desktop-layout">
        {/* Left Ad - Desktop Only */}
        <aside className="left-ad desktop-only">
          <GoogleAd slot="9990971823" variant="side" />
        </aside>
        
        {/* Main Content */}
        <div className="container main-content">
          <section className="config-section">
            <h2>Configuration</h2>
            <div className="config-group">
              <label htmlFor="apiKey">Provider API Key:</label>
              <input
                type="password"
                id="apiKey"
                placeholder="Enter your Provider API Key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>
            <div className="config-group">
              <label htmlFor="provider">Provider:</label>
              <select
                id="provider"
                value={provider}
                onChange={(e) => setProvider(e.target.value as 'openai' | 'groq')}>
                <option value="openai">OpenAI</option>
                <option value="groq">Groq</option>
              </select>
            </div>
            <div className="config-group">
              <label htmlFor="model">Model:</label>
              <input
                type="text"
                id="model"
                placeholder="e.g., text-embedding-3-small or text-embedding-ada-002"
                value={model}
                onChange={(e) => setModel(e.target.value)}
              />
            </div>
            <div className="config-group">
              <label htmlFor="labels">Labels:</label>
              <input
                type="text"
                id="labels"
                placeholder="e.g., Technology, Health, Finance"
                value={labelsInput}
                onChange={(e) => setLabelsInput(e.target.value)}
              />
            </div>
            <div className="config-group">
              <label htmlFor="delimiter">Labels Delimiter:</label>
              <input
                type="text"
                id="delimiter"
                placeholder="e.g., , or ;"
                value={delimiter}
                onChange={(e) => setDelimiter(e.target.value)}
              />
            </div>
            <div className="config-group">
              <label htmlFor="similarity">Similarity Function:</label>
              <select
                id="similarity"
                value={similarity}
                onChange={(e) => setSimilarity(e.target.value)}>
                <option value="cosine">Cosine Similarity</option>
                <option value="dot">Dot Product</option>
                <option value="euclidean">Euclidean Distance</option>
              </select>
            </div>
            <div className="config-group">
              <label htmlFor="dimensions">Dimensions (optional):</label>
              <input
                type="number"
                id="dimensions"
                placeholder="Dimensions for embeddings e.g., 512. Defaults to model's default."
                value={dimensions}
                onChange={(e) => setDimensions(e.target.value ? Number(e.target.value) : '')}
              />
            </div>
          </section>

          <section className="data-section">
            <h2>Data Input</h2>
            <div className="data-group">
              <label htmlFor="data">Data to Classify (one item per line):</label>
              <textarea
                id="data"
                rows={6}
                placeholder="e.g., Artificial Intelligence is transforming industries."
                value={dataInput}
                onChange={(e) => setDataInput(e.target.value)}
              />
            </div>
            <button onClick={handleClassify} disabled={loading}>
              {loading ? 'Classifying...' : 'Classify'}
            </button>
            {error && <p className="error">Error: {error}</p>}
            {results.length > 0 && (
              <div className="results-section">
                <h3>Classification Results:</h3>
                <ul>
                  {results.map((result, index) => (
                    <li key={index} className="result-item">
                      <p><strong>Text:</strong> {result.text}</p>
                      <p><strong>Label:</strong> {result.label}</p>
                      <p><strong>Confidence:</strong> {result.confidence.toFixed(4)}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          <section className="code-section">
            <h2>Sample Code</h2>
            <div className="code-ui">
              <SyntaxHighlighter language="javascript" style={atomDark}>
                {codeString}
              </SyntaxHighlighter>
            </div>
          </section>
        </div>

        {/* Right Ad - Desktop Only */}
        <aside className="right-ad desktop-only">
          <GoogleAd slot="3396216262" variant="side" />
        </aside>
      </div>

      {/* Center Ad 1 - Above SEO Section */}
      <div className="center-ad-container">
        <GoogleAd slot="1498238281" variant="center" />
      </div>

      {/* SEO Content Section */}
      <section className="seo-content">
        <div className="seo-container">
          <h2>Understanding Text Classification and Zero-Shot Learning</h2>
          
          <div className="seo-section">
            <h3>Installation and Usage via NPM/Yarn</h3>
            <p>
              Installing the AI Zero-Shot Classifier library is simple and can be done using either npm or yarn package managers. The library is available on the npm registry and can be integrated into any JavaScript or TypeScript project in seconds.
            </p>
            
            <div className="code-block">
              <h4>Installation with NPM:</h4>
              <SyntaxHighlighter language="bash" style={atomDark}>
                {`npm install ai-zero-shot-classifier`}
              </SyntaxHighlighter>
            </div>

            <div className="code-block">
              <h4>Installation with Yarn:</h4>
              <SyntaxHighlighter language="bash" style={atomDark}>
                {`yarn add ai-zero-shot-classifier`}
              </SyntaxHighlighter>
            </div>

            <div className="code-block">
              <h4>Basic Usage with Classify Function:</h4>
              <SyntaxHighlighter language="javascript" style={atomDark}>
                {`import { classify } from 'ai-zero-shot-classifier';

const labels = ['Technology', 'Health', 'Finance'];
const data = [
  'Artificial Intelligence is transforming industries.',
  'The stock market has seen unprecedented growth.',
  'Healthcare advancements are improving lives.'
];

classify({ 
  labels, 
  data, 
  provider: 'openai',
  model: 'text-embedding-3-small',
  apiKey: 'your-api-key',
  config: { similarity: 'cosine' } 
})
  .then((results) => {
    console.log(results);
  })
  .catch((error) => {
    console.error(error);
  });`}
              </SyntaxHighlighter>
            </div>

            <div className="code-block">
              <h4>Advanced Usage with ZeroShotClassifier Class:</h4>
              <SyntaxHighlighter language="javascript" style={atomDark}>
                {`import ZeroShotClassifier from 'ai-zero-shot-classifier';

const labels = ['Technology', 'Health', 'Finance'];
const data = [
  'Artificial Intelligence is transforming industries.',
  'The stock market has seen unprecedented growth.',
  'Healthcare advancements are improving lives.'
];

// Create an instance of the classifier
const classifier = new ZeroShotClassifier({
  provider: 'openai', // Specify the provider
  model: 'text-embedding-3-small', // Specify the model
  apiKey: 'your-api-key', // API key for authentication
  labels, // Provide labels for classification
  dimensions: undefined, // Configure vector dimensions
});

(async () => {
  try {
    const results = await classifier.classify(data, {
      similarity: 'cosine', // Choose the similarity metric
    });

    console.log('Classification Results:', results);
  } catch (error) {
    console.error('Error during classification:', error);
  }
})();`}
              </SyntaxHighlighter>
            </div>

            <p>
              The library offers two main approaches for implementation: the simple classify function for quick one-off classifications, and the ZeroShotClassifier class for more advanced use cases requiring persistent configuration and multiple classification operations. Both approaches support the same powerful features including multi-provider support, custom similarity functions, and configurable batch processing.
            </p>
            
            <p>
              The npm package includes TypeScript definitions out of the box, making it easy to integrate into TypeScript projects with full IntelliSense support. The library works seamlessly in both Node.js server environments and modern web browsers, providing maximum flexibility for your deployment architecture.
            </p>
          </div>

          {/* Center Ad 2 - Between Installation and What is Text Classification */}
          <div className="center-ad-container">
            <GoogleAd slot="7600612203" variant="center" />
          </div>

          <div className="seo-section">
            <h3>What is Text Classification?</h3>
            <p>
              Text classification is a fundamental natural language processing (NLP) task that involves automatically categorizing text documents into predefined classes or labels. This machine learning technique is widely used across industries for tasks such as sentiment analysis, spam detection, topic categorization, intent recognition, and content moderation. Traditional text classification methods required extensive labeled training data and manual feature engineering, making them time-consuming and expensive to implement.
            </p>
            <p>
              Modern text classification systems leverage advanced algorithms to analyze textual content and assign appropriate categories based on learned patterns. Applications range from email filtering and news categorization to customer support ticket routing and social media monitoring. The accuracy and efficiency of text classification directly impact user experience and business operations.
            </p>
          </div>

          <div className="seo-section">
            <h3>How Large Language Models (LLMs) Are Revolutionizing Text Classification</h3>
            <p>
              Large Language Models (LLMs) have fundamentally transformed the landscape of text classification by introducing unprecedented capabilities in understanding and processing natural language. Unlike traditional machine learning approaches that required extensive feature engineering and domain-specific training data, LLMs leverage massive pre-trained models that understand contextual relationships, semantic meaning, and linguistic nuances.
            </p>
            <p>
              The power of LLMs lies in their ability to generate high-quality text embeddings - dense vector representations that capture semantic meaning. These embeddings enable sophisticated text classification without requiring large amounts of labeled training data. LLMs like OpenAI&rsquo;s GPT models, Google&rsquo;s BERT, and other transformer-based architectures have achieved state-of-the-art performance across numerous NLP benchmarks, making text classification more accessible and accurate than ever before.
            </p>
            <p>
              Modern LLMs support transfer learning, allowing models trained on vast amounts of text to be adapted for specific classification tasks with minimal additional training. This approach significantly reduces the time, cost, and computational resources required for implementing effective text classification systems.
            </p>
          </div>

          <div className="seo-section">
            <h3>Zero-Shot Classification: The Future of Text Categorization</h3>
            <p>
              Zero-shot classification represents a paradigm shift in machine learning, enabling models to classify text into categories they have never seen during training. This approach eliminates the need for labeled training data for new categories, making text classification incredibly flexible and cost-effective. Zero-shot learning leverages the semantic understanding of pre-trained language models to make intelligent predictions about text categories based on their descriptions alone.
            </p>
            <p>
              The zero-shot approach works by computing semantic similarity between input text and category labels using advanced embedding techniques. When you provide labels like &ldquo;Technology,&rdquo; &ldquo;Healthcare,&rdquo; or &ldquo;Finance,&rdquo; the model understands these concepts through its pre-trained knowledge and can accurately classify new text without any task-specific training. This capability is particularly valuable for dynamic environments where new categories emerge frequently.
            </p>
            <p>
              Zero-shot text classification enables rapid prototyping, reduces development time, and eliminates the expensive process of collecting and labeling training data. Organizations can implement sophisticated text classification systems within hours rather than months, making AI-powered text analysis accessible to businesses of all sizes.
            </p>
          </div>

          <div className="seo-section">
            <h3>Why Choose AI Zero-Shot Classifier Library</h3>
            <p>
              The AI Zero-Shot Classifier library provides a production-ready, out-of-the-box solution for implementing zero-shot text classification in your applications. Unlike complex machine learning frameworks that require extensive configuration and expertise, this library offers a simple, intuitive API that developers can integrate within minutes.
            </p>
            <p>
              Key advantages include: seamless integration with existing applications, no requirement for machine learning expertise, instant classification results, and support for custom similarity functions. The library handles all the complexity of embedding generation, similarity computation, and result ranking, allowing developers to focus on their core business logic rather than ML implementation details.
            </p>
            <p>
              The library&rsquo;s design prioritizes developer experience with clear documentation, TypeScript support, comprehensive error handling, and flexible configuration options. Whether you&rsquo;re building a content management system, customer support platform, or data analysis tool, the AI Zero-Shot Classifier provides the foundation for intelligent text categorization.
            </p>
          </div>

          <div className="seo-section">
            <h3>Multi-Provider Embedding Model Support</h3>
            <p>
              One of the standout features of the AI Zero-Shot Classifier library is its comprehensive support for multiple embedding models from different AI providers. This multi-provider approach ensures flexibility, reliability, and optimal performance for diverse use cases. The library seamlessly integrates with industry-leading providers including OpenAI, Groq, and other cutting-edge AI platforms.
            </p>
            <p>
              OpenAI&rsquo;s embedding models, such as text-embedding-3-small and text-embedding-ada-002, offer exceptional semantic understanding and have been extensively tested across various domains. Groq provides high-performance inference capabilities with competitive accuracy, making it an excellent choice for applications requiring low latency and high throughput.
            </p>
            <p>
              The multi-provider architecture offers several benefits: vendor diversification reduces dependency risk, different models excel in different domains, cost optimization through provider comparison, and future-proofing as new providers emerge. The library&rsquo;s abstracted interface means switching between providers requires minimal code changes, giving developers the flexibility to optimize for performance, cost, or specific accuracy requirements.
            </p>
            <p>
              Support for configurable embedding dimensions, custom similarity functions (cosine similarity, dot product, Euclidean distance), and provider-specific optimizations ensures that developers can fine-tune classification performance for their specific requirements. This level of customization, combined with the simplicity of zero-shot learning, makes the library suitable for everything from prototypes to enterprise-scale applications.
            </p>
          </div>

          <div className="seo-section">
            <h3>Getting Started with Zero-Shot Text Classification</h3>
            <p>
              Implementing zero-shot text classification with the AI Zero-Shot Classifier library is straightforward and requires no machine learning background. The library&rsquo;s intuitive API design allows developers to achieve sophisticated text classification results with just a few lines of code. Simply provide your text data, define your categories, and let the AI handle the rest.
            </p>
            <p>
              The library supports various configuration options including similarity function selection, embedding dimension customization, and provider-specific settings. This flexibility ensures optimal performance across different use cases while maintaining the simplicity that makes zero-shot classification accessible to all developers.
            </p>
            <p>
              Whether you&rsquo;re building content recommendation systems, automated tagging platforms, sentiment analysis tools, or customer feedback categorization systems, the AI Zero-Shot Classifier library provides the foundation for intelligent, scalable text classification solutions that grow with your business needs.
            </p>
          </div>
        </div>
      </section>

      {/* Center Ad 3 - After SEO Section */}
      <div className="center-ad-container">
        <GoogleAd slot="7872074945" variant="center" />
      </div>

      <footer>
        <p>
          Built with{' '}
          <span role="img" aria-label="love">❤️</span>{' '}
          by <a href="https://ahmedtokyo.com">Ahmed Tokyo</a>
        </p>
      </footer>
    </article>
  );
}

export default Demo;