
# Intervu.AI 🎙️🤖

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/Frontend-React%20%7C%20Vite%20%7C%20Tailwind-blue)
![Node](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-green)
![AI](https://img.shields.io/badge/AI-Google%20Gemini%20Live%20API-orange)

**Master Your Interview. Land the Job.**

Intervu.AI is a next-generation mock interview platform that utilizes the **Google Gemini Live API** to conduct realistic, real-time voice and video interviews. It simulates the pressure and flow of a real job interview, providing instant feedback on technical accuracy, behavioral traits, and confidence levels.

---

## 🚀 Key Features

### 🧠 Real-Time AI Interviewer
- **Live Voice Interaction:** Uses Gemini 2.5 Flash Native Audio for low-latency, conversational spoken interactions.
- **Visual Presence:** An interactive audio-visualizer ("The Orb") and camera integration simulate a video call environment.
- **Context Awareness:** The AI adapts its persona based on the target company (e.g., Google, Goldman Sachs, Tesla) and the specific role.

### 📄 Intelligent Resume Analysis
- **PDF Parsing:** Upload your resume to have it automatically parsed and analyzed.
- **ATS Scoring:** Get an instant "Resume Score" based on keywords, impact metrics, and structure.
- **Tailored Questions:** The AI reads your resume context to ask specific questions about your past projects and experience.

### 📊 Comprehensive Feedback Reports
- **Multi-Dimensional Scoring:**
  - **Technical Score:** Accuracy of domain knowledge.
  - **Behavioral Score:** STAR method usage and cultural fit.
  - **Confidence Score:** Delivery, tone, and pacing.
- **Actionable Insights:** Detailed feedback highlighting key strengths and specific areas for improvement.
- **Transcripts:** Full review of the conversation history.

### 🎯 Job Matching & Recommendations
- **Role Suggestions:** AI analyzes your profile to suggest modern job titles you are best suited for.
- **Company Specifics:** curated list of top tech companies with specific interview styles (Technical vs. HR/Behavioral).

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 (via Vite)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **State Management:** React Hooks
- **Visuals:** Canvas API for audio visualization

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose ODM)
- **API:** RESTful architecture

### Artificial Intelligence
- **SDK:** `@google/genai`
- **Models:** 
  - `gemini-2.5-flash-native-audio-preview` (Live Session)
  - `gemini-2.5-flash` (Report Generation & Resume Analysis)

---

## ⚙️ Installation & Setup

Follow these steps to run the project locally.

### Prerequisites
- Node.js (v18+)
- npm or yarn
- A Google Cloud Project with the **Gemini API** enabled.

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/intervu-ai.git
cd intervu-ai
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure API Keys
Open the file `config.ts` in the root directory and replace the placeholder with your actual Gemini API Key.

```typescript
// config.ts
export const API_KEY = 'YOUR_ACTUAL_GEMINI_API_KEY';
```

> **Note:** For a production build, ensure API keys are handled via Environment Variables (.env) and never committed to the repository.

### 4. Database Configuration
The project is currently configured to connect to a MongoDB instance. Ensure the `MONGO_URI` in `server/server.js` is valid, or update it to point to your local/cloud MongoDB instance.

### 5. Run the Application
This command runs both the frontend (Vite) and the backend (Node server) concurrently.

```bash
npm run dev
```

- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:5000

---

## 📖 Usage Guide

1.  **Landing Page:** Start at the landing page. If you are a new user, click **Sign Up**.
2.  **Profile Setup:** Complete your profile by entering your name, experience level, and uploading a PDF resume. The AI will analyze it immediately.
3.  **Dashboard:** View your metrics, recent performance trends, and recommended roles.
4.  **Select Interview:** Choose a target company (e.g., "Meta") and role (e.g., "Frontend Engineer"). You can toggle between "Technical" and "HR" rounds.
5.  **The Interview:**
    - Allow Microphone and Camera permissions.
    - Speak naturally with "Alex" (the AI).
    - The AI will listen, think, and respond in real-time.
    - Click "End Interview" when finished.
6.  **Report:** Review your scores and feedback. You can save this report to your history.

---

## 📂 Project Structure

```
intervu-ai/
├── components/          # React UI Components
│   ├── Dashboard.tsx    # Main user hub
│   ├── InterviewSession.tsx # Core AI Logic & AV Visuals
│   ├── LandingPage.tsx  # Public landing page
│   └── ...
├── services/            # API Services
│   ├── geminiLiveClient.ts # WebSocket/Live API handling
│   ├── reportService.ts    # Content generation
│   └── api.ts              # Backend API bridge
├── server/              # Backend
│   ├── models/          # Mongoose Schemas (User, Report)
│   └── server.js        # Express App entry point
├── App.tsx              # Main Routing Logic
├── types.ts             # TypeScript Interfaces
└── config.ts            # Configuration (API Keys)
```

---

## 🤝 Contributing

Contributions are welcome! Please fork the repository and create a pull request with your features or fixes.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📞 Contact

**Adarsh Tiwari**  
📧 Email: [adarshpandat100@gmail.com](mailto:adarshpandat100@gmail.com)

---

© 2024 Intervu.AI. All Rights Reserved.
