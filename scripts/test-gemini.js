// Test Google Gemini AI Integration
require('dotenv').config({ path: '.env.local' });

async function testGeminiIntegration() {
  console.log('🧪 Testing Google Gemini AI Integration...\n');

  try {
    // Test 1: Check API Key
    console.log('1️⃣ Checking API Key Configuration...');
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('❌ GEMINI_API_KEY not found in .env.local');
      return;
    }
    console.log('✅ API Key found:', apiKey.substring(0, 20) + '...\n');

    // Test 2: Import Gemini Client
    console.log('2️⃣ Testing Gemini Client Import...');
    const { generateText, analyzeSentiment } = require('../lib/gemini/client.ts');
    console.log('✅ Gemini client imported successfully\n');

    // Test 3: Simple Text Generation
    console.log('3️⃣ Testing Text Generation...');
    const response = await generateText('Say hello to SheCodes.AI in one sentence.', {
      maxTokens: 50,
      temperature: 0.7
    });
    console.log('✅ Response:', response, '\n');

    // Test 4: Sentiment Analysis
    console.log('4️⃣ Testing Sentiment Analysis...');
    const sentiment = await analyzeSentiment('I am feeling overwhelmed but hopeful about my career comeback.');
    console.log('✅ Sentiment:', JSON.stringify(sentiment, null, 2), '\n');

    // Test 5: Life Assessment
    console.log('5️⃣ Testing Life Assessment Generation...');
    const { generateLifeAssessment } = require('../lib/gemini/client.ts');
    const assessment = await generateLifeAssessment({
      mumType: 'working_mum',
      scores: { health: 6, mind: 7, relationships: 8, work: 5, nourish: 6 },
      name: 'Priya'
    });
    console.log('✅ Assessment:', assessment, '\n');

    console.log('🎉 All tests passed! Google Gemini AI is working correctly.');
    console.log('\n📊 Summary:');
    console.log('- API Key: ✅ Configured');
    console.log('- Text Generation: ✅ Working');
    console.log('- Sentiment Analysis: ✅ Working');
    console.log('- Life Assessment: ✅ Working');
    console.log('\n✨ SheCodes.AI is ready to help mothers everywhere!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('\nFull error:', error);
  }
}

testGeminiIntegration();

// Made with Bob
