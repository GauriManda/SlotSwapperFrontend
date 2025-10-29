# 🎨 SlotSwapper Frontend

### 🧩 Overview
The **SlotSwapper Frontend** is a React-based interface for the SlotSwapper web app — a peer-to-peer scheduling platform where users can mark, view, and swap their calendar slots with others.

It communicates with the backend REST API to handle authentication, event management, and swap requests.

---

## 🚀 Tech Stack
- React (Vite)
- Context API for state management
- Fetch / Axios for API calls
- Plain CSS for responsive UI

---

## ⚙️ Setup Instructions

### 1️⃣ Clone and Navigate
```bash
git clone https://github.com/yourusername/slotswapper-frontend.git
cd slotswapper-frontend
2️⃣ Install Dependencies
npm install

3️⃣ Configure API Base URL

In src/App.jsx, set your backend API endpoint:

const API_BASE_URL = "http://localhost:5000/api";


(If deployed, replace with your live backend URL.)

4️⃣ Run the Frontend
npm run dev


Now open http://localhost:5173
 in your browser.
