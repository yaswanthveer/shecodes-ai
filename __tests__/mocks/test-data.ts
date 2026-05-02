// Mock test data for SheCodes.AI tests

export const mockUser = {
  _id: 'test_user_001',
  email: 'test@example.com',
  name: 'Test Mother',
  mumType: 'returning_to_work',
  createdAt: '2024-01-01T00:00:00.000Z',
};

export const mockAssessment = {
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
};

export const mockJournal = {
  _id: 'journal_001',
  userId: 'test_user_001',
  entry: 'Today was challenging but I managed to stay positive.',
  mood: 7,
  aiReflection: 'Your resilience is admirable. Keep focusing on the positive.',
  createdAt: '2024-01-01T00:00:00.000Z',
};

export const mockCommunityPost = {
  _id: 'post_001',
  userId: 'test_user_001',
  content: 'Just got my first interview after 3 years! So nervous but excited.',
  likes: 15,
  comments: [],
  createdAt: '2024-01-01T00:00:00.000Z',
};

// Sample prompts for AI testing
export const testPrompts = {
  chat: 'I am feeling overwhelmed with balancing work and kids.',
  assessment: 'Generate life assessment for returning mother',
  resume: 'Career break mother seeking to return to software engineering',
  recipe: 'chicken, rice, vegetables',
  sentiment: 'I am so happy and grateful for this opportunity!',
  healthInsight: { sleep: 6, water: 5, burnout: 7 },
  reframeMessage: 'You never help with the kids and I am exhausted!',
  relationshipInsight: { partner: 6, kids: 7 },
  communitySupport: 'I feel like I lost my identity after becoming a mother.',
  dailyInsight: { name: 'Sarah', hasAssessment: true, scores: mockAssessment.scores, journalCount: 5 },
  affirmation: 'general empowerment',
  interviewPrep: { question: 'Tell me about your career gap', background: 'Software engineer, 3 year break for motherhood' },
  explainAI: 'machine learning',
};

// Expected response patterns for validation
export const expectedPatterns = {
  chat: /\b(understand|feel|support|here for you)\b/i,
  assessment: /\b(strength|courage|journey|growth)\b/i,
  resume: /\b(leadership|management|communication|strategic)\b/i,
};

// Type definitions for expected structures
export interface ExpectedSentiment {
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  emotions: string[];
}

export interface ExpectedRecipe {
  name: string;
  time: string;
  steps: string[];
  nutrition: string;
}

// Mock AI responses
export const mockAIResponses = {
  chat: 'I hear you. Balancing work and motherhood is incredibly challenging. You are doing an amazing job, and it is okay to feel overwhelmed. What specific area would you like support with today?',
  assessment: 'You are doing so much more than you realize. Your journey of becoming again starts with this exact moment of courage — and SheCodes.AI is with you every step of the way.',
  resume: 'Accomplished professional with 5+ years of strategic experience and demonstrated excellence in family leadership, crisis management, and resource optimization.',
  healthInsight: 'With 6 hours of sleep and moderate water intake, your body is working hard. Today, try adding one extra glass of water and a 10-minute rest. You deserve care too.',
  reframeMessage: 'I feel overwhelmed managing the household and kids alone. I would really appreciate more support with daily tasks so we can share the load together.',
  relationshipInsight: 'Your connection scores show you are maintaining good relationships despite challenges. Today, try one small moment of presence with your partner — even 5 minutes of undivided attention can strengthen your bond.',
  communitySupport: 'Your feelings are so valid. Motherhood changes us, but your identity is still there — it is just evolving. You are not alone in this journey of rediscovery.',
  dailyInsight: 'Sarah, your balanced scores across all areas show real strength. Today, focus on your work dimension — small steps toward your career goals will build momentum.',
  affirmation: 'Your worth is not measured by productivity, but by the courage to keep growing.',
  interviewPrep: 'During my career break, I developed advanced skills in crisis management, strategic planning, and adaptive leadership while managing a household. This experience strengthened my ability to perform under pressure and make quick decisions — skills that directly translate to executive leadership.',
  explainAI: 'Machine learning is like teaching a computer to learn from examples, similar to how you learn to recognize your baby\'s different cries. The more examples it sees, the better it gets at making predictions.',
  recipe: {
    name: 'Nourishing Chicken Rice Bowl',
    time: '15 minutes',
    steps: [
      'Prepare chicken by washing and cutting into bite-sized pieces',
      'Heat a pan with olive oil over medium heat',
      'Add chicken and cook for 5-7 minutes until golden',
      'Add rice and vegetables, stir-fry for 3-4 minutes',
      'Season with salt, pepper, and herbs, serve warm',
    ],
    nutrition: 'Rich in protein, complex carbs, and essential vitamins to support your energy throughout the day',
  },
};

// Mock Cloudant responses
export const mockCloudantResponses = {
  getUser: { result: mockUser },
  saveUser: { result: { ok: true, id: 'test_user_001', rev: '1-abc' } },
  getAssessment: { result: { docs: [mockAssessment] } },
  saveAssessment: { result: { ok: true, id: 'assessment_001', rev: '1-def' } },
  getJournals: { result: { rows: [{ doc: mockJournal }] } },
  saveJournal: { result: { ok: true, id: 'journal_001', rev: '1-ghi' } },
  initDatabase: { result: { ok: true } },
};

// Made with Bob
