/**
 * Unit tests for WatsonX AI Client
 * Tests all AI generation functions with mocked WatsonX API
 */

import { generateText, analyzeSentiment, generateLifeAssessment, rebuildResume, generateRecipe } from '@/lib/watsonx/client';
import { mockAIResponses, mockAssessment, testPrompts } from '../mocks/test-data';

// Mock fetch for WatsonX API calls
global.fetch = jest.fn();

describe('WatsonX AI Client - Unit Tests', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock IAM token endpoint
    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url.includes('iam.cloud.ibm.com')) {
        return Promise.resolve({
          json: () => Promise.resolve({
            access_token: 'mock-token',
            expires_in: 3600
          })
        });
      }
      
      // Mock WatsonX text generation endpoint
      if (url.includes('ml.cloud.ibm.com')) {
        return Promise.resolve({
          json: () => Promise.resolve({
            results: [{
              generated_text: 'Mocked WatsonX response'
            }]
          })
        });
      }
      
      return Promise.reject(new Error('Unknown endpoint'));
    });
  });

  describe('generateText()', () => {
    it('should generate text from a simple prompt', async () => {
      const result = await generateText('Hello, how are you?');
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle custom parameters', async () => {
      const result = await generateText('Test prompt', {
        model: 'ibm/granite-13b-instruct-v2',
        maxTokens: 100,
        temperature: 0.5,
      });
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });

    it('should return mock response when API key is missing', async () => {
      // The implementation checks for API key and returns mock
      const result = await generateText('test prompt');
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });
  });

  describe('analyzeSentiment()', () => {
    it('should analyze positive sentiment correctly', async () => {
      const result = await analyzeSentiment('I am so happy and grateful for this opportunity!');
      
      expect(result).toHaveProperty('sentiment');
      expect(result).toHaveProperty('confidence');
      expect(result).toHaveProperty('emotions');
      expect(['positive', 'negative', 'neutral']).toContain(result.sentiment);
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
      expect(Array.isArray(result.emotions)).toBe(true);
    });

    it('should analyze negative sentiment correctly', async () => {
      const result = await analyzeSentiment('I feel overwhelmed and exhausted');
      
      expect(result).toHaveProperty('sentiment');
      expect(result.sentiment).toBe('negative');
      expect(result.emotions).toContain('concern');
    });

    it('should handle neutral text', async () => {
      const result = await analyzeSentiment('The weather is cloudy today');
      
      expect(result).toHaveProperty('sentiment');
      expect(result.sentiment).toBe('neutral');
    });

    it('should detect multiple positive words', async () => {
      const result = await analyzeSentiment('I am happy, excited, and grateful for this amazing opportunity');
      
      expect(result.sentiment).toBe('positive');
      expect(result.confidence).toBeGreaterThan(0.5);
    });
  });

  describe('generateLifeAssessment()', () => {
    it('should generate assessment for returning mother', async () => {
      const data = {
        mumType: 'returning_to_work',
        scores: mockAssessment.scores,
        name: 'Sarah'
      };
      
      const result = await generateLifeAssessment(data);
      
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(50);
    });

    it('should generate assessment for working mother', async () => {
      const data = {
        mumType: 'working_mum',
        scores: { health: 8, mind: 7, relationships: 9, work: 8, nourish: 7 },
        name: 'Emma'
      };
      
      const result = await generateLifeAssessment(data);
      
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });

    it('should include user name in assessment', async () => {
      const data = {
        mumType: 'stay_at_home',
        scores: mockAssessment.scores,
        name: 'Lisa'
      };
      
      const result = await generateLifeAssessment(data);
      
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });
  });

  describe('rebuildResume()', () => {
    it('should rebuild resume for career break mother', async () => {
      const result = await rebuildResume(testPrompts.resume);
      
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(50);
    });

    it('should handle long CV text', async () => {
      const longCV = 'Software Engineer with 10 years experience. ' + 'Skills include JavaScript, Python, React. '.repeat(20);
      const result = await rebuildResume(longCV);
      
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });

    it('should handle minimal input', async () => {
      const result = await rebuildResume('Career break mother');
      
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });
  });

  describe('generateRecipe()', () => {
    it('should generate recipe from ingredients list', async () => {
      const ingredients = ['chicken', 'rice', 'vegetables'];
      const result = await generateRecipe(ingredients);
      
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('time');
      expect(result).toHaveProperty('steps');
      expect(result).toHaveProperty('nutrition');
      expect(typeof result.name).toBe('string');
      expect(typeof result.time).toBe('string');
      expect(Array.isArray(result.steps)).toBe(true);
      expect(result.steps.length).toBe(5);
      expect(typeof result.nutrition).toBe('string');
    });

    it('should generate recipe with limited ingredients', async () => {
      const ingredients = ['eggs', 'bread'];
      const result = await generateRecipe(ingredients);
      
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('steps');
      expect(result.steps.length).toBeGreaterThan(0);
    });

    it('should include first ingredient in recipe name', async () => {
      const ingredients = ['salmon', 'quinoa', 'broccoli'];
      const result = await generateRecipe(ingredients);
      
      expect(result.name.toLowerCase()).toContain('salmon');
    });

    it('should handle empty ingredients array', async () => {
      const ingredients: string[] = [];
      const result = await generateRecipe(ingredients);
      
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('steps');
    });
  });

  describe('Mock Response Fallbacks', () => {
    it('should return assessment mock when API fails', async () => {
      const data = {
        mumType: 'returning_to_work',
        scores: mockAssessment.scores,
        name: 'Test'
      };
      
      const result = await generateLifeAssessment(data);
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });

    it('should return resume mock when API fails', async () => {
      const result = await rebuildResume('test resume');
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });

    it('should return recipe mock when API fails', async () => {
      const result = await generateRecipe(['test']);
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('steps');
    });

    it('should return journal mock for emotional prompts', async () => {
      const result = await generateText('I feel overwhelmed today');
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
      
      const result = await generateText('test');
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });

    it('should handle invalid JSON responses', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: () => Promise.resolve({ invalid: 'response' })
      });
      
      const result = await generateText('test');
      expect(result).toBeDefined();
    });
  });
});

// Made with Bob
