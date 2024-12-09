
# ai-zero-shot-classifier

![NPM Version](https://img.shields.io/npm/v/ai-zero-shot-classifier.svg)
![NPM Downloads](https://img.shields.io/npm/dt/ai-zero-shot-classifier.svg)
![Codecov Coverage](https://img.shields.io/codecov/c/github/A-Tokyo/ai-zero-shot-classifier.svg)
![Twitter Follow](https://img.shields.io/twitter/follow/ahmad_tokyo.svg?label=Follow%20@ahmad_tokyo)

[Demo](https://a-tokyo.github.io/ai-zero-shot-classifier)

## 🚀 Introduction

**ai-zero-shot-classifier** is a powerful JavaScript library that leverages advanced AI embeddings to perform zero-shot text classification. Whether you're dealing with unlabelled data or seeking to classify text against dynamic and user-defined labels, this library provides a seamless and efficient solution.

## 🧐 Why ai-zero-shot-classifier?

### **The Problem**
In many real-world applications, acquiring labeled data for training classification models is time-consuming, expensive, and sometimes impractical. Traditional supervised learning approaches require vast amounts of annotated data, which isn't always feasible to obtain. Moreover, adapting models to new, unforeseen categories necessitates retraining, which can be resource-intensive.

### **The Innovation**
**ai-zero-shot-classifier** addresses these challenges by using pre-trained embeddings to classify text without any task-specific training. You simply define your labels dynamically, and the classifier matches your data with the closest label based on semantic similarity.

## ✨ Features

- **Dynamic Labels**: Classify text using labels you define on the fly.
- **Multiple Similarity Functions**: Supports cosine similarity, dot product, and Euclidean distance.
- **Batch Processing**: Handles embeddings and similarity calculations efficiently using customizable batch sizes and concurrency.
- **Integration-Friendly**: Works seamlessly with OpenAI embeddings and can be easily integrated into your application.

## 📦 Installation

```bash
npm install ai-zero-shot-classifier
```

or

```bash
yarn add ai-zero-shot-classifier
```

## 🚀 Usage

### Basic Example

```javascript
import classify from 'ai-zero-shot-classifier';

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

### Configuration Options

| Option                     | Description                                       | Default          |
|----------------------------|---------------------------------------------------|------------------|
| `similarity`               | Similarity function to use (`cosine`, `dot`, `euclidean`) | `cosine`         |
| `embeddingBatchSizeData`   | Batch size for data embeddings                    | `50`             |
| `embeddingBatchSizeLabels` | Batch size for label embeddings                   | `50`             |
| `embeddingConcurrencyData` | Concurrency for data embeddings                   | `5`              |
| `embeddingConcurrencyLabels` | Concurrency for label embeddings                | `5`              |
| `comparingConcurrencyTop`  | Concurrency for top-level comparisons             | `10`             |
| `comparingConcurrencyBottom` | Concurrency for bottom-level comparisons        | `10`             |

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

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 📄 License

This project is licensed under the MIT License.
