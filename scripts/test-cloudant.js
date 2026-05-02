#!/usr/bin/env node

/**
 * Test Cloudant Connection
 */

const { CloudantV1 } = require('@ibm-cloud/cloudant');
const { IamAuthenticator } = require('ibm-cloud-sdk-core');

require('dotenv').config({ path: '.env.local' });

const apiKey = process.env.CLOUDANT_APIKEY;
const url = process.env.CLOUDANT_URL;

async function testCloudant() {
  console.log('🧪 Testing Cloudant Connection...\n');

  if (!apiKey || !url) {
    console.error('❌ Missing credentials in .env.local');
    return false;
  }

  try {
    const authenticator = new IamAuthenticator({ apikey: apiKey });
    const cloudant = CloudantV1.newInstance({ authenticator });
    cloudant.setServiceUrl(url);

    console.log('📡 Connecting to Cloudant...');
    const { result: dbs } = await cloudant.getAllDbs();
    
    console.log(`✅ Connection successful!`);
    console.log(`📊 Found ${dbs.length} databases:\n`);
    
    const appDbs = ['users', 'journals', 'assessments', 'recipes', 'career'];
    appDbs.forEach(db => {
      const exists = dbs.includes(db);
      console.log(`   ${exists ? '✓' : '✗'} ${db}`);
    });

    console.log('\n🎉 Cloudant is ready!\n');
    return true;
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    return false;
  }
}

testCloudant()
  .then(success => process.exit(success ? 0 : 1))
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });

// Made with Bob
