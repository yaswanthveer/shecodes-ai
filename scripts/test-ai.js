#!/usr/bin/env node

/**
 * Test AI API Endpoints
 */

require('dotenv').config({ path: '.env.local' });

const BASE_URL = 'http://localhost:3002';

const tests = [
  {
    name: 'Chat',
    action: 'chat',
    data: { message: 'Hello, I need some support today', context: 'first time user' }
  },
  {
    name: 'Life Assessment',
    action: 'assess',
    data: {
      mumType: 'returning_to_work',
      name: 'Sarah',
      scores: { health: 6, mind: 5, relationships: 7, work: 4, nourish: 6 }
    }
  },
  {
    name: 'Sentiment Analysis',
    action: 'sentiment',
    data: { text: 'I feel overwhelmed but grateful for my family' }
  },
  {
    name: 'Recipe Generation',
    action: 'generate_recipe',
    data: { ingredients: 'chicken, rice, vegetables', time: '20' }
  },
  {
    name: 'Health Insight',
    action: 'health_insight',
    data: { sleep: 5, water: 4, burnout: 7 }
  },
  {
    name: 'Daily Affirmation',
    action: 'affirmation',
    data: { context: 'career comeback' }
  }
];

async function testAI() {
  console.log('🧪 Testing AI API Endpoints...\n');
  console.log(`📡 Server: ${BASE_URL}/api/ai\n`);

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      console.log(`Testing: ${test.name}`);
      
      const response = await fetch(`${BASE_URL}/api/ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: test.action, ...test.data })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      
      if (result.result) {
        console.log(`✅ ${test.name}: Success`);
        console.log(`   Response: ${typeof result.result === 'string' ? result.result.substring(0, 80) + '...' : JSON.stringify(result.result).substring(0, 80) + '...'}`);
        passed++;
      } else {
        console.log(`⚠️  ${test.name}: No result returned`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${test.name}: ${error.message}`);
      failed++;
    }
    console.log('');
  }

  console.log('─'.repeat(50));
  console.log(`\n📊 Results: ${passed} passed, ${failed} failed out of ${tests.length} tests\n`);

  if (failed === 0) {
    console.log('🎉 All AI endpoints are working!\n');
    return true;
  } else {
    console.log('⚠️  Some endpoints need attention\n');
    return false;
  }
}

testAI()
  .then(success => process.exit(success ? 0 : 1))
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });

// Made with Bob
