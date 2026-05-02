# 🧪 Quick Start - Testing Guide

## Installation

Install test dependencies:

```bash
npm install
```

This will install:
- `jest` - Testing framework
- `ts-jest` - TypeScript support for Jest
- `@types/jest` - TypeScript definitions
- `jest-environment-jsdom` - DOM environment for tests

## Running Tests

### Run All Tests
```bash
npm test
```

### Run with Coverage Report
```bash
npm run test:coverage
```

### Run Unit Tests Only
```bash
npm run test:unit
```

### Run Integration Tests Only
```bash
npm run test:integration
```

### Watch Mode (Auto-rerun on changes)
```bash
npm run test:watch
```

### Verbose Output
```bash
npm run test:verbose
```

### CI/CD Mode
```bash
npm run test:ci
```

## Test Structure

```
__tests__/
├── unit/                          # Unit tests (75+ tests)
│   ├── gemini-client.test.ts     # Gemini AI client
│   └── watsonx-client.test.ts    # WatsonX AI client
├── integration/                   # Integration tests (45+ tests)
│   ├── api-ai-route.test.ts      # /api/ai endpoint
│   └── api-data-route.test.ts    # /api/data endpoint
├── mocks/                         # Test data
│   └── test-data.ts
└── utils/                         # Test helpers
    └── test-helpers.ts
```

## What's Tested

### ✅ AI Client Functions (Unit Tests)
- Text generation (Gemini & WatsonX)
- Sentiment analysis
- Life assessments
- Resume rebuilding
- Recipe generation
- Error handling & fallbacks

### ✅ API Routes (Integration Tests)
- `/api/ai` - 15 AI actions
  - assess, chat, rebuild_resume, generate_recipe
  - sentiment, health_insight, reframe_message
  - relationship_insight, community_support
  - daily_insight, affirmation, interview_prep
  - explain_ai, and more
- `/api/data` - 7 database actions
  - init, save_user, get_user
  - save_assessment, get_assessment
  - save_journal, get_journals

## Coverage Goals

- **Unit Tests**: 80%+ coverage
- **Integration Tests**: 100% API route coverage
- **Total Tests**: 120+ test cases

## Quick Examples

### Run Specific Test File
```bash
npm test -- gemini-client.test.ts
```

### Run Tests Matching Pattern
```bash
npm test -- -t "sentiment"
```

### Update Snapshots
```bash
npm test -- -u
```

## Documentation

For detailed testing documentation, see:
- **[TEST_DOCUMENTATION.md](./TEST_DOCUMENTATION.md)** - Complete testing guide
- **[jest.config.js](./jest.config.js)** - Jest configuration
- **[jest.setup.js](./jest.setup.js)** - Test environment setup

## TypeScript Notes

You may see TypeScript errors in test files (e.g., "Cannot find name 'jest'"). These are expected and won't affect test execution. Jest provides these globals at runtime.

## Next Steps

1. Install dependencies: `npm install`
2. Run tests: `npm test`
3. View coverage: `npm run test:coverage`
4. Read full docs: [TEST_DOCUMENTATION.md](./TEST_DOCUMENTATION.md)

---

**Happy Testing! 🚀**