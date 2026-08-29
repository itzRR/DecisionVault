# DecisionVault: Decide. Record. Learn.

DecisionVault is a production-ready, AI-powered decision tracking application. It is not just a chatbot—it is a structured tool designed to help you become a better decision-maker over time by forcing you to document your reasoning *before* acting, and comparing it to the actual outcome later.

## 🚀 Features

- **Decision Capture:** Record your choices, constraints, priorities, and initial confidence.
- **AI Decision Brief:** Gemini analyzes your decision context, identifies blind spots, weighs pros and cons, and recommends a next step.
- **Outcome Tracking:** After the decision is made and time passes, record the real-world outcome and your satisfaction level.
- **Decision Replay:** Gemini compares your initial reasoning against the actual outcome to generate a personalized "Decision Replay"—highlighting what you got right, what you misjudged, and what you can learn.
- **Personal Insights:** As you complete more decisions, the AI detects long-term patterns and biases in your decision-making style.

## 🛠️ Technology Stack

This project was built to strict production standards for the **#AccelerateAIwithCloudRun** challenge.

- **Frontend:** React 18, Vite, TailwindCSS, Framer Motion
- **Backend:** Express.js, TypeScript, Zod (for validation)
- **Database:** Cloud Firestore
- **Authentication:** Firebase Auth (Google Sign-In)
- **AI Integration:** Google Gemini API (`gemini-2.5-flash`) via the Google AI Node SDK
- **Deployment:** Google Cloud Run (Containerized via Docker)
- **Security:** API keys secured via Google Cloud Secret Manager

## 📦 Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/DecisionVault.git
   cd DecisionVault
   ```

2. **Install dependencies:**
   ```bash
   npm install
   cd client && npm install
   cd ../server && npm install
   ```

3. **Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   # Firebase Config (for frontend Auth)
   VITE_FIREBASE_API_KEY=your_key
   VITE_FIREBASE_AUTH_DOMAIN=your_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id

   # Google Cloud Auth (for backend Firestore)
   FIREBASE_PROJECT_ID=your_project_id
   
   # Gemini API Key
   GEMINI_API_KEY=your_gemini_key
   ```

4. **Run the development servers:**
   ```bash
   # From the root directory (starts both client and server concurrently)
   npm run dev
   ```

## ☁️ Cloud Run Deployment

This application is containerized as a unified service (the Express backend serves the built React static files in production).

```bash
# 1. Build and submit the image to Google Container Registry
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/decisionvault

# 2. Deploy to Cloud Run (Mapping Secret Manager to the container)
gcloud run deploy decisionvault \
  --image gcr.io/YOUR_PROJECT_ID/decisionvault \
  --platform managed \
  --allow-unauthenticated \
  --set-secrets="GEMINI_API_KEY=GEMINI_API_KEY:latest"
```

## 📝 License
MIT License
