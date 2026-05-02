# SheCodes.AI 🌸

An AI-powered companion platform for mothers navigating life transitions, career comebacks, and personal growth. Built with Next.js, IBM Cloudant, and Google Gemini AI.

## 🎯 Overview

SheCodes.AI is an empathetic AI platform designed specifically for mothers who are:
- Returning to work after a career break
- Managing work-life balance
- Seeking personal growth and wellness
- Building meaningful relationships
- Navigating life transitions

## 🏗️ Architecture

- **Frontend**: Next.js 16 with React 19, TypeScript, Tailwind CSS
- **Database**: IBM Cloudant (NoSQL)
- **AI/ML**: Google Gemini AI (gemini-1.5-flash)
- **State Management**: Zustand
- **UI Components**: Radix UI, Framer Motion, Three.js

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- npm or yarn
- Google Gemini API key
- IBM Cloud account (for Cloudant database)

### 1. Clone and Install

```bash
git clone <repository-url>
cd hercomeback.ai
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file with:

```bash
# Google Gemini AI
GEMINI_API_KEY=your-gemini-api-key

# IBM Cloudant Database
CLOUDANT_URL=https://your-instance.cloudantnosqldb.appdomain.cloud
CLOUDANT_APIKEY=your-cloudant-service-key
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
hercomeback.ai/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── ai/           # Gemini AI endpoints
│   │   └── data/         # Cloudant data endpoints
│   ├── dashboard/        # User dashboard
│   ├── assessment/       # Life assessment tool
│   ├── work/            # Career comeback features
│   ├── health/          # Wellness tracking
│   ├── mind/            # Mental health support
│   ├── relationships/   # Relationship guidance
│   └── nourish/         # Nutrition & recipes
├── components/           # React components
│   ├── layout/          # Layout components
│   ├── AIChatWidget.tsx # AI chat interface
│   └── InlineAIChat.tsx # Inline chat component
├── lib/                 # Core libraries
│   ├── cloudant/        # Cloudant database client
│   └── gemini/          # Google Gemini AI client
└── public/              # Static assets
```

## 🔧 Environment Variables

Create a `.env.local` file with:

```bash
# Google Gemini AI
GEMINI_API_KEY=your-gemini-api-key

# IBM Cloudant Database
CLOUDANT_URL=https://your-instance.cloudantnosqldb.appdomain.cloud
CLOUDANT_APIKEY=your-cloudant-service-key
```

## 🎨 Features

### Core Features
- **AI Chat Companion**: Empathetic conversations powered by Google Gemini
- **Life Assessment**: Track wellness across 5 dimensions (Health, Mind, Relationships, Work, Nourish)
- **Career Comeback**: Resume rebuilding and career transition support
- **Journal with Sentiment Analysis**: Daily journaling with AI insights
- **Recipe Generator**: Personalized meal plans based on available ingredients
- **Community Support**: Connect with other mothers on similar journeys

### AI Capabilities
- Text generation using Google Gemini 1.5 Flash
- Sentiment analysis for journal entries
- Personalized life coaching
- Career advice and resume optimization
- Nutrition guidance

## 🗄️ Database Schema

### Collections

**users**
```json
{
  "_id": "user_[uuid]",
  "email": "string",
  "name": "string",
  "mumType": "working_mum|stay_at_home|returning_to_work|single_mum",
  "createdAt": "timestamp"
}
```

**journals**
```json
{
  "_id": "journal_[uuid]",
  "userId": "string",
  "content": "string",
  "sentiment": "positive|negative|neutral",
  "emotions": ["array"],
  "aiResponse": "string",
  "createdAt": "timestamp"
}
```

**assessments**
```json
{
  "_id": "assessment_[uuid]",
  "userId": "string",
  "scores": {
    "health": "number",
    "mind": "number",
    "relationships": "number",
    "work": "number",
    "nourish": "number"
  },
  "aiInsights": "string",
  "createdAt": "timestamp"
}
```

## 🛠️ Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### API Routes

- `GET/POST /api/data` - Cloudant database operations
- `POST /api/ai` - Google Gemini AI text generation

## 📚 Documentation

- [`IMPLEMENTATION_GUIDE.md`](./IMPLEMENTATION_GUIDE.md) - Detailed setup instructions
- [`IBM_CLOUD_SETUP.md`](./IBM_CLOUD_SETUP.md) - Cloudant database setup
- [`AGENTS.md`](./AGENTS.md) - Agent rules and guidelines

## 🔐 Security

- API keys stored in `.env.local` (gitignored)
- IAM authentication for IBM Cloud services
- Service-specific credentials for each service
- Regular key rotation recommended

## 💰 Cost Management

- **Google Gemini**: Free tier available with rate limits
- **Cloudant Lite**: Free tier (1GB storage, 20 lookups/sec)
- Monitor usage via respective dashboards

## 🤝 Contributing

This is a private project. For questions or support, contact the development team.

## 📄 License

Private and confidential.

## 🆘 Support

- Google AI Studio: https://aistudio.google.com/
- IBM Cloud Support: https://cloud.ibm.com/unifiedsupport/supportcenter
- Cloudant Docs: https://cloud.ibm.com/docs/Cloudant

---

**Built with ❤️ for mothers everywhere**
