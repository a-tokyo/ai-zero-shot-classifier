'use client';

import React, { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

import classify from '../../../../src/classify';

interface ClassificationResult {
  text: string;
  label: string;
  confidence: number;
}

function DemoForm() {
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
    <div className="container">
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
  );
}

export default DemoForm; 