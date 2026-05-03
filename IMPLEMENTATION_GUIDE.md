# IBM Cloud Implementation Guide - Step by Step

This guide provides detailed commands and instructions for setting up IBM Cloud services for the Her.comeback.ai platform.

## Prerequisites

- Node.js 20+ installed
- npm or yarn package manager
- IBM Cloud account with API key: `ApiKey-ba67cf82-ab15-407a-818e-6999dbfeba72`
- Terminal access

## Step 1: Environment Configuration

Create a `.env.local` file in the project root:

```bash
# IBM Cloud Platform API Key
IBM_CLOUD_API_KEY=ApiKey-ba67cf82-ab15-407a-818e-6999dbfeba72

# Cloudant Database (will be populated after setup)
CLOUDANT_URL=
CLOUDANT_APIKEY=

# watsonx.ai (will be populated after setup)
WATSONX_API_KEY=
WATSONX_PROJECT_ID=
WATSONX_URL=https://us-south.ml.cloud.ibm.com
```

## Step 2: Install IBM Cloud CLI

### macOS
```bash
curl -fsSL https://clis.cloud.ibm.com/install/osx | sh
```

### Linux
```bash
curl -fsSL https://clis.cloud.ibm.com/install/linux | sh
```

### Windows (PowerShell)
```powershell
iex(New-Object Net.WebClient).DownloadString('https://clis.cloud.ibm.com/install/powershell')
```

### Verify Installation
```bash
ibmcloud --version
```

## Step 3: Authenticate with IBM Cloud

```bash
# Login using API key
ibmcloud login --apikey ApiKey-ba67cf82-ab15-407a-818e-6999dbfeba72

# Select your region (e.g., us-south)
ibmcloud target -r us-south

# Verify authentication
ibmcloud account show
```

## Step 4: Check Existing Services

```bash
# List all service instances
ibmcloud resource service-instances

# Check for Cloudant instances
ibmcloud resource service-instances --service-name cloudantnosqldb

# Check for watsonx instances
ibmcloud resource service-instances --service-name pm-20
```

## Step 5: Create Cloudant Database Instance (if needed)

```bash
# Create Cloudant instance (Lite plan - free)
ibmcloud resource service-instance-create shecodes-cloudant-db \
  cloudantnosqldb lite us-south

# Wait for provisioning (check status)
ibmcloud resource service-instance shecodes-cloudant-db

# Create service credentials
ibmcloud resource service-key-create shecodes-cloudant-credentials \
  Manager --instance-name shecodes-cloudant-db

# Retrieve credentials
ibmcloud resource service-key shecodes-cloudant-credentials --output json
```

**Copy the following from the output:**
- `url` → Update `CLOUDANT_URL` in `.env.local`
- `apikey` → Update `CLOUDANT_APIKEY` in `.env.local`

## Step 6: Create watsonx.ai Project

### Option A: Using IBM Cloud Console (Recommended)
1. Go to https://dataplatform.cloud.ibm.com/
2. Click "Create a project" → "Create an empty project"
3. Name it "SheCodes AI Platform"
4. Note the Project ID from the project settings
5. Update `WATSONX_PROJECT_ID` in `.env.local`

### Option B: Using CLI
```bash
# Install Watson Machine Learning plugin
ibmcloud plugin install machine-learning

# Create Watson Machine Learning instance
ibmcloud resource service-instance-create shecodes-watsonx-ml \
  pm-20 lite us-south

# Create service credentials
ibmcloud resource service-key-create shecodes-watsonx-credentials \
  Manager --instance-name shecodes-watsonx-ml

# Retrieve credentials
ibmcloud resource service-key shecodes-watsonx-credentials --output json
```

**Update `.env.local`:**
- Use the platform API key or service-specific key for `WATSONX_API_KEY`
- Get Project ID from the console

## Step 7: Initialize Cloudant Databases

Create a setup script to initialize databases:

```bash
# Run the database initialization script
npm run setup:db
```

Or manually using the Cloudant dashboard:
1. Go to https://cloud.ibm.com/resources
2. Find your Cloudant instance
3. Click "Launch Dashboard"
4. Create these databases:
   - `users`
   - `journals`
   - `assessments`
   - `recipes`
   - `career`

## Step 8: Test Connections

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Test API endpoints
curl http://localhost:3000/api/data
curl http://localhost:3000/api/ai
```

## Step 9: Verify Setup

### Test Cloudant Connection
```bash
# Create a test script
node -e "
const { getCloudantClient } = require('./lib/cloudant/client.ts');
const client = getCloudantClient();
client.getAllDbs().then(dbs => console.log('Databases:', dbs));
"
```

### Test watsonx.ai Connection
```bash
# Test AI generation
curl -X POST http://localhost:3000/api/ai \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Hello, test message"}'
```

## Troubleshooting

### Issue: Authentication Failed
```bash
# Re-login with API key
ibmcloud login --apikey ApiKey-ba67cf82-ab15-407a-818e-6999dbfeba72 -r us-south
```

### Issue: Service Not Found
```bash
# List available services in your region
ibmcloud catalog service-marketplace

# Check service availability
ibmcloud target
```

### Issue: Cloudant Connection Error
- Verify `CLOUDANT_URL` starts with `https://`
- Ensure `CLOUDANT_APIKEY` is the service-specific key, not platform key
- Check network connectivity

### Issue: watsonx.ai Token Error
- Verify API key has access to Watson Machine Learning
- Check project ID is correct
- Ensure region matches (us-south)

## Security Best Practices

1. **Never commit `.env.local`** - Already in `.gitignore`
2. **Rotate API keys regularly** - Every 90 days recommended
3. **Use service-specific credentials** - Not platform API key for services
4. **Enable audit logging** - Track API usage
5. **Set up alerts** - Monitor for unusual activity

## Cost Management

### Monitor Usage
```bash
# Check current usage
ibmcloud billing account-usage

# View service instances
ibmcloud resource service-instances
```

### Upgrade Plans When Needed
- **Cloudant Lite**: 1GB storage, 20 lookups/sec (Free)
- **Cloudant Standard**: Pay-as-you-go, higher throughput
- **watsonx.ai**: Token-based pricing, monitor usage

## Next Steps

1. ✅ Complete environment setup
2. ✅ Test all connections
3. 🔄 Implement user authentication
4. 🔄 Build data models and schemas
5. 🔄 Create API endpoints
6. 🔄 Test AI features end-to-end
7. 🔄 Deploy to production

## Support & Resources

- **IBM Cloud Support**: https://cloud.ibm.com/unifiedsupport/supportcenter
- **Cloudant Docs**: https://cloud.ibm.com/docs/Cloudant
- **watsonx.ai Docs**: https://dataplatform.cloud.ibm.com/docs/content/wsj/getting-started/welcome-main.html
- **Community Forum**: https://community.ibm.com/community/user/watsonai/home

---

**Ready to implement?** Switch to Code mode to execute these steps automatically.