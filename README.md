# AI Interaction Flow (MERN Stack)

This is a full-stack MERN application featuring a React frontend (Vite) and Node.js/Express backend, connected to MongoDB Atlas. It integrates with OpenRouter to generate AI responses from a custom React Flow UI interface.

---

## 🚀 Live Demo & Links
- **Public GitHub Repository:** [https://github.com/Priyanshu-1408/MERN-app](https://github.com/Priyanshu-1408/MERN-app)
- **Deployed Frontend (Vercel):** [https://mern-app-one-delta.vercel.app](https://mern-app-one-delta.vercel.app)
- **Deployed Backend API (Render):** [https://mern-app-s1i7.onrender.com](https://mern-app-s1i7.onrender.com)

---

## 💻 Tech Stack
- **Frontend**: React, Vite, React Flow, Axios, Vanilla CSS 
- **Backend**: Node.js, Express, Mongoose, dotenv
- **Database**: MongoDB Atlas
- **External API**: OpenRouter (`openrouter/auto` AI model router)

---

## ⚙️ Local Setup Instructions

### Prerequisites
- Node.js installed on your machine
- MongoDB Atlas Setup & Connection URI
- OpenRouter API Key

### Backend Setup (`server/`)
1. Navigate to the server folder: `cd server`
2. Install dependencies: `npm install`
3. Create a `.env` file (copied from `.env.example`) and configure your keys:
   - `MONGO_URI=your_mongodb_atlas_connection_string`
   - `OPENROUTER_API_KEY=your_openrouter_api_key`
   - `PORT=5000`
4. Start the server: `npm run dev` or `npm start`

### Frontend Setup (`client/`)
1. Navigate to the client folder: `cd client`
2. Install dependencies: `npm install`
3. If connecting to a deployed backend, add your Render URL to your `.env` file:
   - `VITE_API_URL=https://your-backend-url.onrender.com`
   *(If testing locally, you can skip this step. It will default to `http://localhost:5000` automatically!)*
4. Start the frontend: `npm run dev`

---

## 📝 Features & UX
- Interactive node-based diagram UI using React Flow, completely custom styled.
- Fully functional custom AI prompt querying, MongoDB interaction saving, and connection tracking.
- Elegant modern card design layout featuring animated CSS spinners, robust backend error handling displays, and UI safety states.
