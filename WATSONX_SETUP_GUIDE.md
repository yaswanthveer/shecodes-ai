# watsonx.ai Setup Guide

Complete guide to configure IBM watsonx.ai for Her.comeback.ai

---

## 🎯 Overview

This guide will help you set up IBM watsonx.ai to enable real AI-powered responses instead of mock fallbacks.

**Current Status**: ⚠️ Using mock responses  
**Goal**: ✅ Configure real watsonx.ai integration  
**Time Required**: 15-20 minutes

---

## 📋 Prerequisites

- ✅ IBM Cloud account
- ✅ IBM Cloud API Key: `ApiKey-ba67cf82-ab15-407a-818e-6999dbfeba72`
- ✅ Access to IBM Cloud Console
- ⚠️ IBM Cloud CLI (optional, requires sudo)

---

## 🚀 Setup Methods

### Method 1: Web Console (Recommended)

#### Step 1: Access watsonx.ai Platform
1. Go to https://dataplatform.cloud.ibm.com/
2. Log in with your IBM Cloud credentials
3. You'll be redirected to IBM Cloud Pak for Data

#### Step 2: Create a Project
1. Click **"Projects"** in the left sidebar
2. Click **"New project"** button
3. Select **"Create an empty project"**
4. Fill in project details:
   - **Name**: `SheCodes AI Platform`
   - **Description**: `AI companion for mothers - SheCodes.AI`
   - **Storage**: Select existing Cloud Object Storage or create new
5. Click **"Create"**

#### Step 3: Get Project ID
1. Once project is created, click on it
2. Go to **"Manage"** tab
3. Click **"General"** in the left menu
4. Copy the **Project ID** (format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)
5. Save this for later

#### Step 4: Get API Key
You can use your existing platform API key or create a service-specific one:

**Option A: Use Platform API Key** (Easiest)
- Use: `ApiKey-ba67cf82-ab15-407a-818e-6999dbfeba72`

**Option B: Create Service-Specific Key**
1. Go to https://cloud.ibm.com/iam/apikeys
2. Click **"Create"**
3. Name: `Her-watsonx-ai`
4. Description: `API key for watsonx.ai integration`
5. Click **"Create"**
6. **Copy and save the key immediately** (you won't see it again)

#### Step 5: Update Environment Variables
Edit `.env.local` in your project root:

```bash
# watsonx.ai Configuration
WATSONX_API_KEY=ApiKey-ba67cf82-ab15-407a-818e-6999dbfeba72
WATSONX_PROJECT_ID=your-project-id-here
WATSONX_URL=https://us-south.ml.cloud.ibm.com
```

Replace `your-project-id-here` with the Project ID from Step 3.

#### Step 6: Verify Setup
```bash
# Restart the development server
npm run dev

# Test AI endpoints
npm run test:ai
```

---

### Method 2: IBM Cloud CLI (Requires sudo)

#### Step 1: Install IBM Cloud CLI
```bash
# macOS
curl -fsSL https://clis.cloud.ibm.com/install/osx | sh

# Linux
curl -fsSL https://clis.cloud.ibm.com/install/linux | sh
```

#### Step 2: Login
```bash
ibmcloud login --apikey ApiKey-ba67cf82-ab15-407a-818e-6999dbfeba72
ibmcloud target -r us-south
```

#### Step 3: Install Watson Machine Learning Plugin
```bash
ibmcloud plugin install machine-learning
```

#### Step 4: Create Watson Machine Learning Instance
```bash
# Create instance (Lite plan - free)
ibmcloud resource service-instance-create shecodes-watsonx-ml \
  pm-20 lite us-south

# Wait for provisioning
ibmcloud resource service-instance shecodes-watsonx-ml
```

#### Step 5: Create Service Credentials
```bash
# Create credentials
ibmcloud resource service-key-create shecodes-watsonx-credentials \
  Manager --instance-name shecodes-watsonx-ml

# Get credentials
ibmcloud resource service-key shecodes-watsonx-credentials --output json
```

#### Step 6: Create Project via API
```bash
# Get access token
TOKEN=$(ibmcloud iam oauth-tokens --output json | jq -r '.iam_token')

# Create project (requires Cloud Object Storage)
curl -X POST "https://api.dataplatform.cloud.ibm.com/v2/projects" \
  -H "Authorization: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "SheCodes AI Platform",
    "description": "AI companion for mothers",
    "storage": {
      "type": "bmcos_object_storage",
      "guid": "your-cos-instance-guid"
    }
  }'
```

---

## 🧪 Testing watsonx.ai Integration

### Test 1: Basic Connection
```bash
npm run test:ai
```

Expected output:
```
✅ Chat: Success (real AI response)
✅ Life Assessment: Success (personalized)
✅ Sentiment Analysis: Success
✅ Recipe Generation: Success
✅ Health Insight: Success
✅ Daily Affirmation: Success
```

### Test 2: Manual API Test
```bash
curl -X POST http://localhost:3002/api/ai \
  -H "Content-Type: application/json" \
  -d '{
    "action": "chat",
    "message": "I need support with work-life balance"
  }'
```

### Test 3: Check Logs
Look for these in the terminal:
- ✅ No "watsonx error" messages
- ✅ Real AI responses (not mock fallbacks)
- ✅ Token usage logged

---

## 🔍 Troubleshooting

### Issue 1: "watsonx error: 401 Unauthorized"
**Cause**: Invalid or expired API key  
**Solution**:
1. Verify API key in `.env.local`
2. Check key hasn't been deleted in IBM Cloud
3. Try creating a new API key

### Issue 2: "watsonx error: 403 Forbidden"
**Cause**: API key lacks permissions  
**Solution**:
1. Ensure API key has "Manager" or "Writer" role
2. Check project access permissions
3. Verify project ID is correct

### Issue 3: "watsonx error: 404 Not Found"
**Cause**: Invalid project ID or URL  
**Solution**:
1. Double-check project ID from console
2. Verify WATSONX_URL is correct for your region
3. Ensure project exists and is active

### Issue 4: Still Getting Mock Responses
**Cause**: Environment variables not loaded  
**Solution**:
1. Restart development server: `npm run dev`
2. Check `.env.local` file exists and has correct values
3. Verify no typos in variable names

### Issue 5: "Rate limit exceeded"
**Cause**: Too many API calls  
**Solution**:
1. Wait a few minutes
2. Implement request throttling
3. Consider upgrading plan if needed

---

## 💰 Cost Management

### Free Tier (Lite Plan)
- **Included**: Limited tokens per month
- **Cost**: $0
- **Limits**: Check IBM Cloud dashboard

### Pay-As-You-Go
- **Pricing**: Token-based
- **Typical Cost**: $0.01 - $0.10 per 1000 tokens
- **Monitoring**: IBM Cloud dashboard → Usage

### Cost Optimization Tips
1. Cache common responses
2. Use shorter prompts when possible
3. Implement request throttling
4. Monitor usage regularly
5. Set up billing alerts

---

## 🎨 AI Model Configuration

### Current Model
```javascript
model: "ibm/granite-13b-instruct-v2"
```

### Available Models
- `ibm/granite-13b-instruct-v2` - General purpose (recommended)
- `ibm/granite-13b-chat-v2` - Conversational
- `meta-llama/llama-2-70b-chat` - Advanced (higher cost)

### Adjusting Parameters
Edit `lib/watsonx/client.ts`:

```javascript
parameters: {
  decoding_method: "greedy",
  max_new_tokens: 500,        // Adjust response length
  temperature: 0.7,           // 0.0-1.0 (creativity)
  repetition_penalty: 1.1,    // Reduce repetition
}
```

---

## 📊 Monitoring & Analytics

### Check Usage
1. Go to https://cloud.ibm.com/billing/usage
2. Select "Watson Machine Learning"
3. View token usage and costs

### Set Up Alerts
1. Go to https://cloud.ibm.com/billing/spending
2. Click "Create alert"
3. Set threshold (e.g., $10/month)
4. Add email notification

### Track Performance
Monitor in application logs:
- Response times
- Token usage per request
- Error rates
- User satisfaction

---

## 🔐 Security Best Practices

### API Key Management
- ✅ Store in `.env.local` (gitignored)
- ✅ Never commit to version control
- ✅ Rotate keys every 90 days
- ✅ Use service-specific keys when possible
- ✅ Revoke unused keys immediately

### Access Control
- Limit API key permissions to minimum required
- Use separate keys for dev/staging/production
- Monitor API key usage regularly
- Set up alerts for unusual activity

### Data Privacy
- Don't log sensitive user data
- Implement data retention policies
- Follow GDPR/privacy regulations
- Encrypt data in transit and at rest

---

## ✅ Verification Checklist

Before going to production:

- [ ] watsonx.ai project created
- [ ] Project ID obtained and configured
- [ ] API key configured in `.env.local`
- [ ] Development server restarted
- [ ] All AI tests passing (6/6)
- [ ] Real AI responses confirmed (not mocks)
- [ ] Cost monitoring set up
- [ ] Billing alerts configured
- [ ] API key permissions verified
- [ ] Security best practices implemented

---

## 🆘 Getting Help

### IBM Cloud Support
- Console: https://cloud.ibm.com/unifiedsupport/supportcenter
- Documentation: https://cloud.ibm.com/docs/watson-machine-learning
- Community: https://community.ibm.com/

### watsonx.ai Resources
- Platform: https://dataplatform.cloud.ibm.com/
- Docs: https://dataplatform.cloud.ibm.com/docs
- API Reference: https://cloud.ibm.com/apidocs/machine-learning

### Project Resources
- Test Report: `TEST_REPORT.md`
- Implementation Guide: `IMPLEMENTATION_GUIDE.md`
- Architecture: `IBM_CLOUD_SETUP.md`

---

## 🎉 Success!

Once configured, you'll have:
- ✅ Real AI-powered conversations
- ✅ Personalized life assessments
- ✅ Intelligent sentiment analysis
- ✅ Custom recipe generation
- ✅ Empathetic health insights
- ✅ Context-aware affirmations

**Your AI companion is ready to support mothers on their journey!** 🌸

---

**Last Updated**: May 2, 2026  
**Status**: Ready for configuration  
**Next Step**: Follow Method 1 (Web Console) to set up watsonx.ai