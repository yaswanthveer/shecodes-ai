/**
 * Integration tests for /api/ai route
 * Tests all 15 AI action endpoints with mocked AI clients
 */

import { POST } from '@/app/api/ai/route';
import { createMockRequest } from '../utils/test-helpers';
import { testPrompts, mockAssessment } from '../mocks/test-data';

// Mock the Gemini client
jest.mock('@/lib/gemini/client', () => ({
  generateText: jest.fn().mockResolvedValue('Mocked AI response'),
  analyzeSentiment: jest.fn().mockResolvedValue({
    sentiment: 'positive',
    confidence: 0.85,
    emotions: ['happy', 'grateful']
  }),
  generateLifeAssessment: jest.fn().mockResolvedValue('You are doing great! Focus on self-care.'),
  rebuildResume: jest.fn().mockResolvedValue('Accomplished professional with strategic leadership experience.'),
  generateRecipe: jest.fn().mockResolvedValue({
    name: 'Nourishing Chicken Bowl',
    time: '15 minutes',
    steps: ['Prepare ingredients', 'Cook chicken', 'Combine and serve'],
    nutrition: 'Rich in protein and vitamins'
  })
}));

describe('/api/ai Route - Integration Tests', () => {

  describe('POST /api/ai - assess action', () => {
    it('should generate life assessment', async () => {
      const request = createMockRequest({
        action: 'assess',
        mumType: 'returning_to_work',
        scores: mockAssessment.scores,
        name: 'Sarah'
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('result');
      expect(typeof data.result).toBe('string');
    });
  });

  describe('POST /api/ai - chat action', () => {
    it('should handle general chat message', async () => {
      const request = createMockRequest({
        action: 'chat',
        message: testPrompts.chat,
        context: 'dashboard'
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('result');
      expect(typeof data.result).toBe('string');
    });

    it('should handle chat without context', async () => {
      const request = createMockRequest({
        action: 'chat',
        message: 'Hello'
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('result');
    });
  });

  describe('POST /api/ai - rebuild_resume action', () => {
    it('should rebuild resume for career break mother', async () => {
      const request = createMockRequest({
        action: 'rebuild_resume',
        resumeData: testPrompts.resume
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('result');
      expect(typeof data.result).toBe('string');
    });

    it('should handle missing resume data', async () => {
      const request = createMockRequest({
        action: 'rebuild_resume'
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('result');
    });
  });

  describe('POST /api/ai - generate_recipe action', () => {
    it('should generate recipe from ingredients', async () => {
      const request = createMockRequest({
        action: 'generate_recipe',
        ingredients: testPrompts.recipe,
        time: 20
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('result');
      expect(data.result).toHaveProperty('title');
      expect(data.result).toHaveProperty('time');
      expect(data.result).toHaveProperty('ingredients');
      expect(data.result).toHaveProperty('instructions');
    });
  });

  describe('POST /api/ai - sentiment action', () => {
    it('should analyze sentiment of text', async () => {
      const request = createMockRequest({
        action: 'sentiment',
        text: testPrompts.sentiment
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('result');
      expect(data.result).toHaveProperty('sentiment');
      expect(data.result).toHaveProperty('confidence');
      expect(data.result).toHaveProperty('emotions');
    });

    it('should handle empty text', async () => {
      const request = createMockRequest({
        action: 'sentiment',
        text: ''
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('result');
    });
  });

  describe('POST /api/ai - health_insight action', () => {
    it('should generate health insight', async () => {
      const request = createMockRequest({
        action: 'health_insight',
        ...testPrompts.healthInsight
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('result');
      expect(typeof data.result).toBe('string');
    });
  });

  describe('POST /api/ai - reframe_message action', () => {
    it('should reframe emotional message', async () => {
      const request = createMockRequest({
        action: 'reframe_message',
        message: testPrompts.reframeMessage
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('result');
      expect(typeof data.result).toBe('string');
    });
  });

  describe('POST /api/ai - relationship_insight action', () => {
    it('should generate relationship insight', async () => {
      const request = createMockRequest({
        action: 'relationship_insight',
        ...testPrompts.relationshipInsight
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('result');
      expect(typeof data.result).toBe('string');
    });
  });

  describe('POST /api/ai - community_support action', () => {
    it('should generate community support response', async () => {
      const request = createMockRequest({
        action: 'community_support',
        postText: testPrompts.communitySupport
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('result');
      expect(typeof data.result).toBe('string');
    });
  });

  describe('POST /api/ai - daily_insight action', () => {
    it('should generate daily insight with assessment', async () => {
      const request = createMockRequest({
        action: 'daily_insight',
        ...testPrompts.dailyInsight
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('result');
      expect(typeof data.result).toBe('string');
    });

    it('should generate welcome message for new user', async () => {
      const request = createMockRequest({
        action: 'daily_insight',
        hasAssessment: false,
        name: 'New User'
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('result');
    });
  });

  describe('POST /api/ai - affirmation action', () => {
    it('should generate daily affirmation', async () => {
      const request = createMockRequest({
        action: 'affirmation',
        context: testPrompts.affirmation
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('result');
      expect(typeof data.result).toBe('string');
    });
  });

  describe('POST /api/ai - interview_prep action', () => {
    it('should generate interview answer', async () => {
      const request = createMockRequest({
        action: 'interview_prep',
        ...testPrompts.interviewPrep
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('result');
      expect(typeof data.result).toBe('string');
    });
  });

  describe('POST /api/ai - explain_ai action', () => {
    it('should explain AI concept', async () => {
      const request = createMockRequest({
        action: 'explain_ai',
        topic: testPrompts.explainAI
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('result');
      expect(typeof data.result).toBe('string');
    });
  });

  describe('POST /api/ai - fallback/default action', () => {
    it('should handle unknown action with default behavior', async () => {
      const request = createMockRequest({
        action: 'unknown_action',
        prompt: 'Test prompt'
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('result');
    });

    it('should handle request without action', async () => {
      const request = createMockRequest({
        prompt: 'Hello'
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('result');
    });
  });

  describe('Error Handling', () => {
    it('should handle AI service errors gracefully', async () => {
      // Mock a failure
      const { generateText } = require('@/lib/gemini/client');
      generateText.mockRejectedValueOnce(new Error('AI service error'));

      const request = createMockRequest({
        action: 'chat',
        message: 'Test'
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('result');
      expect(data.result).toContain('warming up');
    });

    it('should handle malformed request body', async () => {
      const request = new Request('http://localhost:3000/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'invalid json'
      });

      const response = await POST(request as any);
      
      expect(response.status).toBe(200);
    });
  });
});

// Made with Bob
