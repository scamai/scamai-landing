// Internal link relationship map — single source of truth for cross-linking between content types

export const solutionToLearnLinks: Record<string, string[]> = {
  fintech: ['what-is-a-deepfake', 'how-to-detect-ai-generated-images'],
  dating: ['what-is-a-deepfake', 'how-to-detect-ai-generated-images'],
  'call-centers': ['voice-cloning-attacks', 'deepfake-detection-accuracy'],
  kyc: ['how-to-detect-ai-generated-images', 'deepfake-detection-api-guide'],
  media: ['what-is-a-deepfake', 'deepfake-statistics-2026'],
  insurance: ['how-to-detect-ai-generated-images', 'deepfake-statistics-2026'],
  hr: ['what-is-a-deepfake', 'voice-cloning-attacks'],
  government: ['deepfake-statistics-2026', 'deepfake-detection-accuracy'],
};

export const solutionToCompareLinks: Record<string, string> = {
  fintech: 'reality-defender',
  dating: 'deepware',
  'call-centers': 'sensity',
  kyc: 'reality-defender',
  media: 'hive',
  insurance: 'microsoft-azure',
  hr: 'deepware',
  government: 'microsoft-azure',
};

export const learnToSolutionLinks: Record<string, string[]> = {
  'what-is-a-deepfake': ['fintech', 'media'],
  'how-to-detect-ai-generated-images': ['kyc', 'dating'],
  'voice-cloning-attacks': ['call-centers', 'hr'],
  'deepfake-detection-accuracy': ['fintech', 'government'],
  'deepfake-detection-api-guide': ['kyc', 'fintech'],
  'deepfake-statistics-2026': ['media', 'insurance'],
};

export const learnToCompareLinks: Record<string, string> = {
  'what-is-a-deepfake': 'reality-defender',
  'how-to-detect-ai-generated-images': 'hive',
  'voice-cloning-attacks': 'sensity',
  'deepfake-detection-accuracy': 'reality-defender',
  'deepfake-detection-api-guide': 'aws-rekognition',
  'deepfake-statistics-2026': 'microsoft-azure',
};

export const compareToSolutionLinks: Record<string, string[]> = {
  'reality-defender': ['fintech', 'kyc'],
  sensity: ['call-centers', 'kyc'],
  hive: ['media', 'dating'],
  'microsoft-azure': ['government', 'insurance'],
  'aws-rekognition': ['fintech', 'kyc'],
  truepic: ['media', 'government'],
  deepware: ['dating', 'hr'],
};

export const compareToLearnLinks: Record<string, string[]> = {
  'reality-defender': ['deepfake-detection-accuracy', 'deepfake-detection-api-guide'],
  sensity: ['voice-cloning-attacks', 'how-to-detect-ai-generated-images'],
  hive: ['how-to-detect-ai-generated-images', 'what-is-a-deepfake'],
  'microsoft-azure': ['deepfake-detection-api-guide', 'deepfake-statistics-2026'],
  'aws-rekognition': ['deepfake-detection-api-guide', 'deepfake-detection-accuracy'],
  truepic: ['what-is-a-deepfake', 'deepfake-statistics-2026'],
  deepware: ['how-to-detect-ai-generated-images', 'what-is-a-deepfake'],
};

// For landing page Resources section
export const topLearnArticles = [
  'what-is-a-deepfake',
  'how-to-detect-ai-generated-images',
  'voice-cloning-attacks',
];

// For product pages
export const aiDetectionSolutionLinks = ['fintech', 'kyc', 'media'];
export const aiDetectionLearnLinks = ['how-to-detect-ai-generated-images', 'deepfake-detection-accuracy'];
export const aiDetectionCompareLink = 'reality-defender';

export const audioDetectionSolutionLinks = ['call-centers', 'fintech', 'hr'];
export const audioDetectionLearnLinks = ['voice-cloning-attacks', 'deepfake-detection-api-guide'];
export const audioDetectionCompareLink = 'sensity';
