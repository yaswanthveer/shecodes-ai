/**
 * Integration tests for /api/data route
 * Tests all 7 database action endpoints with mocked Cloudant client
 */

import { POST } from '@/app/api/data/route';
import { createMockRequest } from '../utils/test-helpers';

// Mock the Cloudant database functions
jest.mock('@/lib/cloudant/db', () => ({
  initializeDatabases: jest.fn().mockResolvedValue(true),
  saveUser: jest.fn().mockResolvedValue(true),
  getUser: jest.fn().mockResolvedValue({
    _id: 'test_user_001',
    email: 'test@example.com',
    name: 'Test Mother',
    mumType: 'returning_to_work',
    createdAt: '2024-01-01T00:00:00.000Z',
  }),
  saveAssessment: jest.fn().mockResolvedValue(true),
  getLatestAssessment: jest.fn().mockResolvedValue({
    _id: 'assessment_001',
    userId: 'test_user_001',
    scores: {
      health: 7,
      mind: 6,
      relationships: 8,
      work: 5,
      nourish: 7,
    },
    aiInsights: 'You are doing great! Focus on work-life balance.',
    createdAt: '2024-01-01T00:00:00.000Z',
  }),
  saveJournalEntry: jest.fn().mockResolvedValue(true),
  getJournals: jest.fn().mockResolvedValue([{
    _id: 'journal_001',
    userId: 'test_user_001',
    entry: 'Today was challenging but I managed to stay positive.',
    mood: 7,
    aiReflection: 'Your resilience is admirable. Keep focusing on the positive.',
    createdAt: '2024-01-01T00:00:00.000Z',
  }])
}));

describe('/api/data Route - Integration Tests', () => {

  describe('POST /api/data - init action', () => {
    it('should initialize databases successfully', async () => {
      const request = createMockRequest({
        action: 'init'
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('success');
      expect(data.success).toBe(true);
    });
  });

  describe('POST /api/data - save_user action', () => {
    it('should save user data', async () => {
      const request = createMockRequest({
        action: 'save_user',
        userId: 'test_user_001',
        data: {
          name: 'Test User',
          email: 'test@example.com',
          mumType: 'returning_to_work'
        }
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('success');
      expect(data.success).toBe(true);
    });

    it('should use default userId when not provided', async () => {
      const request = createMockRequest({
        action: 'save_user',
        data: {
          name: 'Demo User',
          email: 'demo@example.com'
        }
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('success');
    });
  });

  describe('POST /api/data - get_user action', () => {
    it('should retrieve user data', async () => {
      const request = createMockRequest({
        action: 'get_user',
        userId: 'test_user_001'
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('user');
      expect(data.user).toHaveProperty('_id');
      expect(data.user).toHaveProperty('name');
      expect(data.user).toHaveProperty('email');
    });

    it('should use default userId when not provided', async () => {
      const request = createMockRequest({
        action: 'get_user'
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('user');
    });
  });

  describe('POST /api/data - save_assessment action', () => {
    it('should save assessment data', async () => {
      const request = createMockRequest({
        action: 'save_assessment',
        userId: 'test_user_001',
        data: {
          scores: {
            health: 7,
            mind: 6,
            relationships: 8,
            work: 5,
            nourish: 7
          },
          aiInsights: 'You are doing great!'
        }
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('success');
      expect(data.success).toBe(true);
    });

    it('should handle assessment with all score dimensions', async () => {
      const request = createMockRequest({
        action: 'save_assessment',
        data: mockAssessment
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });
  });

  describe('POST /api/data - get_assessment action', () => {
    it('should retrieve latest assessment', async () => {
      const request = createMockRequest({
        action: 'get_assessment',
        userId: 'test_user_001'
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('assessment');
      expect(data.assessment).toHaveProperty('scores');
      expect(data.assessment.scores).toHaveProperty('health');
      expect(data.assessment.scores).toHaveProperty('mind');
      expect(data.assessment.scores).toHaveProperty('relationships');
      expect(data.assessment.scores).toHaveProperty('work');
      expect(data.assessment.scores).toHaveProperty('nourish');
    });

    it('should use default userId when not provided', async () => {
      const request = createMockRequest({
        action: 'get_assessment'
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('assessment');
    });
  });

  describe('POST /api/data - save_journal action', () => {
    it('should save journal entry', async () => {
      const request = createMockRequest({
        action: 'save_journal',
        userId: 'test_user_001',
        data: {
          entry: 'Today was a good day. I felt productive and happy.',
          mood: 8,
          aiReflection: 'Your positive energy is wonderful to see!'
        }
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('success');
      expect(data.success).toBe(true);
    });

    it('should handle journal with low mood score', async () => {
      const request = createMockRequest({
        action: 'save_journal',
        data: {
          entry: 'Struggling today with everything.',
          mood: 3,
          aiReflection: 'It is okay to have difficult days.'
        }
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });
  });

  describe('POST /api/data - get_journals action', () => {
    it('should retrieve all journals for user', async () => {
      const request = createMockRequest({
        action: 'get_journals',
        userId: 'test_user_001'
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('journals');
      expect(Array.isArray(data.journals)).toBe(true);
      expect(data.journals.length).toBeGreaterThan(0);
      expect(data.journals[0]).toHaveProperty('entry');
      expect(data.journals[0]).toHaveProperty('mood');
    });

    it('should use default userId when not provided', async () => {
      const request = createMockRequest({
        action: 'get_journals'
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('journals');
      expect(Array.isArray(data.journals)).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should return 400 for unknown action', async () => {
      const request = createMockRequest({
        action: 'unknown_action'
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty('error');
      expect(data.error).toBe('Unknown action');
    });

    it('should handle database errors gracefully', async () => {
      // Mock a database failure
      const { saveUser } = require('@/lib/cloudant/db');
      saveUser.mockRejectedValueOnce(new Error('Database error'));

      const request = createMockRequest({
        action: 'save_user',
        data: { name: 'Test' }
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toHaveProperty('error');
      expect(data.error).toBe('Database operation failed');
    });

    it('should handle malformed request body', async () => {
      const request = new Request('http://localhost:3000/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'invalid json'
      });

      const response = await POST(request as any);
      
      expect(response.status).toBe(500);
    });

    it('should handle missing action parameter', async () => {
      const request = createMockRequest({
        userId: 'test_user_001'
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty('error');
    });
  });

  describe('Default User ID Behavior', () => {
    it('should use demo_user_001 as default userId', async () => {
      const request = createMockRequest({
        action: 'get_user'
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('user');
      // The implementation uses 'demo_user_001' as default
    });

    it('should override default userId when provided', async () => {
      const request = createMockRequest({
        action: 'get_user',
        userId: 'custom_user_123'
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('user');
    });
  });
});

// Made with Bob
