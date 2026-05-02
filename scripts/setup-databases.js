#!/usr/bin/env node

/**
 * Database Setup Script for Her.comeback.ai
 * Initializes all required Cloudant databases
 */

const { CloudantV1 } = require('@ibm-cloud/cloudant');
const { IamAuthenticator } = require('ibm-cloud-sdk-core');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const apiKey = process.env.CLOUDANT_APIKEY;
const url = process.env.CLOUDANT_URL;

if (!apiKey || !url) {
  console.error('❌ Error: CLOUDANT_APIKEY and CLOUDANT_URL must be set in .env.local');
  process.exit(1);
}

// Initialize Cloudant client
const authenticator = new IamAuthenticator({ apikey: apiKey });
const cloudant = CloudantV1.newInstance({ authenticator });
cloudant.setServiceUrl(url);

// Databases to create
const databases = [
  {
    name: 'users',
    description: 'User profiles and authentication data',
    indexes: [
      { name: 'by-email', fields: ['email'] },
      { name: 'by-created', fields: ['createdAt'] }
    ]
  },
  {
    name: 'journals',
    description: 'Daily journal entries with sentiment analysis',
    indexes: [
      { name: 'by-user', fields: ['userId', 'createdAt'] },
      { name: 'by-sentiment', fields: ['sentiment', 'createdAt'] }
    ]
  },
  {
    name: 'assessments',
    description: 'Life assessment scores and AI insights',
    indexes: [
      { name: 'by-user', fields: ['userId', 'createdAt'] }
    ]
  },
  {
    name: 'recipes',
    description: 'Generated recipes and meal plans',
    indexes: [
      { name: 'by-user', fields: ['userId', 'createdAt'] }
    ]
  },
  {
    name: 'career',
    description: 'Career comeback data, resumes, and progress',
    indexes: [
      { name: 'by-user', fields: ['userId', 'createdAt'] }
    ]
  }
];

async function setupDatabases() {
  console.log('🚀 Starting database setup...\n');

  try {
    // Get existing databases
    const { result: existingDbs } = await cloudant.getAllDbs();
    console.log(`📊 Found ${existingDbs.length} existing databases\n`);

    for (const db of databases) {
      console.log(`📁 Processing database: ${db.name}`);
      console.log(`   Description: ${db.description}`);

      try {
        if (existingDbs.includes(db.name)) {
          console.log(`   ✓ Database already exists`);
        } else {
          // Create database
          await cloudant.putDatabase({ db: db.name });
          console.log(`   ✓ Database created successfully`);
        }

        // Create indexes
        for (const index of db.indexes) {
          try {
            await cloudant.postIndex({
              db: db.name,
              index: {
                fields: index.fields
              },
              name: index.name,
              type: 'json'
            });
            console.log(`   ✓ Index created: ${index.name} on [${index.fields.join(', ')}]`);
          } catch (indexError) {
            if (indexError.message.includes('already exists')) {
              console.log(`   ✓ Index already exists: ${index.name}`);
            } else {
              console.log(`   ⚠️  Index creation warning: ${indexError.message}`);
            }
          }
        }

        console.log('');
      } catch (error) {
        console.error(`   ❌ Error with database ${db.name}:`, error.message);
        console.log('');
      }
    }

    // Verify setup
    console.log('🔍 Verifying database setup...\n');
    const { result: finalDbs } = await cloudant.getAllDbs();
    const createdDbs = databases.filter(db => finalDbs.includes(db.name));
    
    console.log(`✅ Setup complete!`);
    console.log(`   Created/Verified: ${createdDbs.length}/${databases.length} databases`);
    console.log(`   Databases: ${createdDbs.map(db => db.name).join(', ')}\n`);

    if (createdDbs.length === databases.length) {
      console.log('🎉 All databases are ready for use!\n');
      return true;
    } else {
      console.log('⚠️  Some databases may need manual attention\n');
      return false;
    }

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Verify CLOUDANT_APIKEY and CLOUDANT_URL in .env.local');
    console.error('2. Check IBM Cloud service status');
    console.error('3. Ensure API key has Manager permissions\n');
    return false;
  }
}

// Run setup
setupDatabases()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });

// Made with Bob
