# 🌿 Yogana — Government Scheme Recommender

> An NLP-powered web app that helps Indian citizens discover relevant government schemes based on their personal profile.

## 🚀 Features
- 🔍 **Smart Recommendation** — Profile-based scheme matching using TF-IDF & cosine similarity
- 💬 **AI Chat Interface** — Conversational scheme discovery
- 📊 **Scheme Comparison** — Side-by-side scheme comparison
- 🏷️ **Filtering** — By category, ministry, state, gender, caste
- 🗂️ **100+ Schemes** — Covers central & state-level schemes

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite + Tailwind CSS |
| Backend | Python Flask + Flask-CORS |
| NLP | scikit-learn (TF-IDF, Cosine Similarity) |
| Data | Custom curated `schemes.json` |

## 📦 Project Structure
```
Yogana/
├── backend/
│   ├── app.py           # Flask REST API
│   ├── recommender.py   # NLP recommendation engine
│   ├── schemes.json     # Scheme dataset
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page-level components
│   │   ├── hooks/       # Custom React hooks
│   │   └── services/    # API service layer
│   └── package.json
└── README.md
```

## ⚡ Getting Started

### Backend
```bash
cd backend
pip install -r requirements.txt
python app.py
# API runs on http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# App runs on http://localhost:5173
```

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/schemes` | List all schemes (filterable) |
| GET | `/api/schemes/:id` | Get scheme by ID |
| GET | `/api/categories` | List categories |
| GET | `/api/ministries` | List ministries |
| GET | `/api/stats` | Scheme statistics |
| POST | `/api/recommend` | Get personalized recommendations |
| POST | `/api/chat` | Chatbot interface |
| POST | `/api/compare` | Compare multiple schemes |

## 👥 Team
Group 6 — RCOE Computer Engineering

---
*Made with ❤️ to simplify access to government welfare schemes for every Indian citizen.*
