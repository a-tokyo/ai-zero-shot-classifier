
# ai-zero-shot-classifier

<a href="https://npmjs.com/package/ai-zero-shot-classifier">
  <img src="https://img.shields.io/npm/v/ai-zero-shot-classifier.svg"></img>
  <img src="https://img.shields.io/npm/dt/ai-zero-shot-classifier.svg"></img>
</a>
<a href="https://codecov.io/gh/A-Tokyo/ai-zero-shot-classifier">
  <img src="https://img.shields.io/codecov/c/github/a-tokyo/ai-zero-shot-classifier.svg"></img>
</a>
<a href="https://twitter.com/intent/follow?screen_name=ahmad_tokyo"><img src="https://img.shields.io/twitter/follow/ahmad_tokyo.svg?label=Follow%20@ahmad_tokyo" alt="Follow @ahmad_tokyo"></img></a>

[Checkout the demo for a quick start!](https://a-tokyo.github.io/ai-zero-shot-classifier)

---

## 🚀 Introduction

**ai-zero-shot-classifier** is a powerful, flexible JavaScript library designed to perform zero-shot text classification using pre-trained AI embeddings. The library supports multiple providers and models, enabling you to choose the best AI tools for your project, whether it's OpenAI's models or alternative providers like Groq.

---

## 🧐 Why ai-zero-shot-classifier?

### **The Problem**
Traditional text classification requires extensive labeled data and retraining models to adapt to new categories. This process can be costly, time-consuming, and impractical when dealing with constantly evolving datasets or dynamic categories.

### **The Innovation**
**ai-zero-shot-classifier** eliminates the need for labeled datasets by leveraging pre-trained AI embeddings. It allows for dynamic and task-specific labels, enabling real-time classification across various domains without retraining models. It supports multiple providers and their respective models, making it adaptable to diverse use cases.

---

## ✨ Features

- **Multi-Provider Support**: Works with providers like OpenAI and Groq, enabling integration with models such as GPT, Llama, and others.
- **Dynamic Labels**: Define your labels dynamically for each classification task.
- **Multiple Similarity Functions**: Supports cosine similarity, dot product, and Euclidean distance for flexible classification needs.
- **Batch Processing**: Efficiently handles large datasets with customizable batch sizes and concurrency.
- **Highly Configurable**: Adjustable settings for embeddings, similarity calculations, and more.
- **Seamless Integration**: Simple API designed for easy use in Node.js and browser environments.

---

## 📦 Installation

```bash
npm install ai-zero-shot-classifier
```

or

```bash
yarn add ai-zero-shot-classifier
```

---

## 🚀 Usage

### Basic Example with classify Function

```javascript
import { classify } from 'ai-zero-shot-classifier';

const labels = ['Technology', 'Health', 'Finance'];
const data = [
  'Artificial Intelligence is transforming industries.',
  'The stock market has seen unprecedented growth.',
  'Healthcare advancements are improving lives.'
];

classify({ labels, data, config: { similarity: 'cosine' } })
  .then((results) => {
    console.log(results);
  })
  .catch((error) => {
    console.error(error);
  });
```

### Example with ZeroShotClassifier Class

```javascript
import ZeroShotClassifier from 'ai-zero-shot-classifier';

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
  dimensions: undefined, // Pass dimensions as a number here to configure vector dimensions
});

(async () => {
  try {
    const results = await classifier.classify(data, {
      similarity: 'cosine', // Choose the similarity metric
    });

    // perform more classification

    console.log('Classification Results:', results);
  } catch (error) {
    console.error('Error during classification:', error);
  }
})();
```

---

## ⚙️ Configuration Options

| Option                     | Description                                       | Default          |
|----------------------------|---------------------------------------------------|------------------|
| `similarity`               | Similarity function to use (`cosine`, `dot`, `euclidean`) | `cosine`         |
| `embeddingBatchSizeData`   | Batch size for data embeddings                    | `50`             |
| `embeddingBatchSizeLabels` | Batch size for label embeddings                   | `50`             |
| `embeddingConcurrencyData` | Concurrency for data embeddings                   | `5`              |
| `embeddingConcurrencyLabels` | Concurrency for label embeddings                | `5`              |
| `comparingConcurrencyTop`  | Concurrency for top-level comparisons             | `10`             |
| `comparingConcurrencyBottom` | Concurrency for bottom-level comparisons        | `10`             |

---

## 🛠️ Development

Clone the repository:

```bash
git clone https://github.com/a-tokyo/ai-zero-shot-classifier.git
```

Install dependencies:

```bash
yarn install
```

Run the development server:

```bash
yarn start
```

Run tests:

```bash
yarn test
```

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.
