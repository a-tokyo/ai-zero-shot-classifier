import { classify } from '../src';

async function runExample() {
  // Define the labels to classify against
  const labels = ['Positive', 'Negative', 'Neutral'];

  // Define the data to classify
  const data = [
    'I absolutely love this product!', // positive
    'This is the worst experience I have ever had.', // negative
    'It was okay, nothing special.', // neutral
  ];

  try {
    // Call the classify function with configuration
    const results = await classify({
      provider: 'openai',
      model: 'text-embedding-3-small',
      labels,
      data,
    });

    // Output the classification results
    console.log('Classification Results:', results);
  } catch (error) {
    console.error('Error during classification:', error);
  }
}

runExample();
