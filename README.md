# 🦖 Jurassic Explorer

An interactive, full-stack educational web application that brings the prehistoric world to life. Discover dinosaur species, explore an interactive global fossil map, test your knowledge with quizzes, challenge your memory in the Jurassic Arcade, chat with an AI Paleontologist (**Professor Ross**), share insights in the community forum, and manage content via a dedicated Admin Dashboard.

---

## 🌐 Live Demo

🚀 **Experience Jurassic Explorer Live:** [https://web-wonders-coral.vercel.app/](https://web-wonders-coral.vercel.app/)

---

## ✨ Features

### 🦕 Dinosaur Explorer & Detailed Encyclopedia

- **Catalog Browsing:** Browse a rich, searchable database of prehistoric species.
- **Advanced Filtering & Search:** Filter by geological era (_Triassic_, _Jurassic_, _Cretaceous_), diet (_Carnivore_, _Herbivore_, _Omnivore_), and taxonomical groups.
- **Comprehensive Species Pages:** Detailed physical statistics (length, weight), dietary details, habitat background, audio pronunciations, and geological period details.

### 🗺️ Interactive Fossil & World Map (`/map`)

- **Global Fossil Site Mapping:** Interactive map powered by Leaflet visualizing fossil discovery locations across all continents.
- **Multi-Filter Map Controls:** Filter fossil markers by continent, geological era, and dietary classification.
- **Rich Popups & Modals:** Click on markers to inspect discovery details, fossil age, and quick species summaries.

### 🤖 AI Paleontologist — Professor Ross (`/professor`)

- **AI-Powered Chat:** Chatbot powered by LLM integration providing instant answers to paleontology questions, fun facts, and quiz guidance.
- **Global Floating Assistant Widget:** Accessible from any page across the entire application via a floating widget interface.

### 🎮 Jurassic Arcade & Memory Match (`/games`)

- **Interactive Games Hub:** Play thematic mini-games designed for learning and fun.
- **Jurassic Memory Match:** Memory card game featuring dinosaur artwork, flip counters, move tracking, match timers, and high scores.

### 💬 Dinosaur Community Hub (`/community`)

- **Discussions & Discoveries:** Interactive forum for dinosaur enthusiasts to share findings, post questions, upload artwork, and discuss paleontology.
- **Social Engagement:** Like posts, post nested comments, filter by categories (_Discussions_, _Discoveries_, _Artwork_, _Questions_), and track user contributions.

### ⏳ Interactive Prehistoric Timeline (`/timeline`)

- **Chronological Journey:** Visual timeline covering the Triassic, Jurassic, and Cretaceous periods.
- **Epoch Insights:** Learn about shifting atmospheric conditions, dominant lifeforms, flora, and mass extinction events.

### 🧠 Adaptive Quiz System (`/quiz`)

- **Topic-Based Quizzes:** Explore specialized topics like _Apex Predators_, _Giant Herbivores_, _Flight & Feathers_, and era-specific challenges.
- **Difficulty Selection:** Choose between _Easy_, _Medium_, and _Hard_ modes.
- **Interactive Feedback:** Live countdown timers, score calculation, streak bonuses, and detailed post-quiz explanation summaries.

### 🛡️ Admin Dashboard & Moderation (`/admin`)

- **Analytics Overview:** View statistics on total dinosaurs, registered community posts, quiz engagement, and pending submissions.
- **Dinosaur Management (CRUD):** Create, update, edit, and delete dinosaur records with image uploads.
- **Community Moderation:** Review, approve, or reject user-submitted dinosaur content and posts.

### 👤 User Authentication & Profiles (`/profile`)

- **Secure Access:** Email/password authentication and Google OAuth integration.
- **Personal Profile:** Track quiz scores, view bookmarked/favorite dinosaurs, manage community posts, and unlock achievement badges.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS, Framer Motion, Leaflet
- **Backend:** Node.js, Express.js, MongoDB (Mongoose)
- **Services & Tools:** Groq AI SDK, Cloudinary, JWT Auth

---

## 📁 Project Structure

```text
Web_Wonders/
├── frontend/                  # React + Vite Frontend Application
│   ├── public/                # Static assets & favicon
│   ├── src/
│   │   ├── api/               # Axios API instances & service calls
│   │   ├── components/        # Reusable UI components
│   │   │   ├── admin/         # Admin dashboard components
│   │   │   ├── community/     # Community forum components
│   │   │   ├── explorer/      # Dinosaur search & card components
│   │   │   ├── game/          # Jurassic Arcade & Memory Match game
│   │   │   ├── map/           # Interactive Leaflet map components
│   │   │   ├── professor/     # AI Professor Ross widget & view
│   │   │   ├── quiz/          # Quiz player & results components
│   │   │   └── timeline/      # Prehistoric timeline visuals
│   │   ├── context/           # React Context (Auth, Professor AI)
│   │   ├── pages/             # Application pages & route views
│   │   ├── App.jsx            # Main app router & layout definition
│   │   └── main.jsx           # App entry point
│   ├── package.json
│   └── vite.config.js
│
├── backend/                   # Node.js + Express REST API
│   ├── src/
│   │   ├── config/            # DB, Cloudinary & Groq AI configurations
│   │   ├── controllers/       # Route request handlers
│   │   ├── middleware/        # Auth, Admin, & File upload middlewares
│   │   ├── models/            # Mongoose schemas (Dinosaur, User, Post, Quiz)
│   │   ├── routes/            # REST API endpoints
│   │   ├── services/          # Groq AI & external service logic
│   │   └── server.js          # Express app entry point
│   ├── package.json
│   └── .env.example
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed locally:

- **Node.js** (v18.x or higher)
- **npm** or **yarn**
- **MongoDB** instance (local or MongoDB Atlas connection string)

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/Web_Wonders.git
cd Web_Wonders
```

---

### 2. Backend Setup

1. Navigate to the `backend` directory:

    ```bash
    cd backend
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Create a `.env` file in the `backend` directory with the following variables:

    ```env
    PORT=5000
    MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/jurassic
    JWT_SECRET=your_jwt_secret_key
    GROQ_API_KEY=your_groq_api_key
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret
    ```

4. Start the backend development server:
    ```bash
    npm run dev
    ```
    The backend server runs on `http://localhost:5000`.

---

### 3. Frontend Setup

1. Open a new terminal window and navigate to the `frontend` directory:

    ```bash
    cd frontend
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Create a `.env` file in the `frontend` directory (if required):

    ```env
    VITE_API_URL=http://localhost:5000/api
    VITE_GOOGLE_CLIENT_ID=your_google_client_id
    ```

4. Start the frontend development server:
    ```bash
    npm run dev
    ```
    The frontend runs on `http://localhost:5173`.

---

## 📂 Navigation & Routes

| Route             | Description                                        |
| ----------------- | -------------------------------------------------- |
| `/`               | 🏠 Home page with hero, overview & quick stats     |
| `/explore`        | 🔍 Dinosaur Explorer with search & filter controls |
| `/dinosaur/:slug` | 🦖 Detailed Dinosaur information page              |
| `/map`            | 🗺️ Interactive Fossil Map & continent breakdown    |
| `/timeline`       | ⏳ Prehistoric Era Timeline                        |
| `/professor`      | 🤖 AI Paleontologist (Professor Ross) chat page    |
| `/community`      | 💬 Prehistoric Community forum & discoveries       |
| `/games`          | 🎮 Jurassic Arcade & Memory Match game             |
| `/quiz`           | 🧠 Interactive Quiz Hub & Topic Selector           |
| `/profile`        | 👤 User Profile, stats & achievements              |
| `/admin`          | 🛡️ Admin Dashboard & Moderation System             |

---

## 👩‍💻 Developed By

**Team Bit By Bit**

- **Harman Singh**
- **Mehar Surati**
- **Meshvi Gajjar**
- **Het Savani**

---
