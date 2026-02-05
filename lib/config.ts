// Centralized configuration with validation
export const config = {
  // AI Configuration
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
  },
  
  // External APIs
  youtube: {
    apiKey: process.env.YOUTUBE_API_KEY,
  },
  
  serper: {
    apiKey: process.env.SERPER_API_KEY,
  },
  
  // App Configuration
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    env: process.env.NODE_ENV || 'development',
  },
} as const;

// Validation function
export function validateConfig() {
  const required = [
    { key: 'GEMINI_API_KEY', value: config.gemini.apiKey },
    { key: 'YOUTUBE_API_KEY', value: config.youtube.apiKey },
  ];

  const missing = required.filter(({ value }) => !value);
  
  if (missing.length > 0) {
    const missingKeys = missing.map(({ key }) => key).join(', ');
    throw new Error(
      `Missing required environment variables: ${missingKeys}\n` +
      'Please check your .env.local file and ensure all required keys are set.'
    );
  }
}

// Optional keys (won't throw errors if missing)
export const optionalConfig = {
  serper: config.serper.apiKey,
};

export default config;