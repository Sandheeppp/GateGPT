# GateGPT - AI Assistant for GATE Prep

GateGPT is a specialized AI-powered platform designed to assist students preparing for the **GATE (Graduate Aptitude Test in Engineering)**. It provides a chatbot interface, subject exploration, and various prep modes tailored for engineering students.

## 🛠️ Project Structure

The project is divided into two main components:

- **`/client`**: The frontend application built with **Next.js 14**, React, and Tailwind CSS. It handles the user interface, chat interactions, and learning dashboard.
- **`/server`**: The backend API built with **Node.js**, Express, and MongoDB. It manages user authentication, chat history, and integrations with AI models.
- **Root Directory**: Contains project documentation, reports (Review documents), and presentation materials.

## 🚀 Key Features

- **Specialized Chatbot**: AI assistant trained for GATE-specific queries using Gemini models.
- **Subject Discovery**: Explore key engineering concepts and subjects relevant to the GATE syllabus.
- **Prep Modes**: Different interaction modes to aid in memory and practice.
- **Secure Auth**: JWT-based authentication for user account management.

## 💻 Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS, Zustand, Framer Motion.
- **Backend**: Node.js, Express, Mongoose (MongoDB).
- **AI Integration**: Google Generative AI (Gemini 1.5 Flash Lite / Gemini 1.5).
- **Styling & Assets**: Lucide Icons, KaTeX (for math rendering).

## ⚙️ Getting Started

### 1. Prerequisites
- **Node.js**: v18 or higher.
- **MongoDB**: A local instance or MongoDB Atlas cluster.
- **API Key**: A Gemini API key from [Google AI Studio](https://aistudio.google.com/).

### 2. Environment Setup

Create a `.env` file in the `/server` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_random_secret
GEMINI_API_KEY=your_gemini_api_key
FRONTEND_URL=http://localhost:3001
```

### 3. Installation & Execution

#### Backend (Server)
```bash
cd server
npm install
node index.js
```

#### Frontend (Client)
```bash
cd client
npm install --legacy-peer-deps
npm run dev
```
The application will be accessible at `http://localhost:3001`.
