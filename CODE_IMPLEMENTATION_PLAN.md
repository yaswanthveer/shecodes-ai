# Code Implementation Plan

This document outlines the specific code changes and scripts needed to complete the IBM Cloud integration. Use this as a reference when switching to Code mode.

## Files to Create

### 1. Environment Template (`.env.example`)
```bash
# IBM Cloud Platform API Key
IBM_CLOUD_API_KEY=ApiKey-ba67cf82-ab15-407a-818e-6999dbfeba72

# IBM Cloudant Database
CLOUDANT_URL=https://your-instance.cloudantnosqldb.appdomain.cloud
CLOUDANT_APIKEY=your-cloudant-service-key

# IBM watsonx.ai
WATSONX_API_KEY=your-watsonx-api-key
WATSONX_PROJECT_ID=your-project-id
WATSONX_URL=https://us-south.ml.cloud.ibm.com
```

### 2. Database Setup Script (`scripts/setup-database.ts`)

**Purpose**: Initialize Cloudant databases with proper schemas and indexes

**Key Functions**:
- Connect to Cloudant using credentials
- Create databases: users, journals, assessments, recipes, career
- Set up indexes for efficient queries
- Create initial design documents
- Validate database structure

**Implementation**:
```typescript
import { getCloudantClient } from '../lib/cloudant/client';

const DATABASES = ['users', 'journals', 'assessments', 'recipes', 'career'];

async function setupDatabases() {
  const client = getCloudantClient();
  
  for (const dbName of DATABASES) {
    try {
      await client.putDatabase({ db: dbName });
      console.log(`✓ Created database: ${dbName}`);
    } catch (error) {
      if (error.status === 412) {
        console.log(`✓ Database exists: ${dbName}`);
      } else {
        throw error;
      }
    }
  }
  
  // Create indexes
  await createIndexes(client);
}
```

### 3. Database Admin Utilities (`lib/cloudant/databaseAdmin.ts`)

**Purpose**: Administrative functions for database management

**Key Functions**:
- `createDatabase(name: string)` - Create new database
- `deleteDatabase(name: string)` - Delete database
- `listDatabases()` - List all databases
- `createIndex(db: string, fields: string[])` - Create query index
- `getDbInfo(name: string)` - Get database statistics

### 4. Test Scripts

#### `scripts/test-cloudant.ts`
```typescript
import { getCloudantClient } from '../lib/cloudant/client';

async function testCloudant() {
  const client = getCloudantClient();
  
  // Test 1: List databases
  const dbs = await client.getAllDbs();
  console.log('Databases:', dbs);
  
  // Test 2: Create test document
  const testDoc = {
    _id: 'test_' + Date.now(),
    type: 'test',
    message: 'Hello from Her.comeback.ai'
  };
  
  await client.postDocument({
    db: 'users',
    document: testDoc
  });
  
  console.log('✓ Cloudant connection successful');
}
```

#### `scripts/test-watsonx.ts`
```typescript
import { generateText } from '../lib/watsonx/client';

async function testWatsonx() {
  const prompt = 'Hello, this is a test message for Her.comeback.ai';
  const response = await generateText(prompt);
  
  console.log('Prompt:', prompt);
  console.log('Response:', response);
  console.log('✓ watsonx.ai connection successful');
}
```

### 5. Package.json Scripts

Add to `package.json`:
```json
{
  "scripts": {
    "setup:db": "tsx scripts/setup-database.ts",
    "test:cloudant": "tsx scripts/test-cloudant.ts",
    "test:watsonx": "tsx scripts/test-watsonx.ts",
    "test:services": "npm run test:cloudant && npm run test:watsonx"
  }
}
```

## Files to Modify

### 1. `lib/cloudant/client.ts`

**Changes Needed**:
- Add better error handling
- Add connection retry logic
- Add logging for debugging
- Export additional helper functions

**Enhancements**:
```typescript
export function getCloudantClient(): CloudantV1 {
  if (cloudantClient) return cloudantClient;

  if (!apiKey || !url) {
    throw new Error(
      'IBM Cloudant credentials missing. Please set CLOUDANT_URL and CLOUDANT_APIKEY in .env.local'
    );
  }

  try {
    const authenticator = new IamAuthenticator({
      apikey: apiKey,
    });

    cloudantClient = CloudantV1.newInstance({
      authenticator: authenticator,
    });
    
    cloudantClient.setServiceUrl(url);
    
    console.log('✓ Cloudant client initialized');
    return cloudantClient;
  } catch (error) {
    console.error('Failed to initialize Cloudant client:', error);
    throw error;
  }
}

// Add helper functions
export async function testConnection(): Promise<boolean> {
  try {
    const client = getCloudantClient();
    await client.getAllDbs();
    return true;
  } catch {
    return false;
  }
}
```

### 2. `lib/watsonx/client.ts`

**Changes Needed**:
- Improve error messages
- Add token refresh logic
- Add request logging
- Better fallback handling

**Enhancements**:
```typescript
async function getAccessToken(): Promise<string> {
  if (accessToken && Date.now() < tokenExpiry) return accessToken;

  if (!WATSONX_API_KEY) {
    throw new Error('WATSONX_API_KEY not set in environment');
  }

  try {
    const res = await fetch("https://iam.cloud.ibm.com/identity/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${WATSONX_API_KEY}`,
    });

    if (!res.ok) {
      throw new Error(`Token request failed: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    accessToken = data.access_token;
    tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;
    
    console.log('✓ watsonx.ai token refreshed');
    return accessToken!;
  } catch (error) {
    console.error('Failed to get watsonx.ai access token:', error);
    throw error;
  }
}
```

### 3. `app/api/data/route.ts`

**Enhancements Needed**:
- Add proper error handling
- Implement CRUD operations
- Add request validation
- Add response formatting

### 4. `app/api/ai/route.ts`

**Enhancements Needed**:
- Add request validation
- Implement streaming responses
- Add rate limiting
- Better error messages

## Implementation Order

### Phase 1: Environment Setup (Code Mode)
1. Create `.env.local` with API key
2. Create `.env.example` template
3. Update `.gitignore` if needed

### Phase 2: Database Scripts (Code Mode)
1. Create `scripts/setup-database.ts`
2. Create `scripts/test-cloudant.ts`
3. Create `scripts/test-watsonx.ts`
4. Update `package.json` with new scripts

### Phase 3: Client Enhancements (Code Mode)
1. Enhance `lib/cloudant/client.ts`
2. Create `lib/cloudant/databaseAdmin.ts`
3. Enhance `lib/watsonx/client.ts`

### Phase 4: Testing & Validation (Code/Advanced Mode)
1. Run IBM Cloud CLI commands
2. Execute setup scripts
3. Test database connections
4. Test AI endpoints
5. Validate all features

### Phase 5: Documentation Updates (Plan Mode)
1. Update README with actual credentials
2. Document any issues encountered
3. Create troubleshooting guide

## CLI Commands to Execute

These commands should be run in Code or Advanced mode:

```bash
# 1. Install IBM Cloud CLI
curl -fsSL https://clis.cloud.ibm.com/install/osx | sh

# 2. Login
ibmcloud login --apikey ApiKey-ba67cf82-ab15-407a-818e-6999dbfeba72 -r us-south

# 3. List existing services
ibmcloud resource service-instances

# 4. Create Cloudant (if needed)
ibmcloud resource service-instance-create her-cloudant-db cloudantnosqldb lite us-south

# 5. Create credentials
ibmcloud resource service-key-create her-cloudant-credentials Manager --instance-name her-cloudant-db

# 6. Get credentials
ibmcloud resource service-key her-cloudant-credentials --output json

# 7. Install dependencies
npm install tsx --save-dev

# 8. Run setup
npm run setup:db

# 9. Test connections
npm run test:services
```

## Success Criteria

- [ ] `.env.local` created with all credentials
- [ ] IBM Cloud CLI installed and authenticated
- [ ] Cloudant instance created/verified
- [ ] watsonx project created/verified
- [ ] All databases created successfully
- [ ] Database indexes created
- [ ] Cloudant connection test passes
- [ ] watsonx.ai connection test passes
- [ ] API routes return valid responses
- [ ] No errors in console logs
- [ ] Documentation updated with actual setup

## Rollback Plan

If issues occur:
1. Keep backup of original files
2. Document error messages
3. Check IBM Cloud console for service status
4. Verify credentials are correct
5. Test with minimal configuration first
6. Gradually add features

## Next Steps After Implementation

1. User authentication system
2. Data migration (if needed)
3. Monitoring and logging setup
4. Performance optimization
5. Production deployment preparation

---

**Ready to implement?** Switch to Code mode and follow this plan step-by-step.