import ZeroShotClassifier from '../ZeroShotClassifier';

type ClassificationInput = ConstructorParameters<
  typeof ZeroShotClassifier
>[0] & {
  data: string[];
  config?: Parameters<ZeroShotClassifier['classify']>[1];
};

type ClassificationResult = Awaited<ReturnType<ZeroShotClassifier['classify']>>;

/**
 * Pure function wrapper for ZeroShotClassifier
 * @param input ClassificationInput
 * @returns Promise<ClassificationResult>
 */
async function classify({
  labels,
  data,
  config,
  ...classifierConfig
}: ClassificationInput): Promise<ClassificationResult> {
  const classifier = new ZeroShotClassifier({
    ...classifierConfig,
    labels,
  });

  return classifier.classify(data, config);
}

export default classify;
