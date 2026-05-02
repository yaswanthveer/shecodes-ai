// Jest setup file for global test configuration

// Mock environment variables for testing
process.env.GEMINI_API_KEY = 'test-gemini-key';
process.env.WATSONX_API_KEY = 'test-watsonx-key';
process.env.WATSONX_PROJECT_ID = 'test-project-id';
process.env.WATSONX_URL = 'https://test.ml.cloud.ibm.com';
process.env.CLOUDANT_URL = 'https://test-cloudant.appdomain.cloud';
process.env.CLOUDANT_APIKEY = 'test-cloudant-key';

// Suppress console errors during tests (optional)
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
};

// Made with Bob
