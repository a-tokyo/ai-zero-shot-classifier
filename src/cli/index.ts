#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { Command } from 'commander';
import classify from '../classify';

const program = new Command();

program
  .name('classify')
  .description('A CLI tool for zero-shot classification using ZeroShotClassifier.')
  .version('1.0.0')
  .requiredOption('-l, --labels <labels>', 'Comma-separated labels to classify against.')
  .requiredOption('-d, --data <data>', 'Path to a JSON file containing an array of strings to classify.')
  .option('-m, --model <model>', 'The model to use for classification (default: text-embedding-3-small).', 'text-embedding-3-small')
  .option('-p, --provider <provider>', 'The provider to use for embeddings (default: openai).', 'openai')
  .option('--embeddingBatchSizeData <number>', 'Batch size for data embeddings (default: 50).', parseInt, 50)
  .option('--embeddingBatchSizeLabels <number>', 'Batch size for label embeddings (default: 50).', parseInt, 50)
  .option('--embeddingConcurrencyData <number>', 'Concurrency for data embeddings (default: 5).', parseInt, 5)
  .option('--embeddingConcurrencyLabels <number>', 'Concurrency for label embeddings (default: 5).', parseInt, 5)
  .option('--comparingConcurrencyTop <number>', 'Concurrency for top-level comparisons (default: 10).', parseInt, 10)
  .option('--comparingConcurrencyBottom <number>', 'Concurrency for bottom-level comparisons (default: 10).', parseInt, 10)
  .option('-o, --output <output>', 'Path to save the classification results as a JSON file.')
  .action(async (options) => {
    try {
      const labels = options.labels.split(',');
      const dataPath = path.resolve(options.data);

      if (!fs.existsSync(dataPath)) {
        console.error(`Data file not found: ${dataPath}`);
        process.exit(1);
      }

      const data: string[] = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
      if (!Array.isArray(data)) {
        console.error('The data file must contain a JSON array of strings.');
        process.exit(1);
      }

      console.log('Running classification...');
      const results = await classify({
        labels,
        data,
        config: {
          similarity: options.similarity,
          embeddingBatchSizeData: options.embeddingBatchSizeData,
          embeddingBatchSizeLabels: options.embeddingBatchSizeLabels,
          embeddingConcurrencyData: options.embeddingConcurrencyData,
          embeddingConcurrencyLabels: options.embeddingConcurrencyLabels,
          comparingConcurrencyTop: options.comparingConcurrencyTop,
          comparingConcurrencyBottom: options.comparingConcurrencyBottom,
        },
        model: options.model,
        provider: options.provider,
      });

      if (options.output) {
        const outputPath = path.resolve(options.output);
        fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
        console.log(`Results saved to ${outputPath}`);
      } else {
        console.log('Classification Results:');
        console.log(JSON.stringify(results, null, 2));
      }
    } catch (error) {
      console.error(`Error during classification: ${error}`);
      process.exit(1);
    }
  });

program.parse(process.argv);