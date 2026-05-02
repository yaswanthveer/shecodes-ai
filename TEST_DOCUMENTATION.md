# SheCodes.AI - Test Documentation

## 📋 Overview

This document provides comprehensive testing documentation for the SheCodes.AI platform, focusing on API routes and AI integration testing.

## 🎯 Test Strategy

### Testing Framework
- **Jest** - JavaScript testing framework with TypeScript support
- **Node Environment** - Tests run in Node.js environment for API route testing
- **Mocked Services** - All external services (Gemini AI, WatsonX, Cloudant) are mocked

### Test Coverage Goals
- **Unit Tests**: 80%+ coverage for AI client functions
- **Integration Tests**: 100% coverage for API route endpoints
- **Focus Areas**: Business logic, error handling, data validation

## 📁 Test Structure

```
__tests__/
├── unit/                          # Unit tests for individual modules
│   ├── gemini-client.test.ts     # Gemini AI client tests (227 lines, 40+ tests)
│   └── watsonx-client.test.ts    # WatsonX AI client tests (260 lines, 35+ tests)
├── integration/                   # Integration tests for API routes
│   ├── api-ai-route.test.ts      # /api/ai endpoint tests (337 lines, 25+ tests)
│   └── api-data-route.test.ts    # /api/data endpoint tests (318 lines, 20+ tests)
├── mocks/                         # Mock data and responses
│   └── test-data.ts              # Centralized test data (135 lines)
└── utils/                         # Test utilities
    └── test-helpers.ts           # Helper functions (53 lines)
```

## 🧪 Test Categories

### 1. Unit Tests - AI Clients

#### Gemini Client (`__tests__/unit/gemini-client.test.ts`)

**Functions Tested:**
- `generateText()` - General text generation
- `analyzeSentiment()` - Sentiment analysis with positive/negative/neutral detection
- `generateLifeAssessment()` - Life assessment generation for different mother types
- `rebuildResume()` - Resume rebuilding for career break mothers
- `generateRecipe()` - Recipe generation from ingredients

**Test Coverage:**
- ✅ Basic functionality with various inputs
- ✅ Custom parameters (temperature, maxTokens, model)
- ✅ Error handling and fallback responses
- ✅ Edge cases (empty inputs, minimal data)
- ✅ Response structure validation

**Example Test:**
```typescript
it('should analyze positive sentiment correctly', async () => {
  const result = await analyzeSentiment('I am so happy and grateful!');
  
  expect(result).toHaveProperty('sentiment');
  expect(result).toHaveProperty('confidence');
  expect(result).toHaveProperty('emotions');
  expect(['positive', 'negative', 'neutral']).toContain(result.sentiment);
  expect(result.confidence).toBeGreaterThanOrEqual(0);
  expect(result.confidence).toBeLessThanOrEqual(1);
});
```

#### WatsonX Client (`__tests__/unit/watsonx-client.test.ts`)

**Functions Tested:**
- Same as Gemini client (parallel implementation)
- Additional IAM token authentication testing
- Mock response fallback testing

**Test Coverage:**
- ✅ API authentication flow
- ✅ Network error handling
- ✅ Invalid JSON response handling
- ✅ Mock response system validation

### 2. Integration Tests - API Routes

#### /api/ai Route (`__tests__/integration/api-ai-route.test.ts`)

**15 Actions Tested:**

1. **assess** - Life assessment generation
2. **chat** - General chat/conversation
3. **rebuild_resume** - Resume rebuilding
4. **generate_recipe** - Recipe generation
5. **sentiment** - Sentiment analysis
6. **health_insight** - Health insights from metrics
7. **reframe_message** - Message reframing for relationships
8. **relationship_insight** - Relationship analysis
9. **community_support** - Community support responses
10. **daily_insight** - Daily personalized insights
11. **affirmation** - Daily affirmations
12. **interview_prep** - Interview preparation
13. **explain_ai** - AI concept explanations
14. **fallback** - Default/unknown action handling
15. **error_handling** - Error scenarios

**Example Test:**
```typescript
it('should generate life assessment', async () => {
  const request = createMockRequest({
    action: 'assess',
    mumType: 'returning_to_work',
    scores: { health: 7, mind: 6, relationships: 8, work: 5, nourish: 7 },
    name: 'Sarah'
  });

  const response = await POST(request);
  const data = await response.json();

  expect(response.status).toBe(200);
  expect(data).toHaveProperty('result');
  expect(typeof data.result).toBe('string');
});
```

#### /api/data Route (`__tests__/integration/api-data-route.test.ts`)

**7 Actions Tested:**

1. **init** - Database initialization
2. **save_user** - Save user data
3. **get_user** - Retrieve user data
4. **save_assessment** - Save assessment
5. **get_assessment** - Retrieve latest assessment
6. **save_journal** - Save journal entry
7. **get_journals** - Retrieve all journals

**Test Coverage:**
- ✅ CRUD operations for all data types
- ✅ Default userId behavior (demo_user_001)
- ✅ Error handling (400, 500 status codes)
- ✅ Malformed request handling
- ✅ Missing parameter validation

## 🚀 Running Tests

### Install Dependencies

First, install the required testing dependencies:

```bash
npm install --save-dev @types/jest jest ts-jest @types/node
```

### Run All Tests

```bash
npm test
```

### Run Specific Test Suites

```bash
# Unit tests only
npm test -- __tests__/unit

# Integration tests only
npm test -- __tests__/integration

# Specific file
npm test -- gemini-client.test.ts
```

### Run with Coverage

```bash
npm test -- --coverage
```

### Watch Mode (for development)

```bash
npm test -- --watch
```

## 📊 Test Data

### Mock Data (`__tests__/mocks/test-data.ts`)

**Available Mock Objects:**
- `mockUser` - Sample user data
- `mockAssessment` - Sample assessment with scores
- `mockJournal` - Sample journal entry
- `mockCommunityPost` - Sample community post
- `testPrompts` - Test prompts for all AI actions
- `mockAIResponses` - Expected AI responses
- `mockCloudantResponses` - Database responses

**Example Usage:**
```typescript
import { mockUser, testPrompts } from '../mocks/test-data';

const request = createMockRequest({
  action: 'chat',
  message: testPrompts.chat
});
```

## 🛠️ Test Utilities

### Helper Functions (`__tests__/utils/test-helpers.ts`)

**Available Helpers:**
- `createMockRequest(body, method)` - Create Next.js request mock
- `wait(ms)` - Async wait utility
- `generateTestUserId()` - Generate unique test user IDs
- `cleanupTestData(userId)` - Cleanup placeholder
- `extractJSON(text)` - Extract JSON from AI responses

**Example Usage:**
```typescript
import { createMockRequest } from '../utils/test-helpers';

const request = createMockRequest({
  action: 'assess',
  scores: { health: 7, mind: 6 }
});
```

## ✅ Best Practices

### 1. Test Isolation
- Each test should be independent
- Use `beforeEach` to reset mocks
- Don't rely on test execution order

### 2. Descriptive Test Names
```typescript
// ✅ Good
it('should generate life assessment for returning mother', async () => {});

// ❌ Bad
it('test1', async () => {});
```

### 3. Arrange-Act-Assert Pattern
```typescript
it('should save user data', async () => {
  // Arrange
  const request = createMockRequest({ action: 'save_user', data: mockUser });
  
  // Act
  const response = await POST(request);
  const data = await response.json();
  
  // Assert
  expect(response.status).toBe(200);
  expect(data.success).toBe(true);
});
```

### 4. Test Both Success and Failure Cases
```typescript
describe('POST /api/ai - chat action', () => {
  it('should handle valid chat message', async () => {
    // Test success case
  });
  
  it('should handle empty message', async () => {
    // Test edge case
  });
  
  it('should handle AI service error', async () => {
    // Test error case
  });
});
```

### 5. Use Meaningful Assertions
```typescript
// ✅ Good - Specific assertions
expect(data).toHaveProperty('result');
expect(typeof data.result).toBe('string');
expect(data.result.length).toBeGreaterThan(0);

// ❌ Bad - Vague assertions
expect(data).toBeTruthy();
```

## 🐛 Debugging Tests

### View Test Output
```bash
npm test -- --verbose
```

### Run Single Test
```bash
npm test -- -t "should generate life assessment"
```

### Debug in VS Code
Add to `.vscode/launch.json`:
```json
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand", "--no-cache"],
  "console": "integratedTerminal"
}
```

## 📈 Coverage Reports

After running tests with coverage:
```bash
npm test -- --coverage
```

View detailed HTML report:
```bash
open coverage/lcov-report/index.html
```

**Coverage Thresholds (jest.config.js):**
- Branches: 70%
- Functions: 70%
- Lines: 70%
- Statements: 70%

## 🔧 Troubleshooting

### TypeScript Errors in Test Files

The TypeScript errors you see (e.g., "Cannot find name 'jest'") are expected in the editor but won't affect test execution. Jest provides these globals at runtime.

To suppress these errors, you can:
1. Install `@types/jest`: `npm install --save-dev @types/jest`
2. Add to `tsconfig.json`:
```json
{
  "compilerOptions": {
    "types": ["jest", "node"]
  }
}
```

### Mock Not Working

Ensure mocks are defined before imports:
```typescript
// ✅ Correct order
jest.mock('@/lib/gemini/client');
import { generateText } from '@/lib/gemini/client';

// ❌ Wrong order
import { generateText } from '@/lib/gemini/client';
jest.mock('@/lib/gemini/client');
```

### Tests Timing Out

Increase timeout in jest.config.js:
```javascript
testTimeout: 10000 // 10 seconds
```

## 📝 Adding New Tests

### 1. Create Test File
```typescript
// __tests__/unit/new-feature.test.ts
import { newFunction } from '@/lib/new-feature';

describe('New Feature', () => {
  it('should work correctly', async () => {
    const result = await newFunction('test');
    expect(result).toBeDefined();
  });
});
```

### 2. Add Mock Data
```typescript
// __tests__/mocks/test-data.ts
export const mockNewFeature = {
  id: 'test_001',
  data: 'test data'
};
```

### 3. Run New Tests
```bash
npm test -- new-feature.test.ts
```

## 🎓 Learning Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Next.js API Routes](https://nextjs.org/docs/pages/building-your-application/testing/jest)
- [TypeScript with Jest](https://jestjs.io/docs/getting-started#using-typescript)

## 📞 Support

For questions or issues with tests:
1. Check this documentation
2. Review existing test examples
3. Check Jest error messages carefully
4. Ensure all dependencies are installed

---

**Last Updated:** 2026-05-02  
**Test Suite Version:** 1.0.0  
**Total Tests:** 120+  
**Total Test Files:** 4  
**Total Lines of Test Code:** 1,150+