# Quick Start Guide - IBM Cloud Setup

This is a condensed version of the setup process. For detailed instructions, see [`IMPLEMENTATION_GUIDE.md`](./IMPLEMENTATION_GUIDE.md).

## ⚡ 5-Minute Setup

### 1. Create Environment File

Create `.env.local` in project root:

```bash
IBM_CLOUD_API_KEY=ApiKey-ba67cf82-ab15-407a-818e-6999dbfeba72
CLOUDANT_URL=
CLOUDANT_APIKEY=
WATSONX_API_KEY=
WATSONX_PROJECT_ID=
WATSONX_URL=https://us-south.ml.cloud.ibm.com
```

### 2. Install IBM Cloud CLI

**macOS/Linux:**
```bash
curl -fsSL https://clis.cloud.ibm.com/install/osx | sh
```

**Windows:**
```powershell
iex(New-Object Net.WebClient).DownloadString('https://clis.cloud.ibm.com/install/powershell')
```

### 3. Login to IBM Cloud

```bash
ibmcloud login --apikey ApiKey-ba67cf82-ab15-407a-818e-6999dbfeba72 -r us-south
```

### 4. Check Existing Services

```bash
# List all services
ibmcloud resource service-instances

# Check for Cloudant
ibmcloud resource service-instances --service-name cloudantnosqldb

# Check for watsonx
ibmcloud resource service-instances --service-name pm-20
```

### 5. Create Services (if needed)

**Cloudant:**
```bash
ibmcloud resource service-instance-create shecodes-cloudant-db cloudantnosqldb lite us-south
ibmcloud resource service-key-create shecodes-cloudant-credentials Manager --instance-name shecodes-cloudant-db
ibmcloud resource service-key shecodes-cloudant-credentials --output json
```

**watsonx.ai:**
- Go to https://dataplatform.cloud.ibm.com/
- Create project → "SheCodes AI Platform"
- Copy Project ID

### 6. Update `.env.local`

Copy credentials from step 5 into your `.env.local` file.

### 7. Install & Run

```bash
npm install
npm run dev
```

Visit http://localhost:3000

## 🔍 Verify Setup

### Test Cloudant
```bash
curl http://localhost:3000/api/data
```

### Test watsonx.ai
```bash
curl -X POST http://localhost:3000/api/ai \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Hello"}'
```

## 📋 Checklist

- [ ] `.env.local` created with API key
- [ ] IBM Cloud CLI installed
- [ ] Authenticated with IBM Cloud
- [ ] Cloudant instance created/found
- [ ] Cloudant credentials added to `.env.local`
- [ ] watsonx project created
- [ ] watsonx credentials added to `.env.local`
- [ ] Dependencies installed (`npm install`)
- [ ] Dev server running (`npm run dev`)
- [ ] API endpoints responding

## 🆘 Common Issues

**"Authentication failed"**
```bash
ibmcloud login --apikey ApiKey-ba67cf82-ab15-407a-818e-6999dbfeba72 -r us-south
```

**"Service not found"**
- Check region: `ibmcloud target`
- List available services: `ibmcloud catalog service-marketplace`

**"Cloudant connection error"**
- Verify URL format: `https://[instance].cloudantnosqldb.appdomain.cloud`
- Use service-specific API key, not platform key

**"watsonx token error"**
- Verify project ID is correct
- Check API key has Watson ML access
- Ensure region matches (us-south)

## 📚 Next Steps

1. ✅ Complete this quick start
2. 📖 Read [`IMPLEMENTATION_GUIDE.md`](./IMPLEMENTATION_GUIDE.md) for details
3. 🏗️ Review [`IBM_CLOUD_SETUP.md`](./IBM_CLOUD_SETUP.md) for architecture
4. 💻 Switch to Code mode to implement features
5. 🧪 Test all features end-to-end

## 🔗 Resources

- [IBM Cloud Console](https://cloud.ibm.com/)
- [Cloudant Dashboard](https://cloud.ibm.com/resources)
- [watsonx.ai Platform](https://dataplatform.cloud.ibm.com/)
- [IBM Cloud CLI Docs](https://cloud.ibm.com/docs/cli)

---

**Need help?** See [`IMPLEMENTATION_GUIDE.md`](./IMPLEMENTATION_GUIDE.md) for detailed troubleshooting.