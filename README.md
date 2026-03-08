# GateGPT - AI Assistant for GATE Prep

GateGPT is a specialized AI-powered platform designed to assist students preparing for the **GATE (Graduate Aptitude Test in Engineering)**. It provides a chatbot interface, subject exploration, and various prep modes tailored for engineering students.

## 🚀 Recent Improvements

- **Reliable Signup**: Fixed CORS and environment configuration issues to ensure smooth user registration.
- **Perfected Layout**: Resolved viewport height issues on the chat dashboard for a seamless full-screen experience.
- **Robust AI Replies**: Enhanced error handling for the Gemini API and switched to the high-performance **Gemini 3.1 Flash Lite** model.

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS, Zustand.
- **Backend**: Node.js, Express, Mongoose (MongoDB).
- **AI**: Google Generative AI (Gemini 3.1 Flash Lite).

## ⚙️ Getting Started

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or on Atlas)
- Gemini API Key from [Google AI Studio](https://aistudio.google.com/)

### 2. Setup Environment Variables

Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_random_secret
GEMINI_API_KEY=your_gemini_api_key
FRONTEND_URL=http://localhost:3001
```

### 3. Installation & Running

#### Server
```bash
cd server
npm install
node index.js
```

#### Client
```bash
cd client
npm install --legacy-peer-deps
npm run dev
```
Accessible at: `http://localhost:3001`
