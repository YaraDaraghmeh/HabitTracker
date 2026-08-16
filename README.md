# Habit Tracker

A full-stack web application for tracking daily habits, with automatic **Current Streak** and **Longest Streak** calculation, completion-rate insights, and a secure per-user account system where every user only sees their own habits. Built with the MERN stack (no Firebase/Firestore).

**Live Demo:**
- Frontend: [https://habittracker-1-a9g7.onrender.com](https://habittracker-1-a9g7.onrender.com/)
- Backend API: [https://habittracker-hvk4.onrender.com](https://habittracker-hvk4.onrender.com/)
- API Docs (Swagger): [https://habittracker-hvk4.onrender.com/api-docs](https://habittracker-hvk4.onrender.com/api-docs)

---

##  Overview

The project is cleanly split between frontend and backend, following the **Single Responsibility Principle (SRP)**:

- **Backend (Node.js + Express + MongoDB):** Solely responsible for authentication, database access, and exposing a REST API. It contains no UI logic or presentation-related calculations.
- **Frontend (React):** Responsible for rendering the UI and, most importantly, for **computing streaks and completion rates from raw data** (a list of completion dates) returned by the API. This calculation logic lives exclusively on the frontend — the backend never processes it.

The database is **never** accessed directly from the frontend; every interaction with it goes strictly through the API.

---

## Project Structure

```
habit-tracker/
├── server/                       # Backend - Node.js + Express + MongoDB
│   ├── models/
│   │   ├── User.js                # User account model (auth)
│   │   ├── Habit.js               # Habit model (belongs to a user)
│   │   └── Entry.js               # Completed-day record (belongs to a habit)
│   ├── routes/
│   │   ├── auth.js                # Signup / Login / Me
│   │   ├── habits.js              # Habit CRUD
│   │   └── entries.js             # Log / remove completed days
│   ├── middleware/
│   │   └── auth.js                # JWT route protection (protect)
│   ├── utils/
│   │   └── generateToken.js       # JWT generation on login/signup
│   ├── swagger.js                 # Swagger/OpenAPI 3.0 config
│   ├── server.js                  # Entry point (Express app + Mongo connection)
│   └── .env                       # Environment variables (PORT, MONGO_URI, JWT_SECRET)
│
└── client/                       # Frontend - React (Vite)
    └── src/
        ├── api/
        │   ├── axios.js            # Central axios instance + token interceptor
        │   ├── auth.js             # signup / login / me requests
        │   └── habits.js           # Habit & entry CRUD requests
        ├── context/
        │   └── AuthContext.jsx     # App-wide authentication state
        ├── components/
        │   ├── ProtectedRoute.jsx  # Blocks dashboard access when logged out
        │   ├── PasswordInput.jsx   # Password field with show/hide eye icon
        │   ├── AddHabitForm.jsx
        │   ├── HabitCard.jsx       # Habit display + streaks + 14-day mini calendar
        │   └── StatsOverview.jsx   # Summary stats + bar chart
        ├── pages/
        │   ├── LandingPage.jsx
        │   ├── Login.jsx
        │   ├── Signup.jsx
        │   └── Dashboard.jsx
        ├── utils/
        │   └── streaks.js          # Streak calculation logic (the frontend's core logic)
        ├── App.jsx                  # All route definitions
        ├── main.jsx
        ├── index.css                 # Theme (dark mode, orange/pink gradient)
        └── .env.example                # Sample environment file
```

---

##  Data Models & Relationships

The database has 3 collections, chained together in a **one-to-many** relationship:

```
User  (1) ──────< (N)  Habit  (1) ──────< (N)  Entry
one user           many habits      one habit       many completed days
```

### 1) `User`
Represents a user account. Each user owns their own set of habits exclusively.

| Field | Type | Description |
|---|---|---|
| `name` | String | User's display name |
| `email` | String | Email address (unique) |
| `password` | String | **Hashed with bcrypt** before saving; excluded from normal queries via `select: false` |
| `createdAt` / `updatedAt` | Date | Automatic (timestamps) |

**Relations:** one user → many habits (`Habit.user` references it)

### 2) `Habit`
Represents a single habit (e.g. "Drink Water"), tied to a specific user.

| Field | Type | Description |
|---|---|---|
| `name` | String | Habit name |
| `user` | ObjectId (ref: `User`) | Owner of the habit — **required**, used in every query to scope results to the logged-in user |
| `createdAt` / `updatedAt` | Date | Automatic |

**Relations:**
- Belongs to one user (many-to-one with `User`)
- Has many entries (one-to-many with `Entry`)
- Deleting a habit cascades and deletes all its related `Entry` documents (handled manually in the route for data integrity)

### 3) `Entry`
Represents a single "day completed" record for a habit. This data is intentionally **raw** — all derived calculations (streaks, rates) happen on the frontend, never here.

| Field | Type | Description |
|---|---|---|
| `habit` | ObjectId (ref: `Habit`) | The habit this entry belongs to |
| `date` | String (`YYYY-MM-DD`) | Completion date |

**Relations:** belongs to one habit (many-to-one with `Habit`)

**Unique index:** `{ habit: 1, date: 1 }` — prevents logging the same day twice for the same habit, and backs the toggle behavior in the API.

---

## Authentication

- Signup/login is handled via **JWT (JSON Web Tokens)** — no Firebase or any auth provider separate from this project's own API.
- Passwords are **hashed with bcrypt** (`bcryptjs`) before being stored, and are never returned in any API response.
- On login or signup, the server returns a `token` valid for 30 days.
- The frontend stores the token in `localStorage` and automatically attaches it to every request via an Axios interceptor:
  ```
  Authorization: Bearer <token>
  ```
- All habit and entry routes are protected by a `protect` middleware, which verifies the token and resolves the authenticated user (`req.user`) before any operation runs.
- Every query on `Habit`/`Entry` is automatically scoped to `user: req.user._id`, so it's impossible for one user to view or modify another user's data.
- Password fields include a **show/hide eye icon** on both the Login and Signup forms for a smoother UX.

---

##  Technologies Used

### Backend
| Technology | Purpose |
|---|---|
| **Node.js** | JavaScript runtime for the server |
| **Express.js** | Web framework used to build the REST API |
| **MongoDB** (Atlas) | NoSQL database storing users, habits, and entries |
| **Mongoose** | ODM for MongoDB — schemas, validation, and queries |
| **bcryptjs** | Password hashing |
| **jsonwebtoken (JWT)** | Issuing and verifying authentication tokens |
| **cors** | Enables cross-origin requests from the frontend |
| **dotenv** | Loads environment variables from `.env` |
| **swagger-jsdoc** + **swagger-ui-express** | Generates and serves interactive API documentation (OpenAPI 3.0) at `/api-docs` |
| **nodemon** | Auto-restarts the server during development |

### Frontend
| Technology | Purpose |
|---|---|
| **React** | Component-based UI library |
| **Vite** | Fast dev server and build tool |
| **React Router (react-router-dom)** | Client-side routing (`/`, `/login`, `/signup`, `/dashboard`) and route protection |
| **Axios** | HTTP client for talking to the backend, with a central interceptor that attaches the auth token |
| **Recharts** | Renders the completion-rate bar chart |
| **Context API** | Manages app-wide auth state (`AuthContext`) without any external state library |
| **Custom CSS (no framework)** | Dark-mode theme with an orange-to-pink gradient, built with CSS custom properties (design tokens) |

### Infrastructure / Deployment
| Layer | Platform |
|---|---|
| Backend | [Render](https://render.com) |
| Frontend | [Render](https://render.com) |
| Database | [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) |
| API Docs | Swagger UI (hosted alongside the backend) |

---

## 🚀 Running Locally

### Requirements
- Node.js (v18+)
- A MongoDB Atlas account (or local MongoDB instance)

### 1) Backend

```bash
cd server
npm install
```

Create a `.env` file inside `server/`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/habit-tracker?retryWrites=true&w=majority
JWT_SECRET=<a long random secret string>
```

Run the server:

```bash
npm run dev
```

The API will be available at `http://localhost:5000`

### 2) Frontend

```bash
cd client
npm install
```

Create a `.env` file inside `client/` (see `.env.example`):

```env
VITE_API_URL=http://localhost:5000/api
```

Run the dev server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (the backend must be running at the same time).

---

## 📖 API Documentation (Swagger)

Once the server is running, open:

```
http://localhost:5000/api-docs
```

(Production docs: `https://habittracker-hvk4.onrender.com/api-docs`)

Every endpoint is documented with request/response schemas and examples. To try protected endpoints:
1. Sign up or log in via `/api/auth/signup` or `/api/auth/login`
2. Copy the `token` from the response
3. Click the  **Authorize** button (top right) and enter `Bearer <token>`
4. All your test requests from the page will now be authenticated automatically

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description | Protected? |
|---|---|---|---|
| `POST` | `/api/auth/signup` | Create a new account `{ name, email, password }` | No |
| `POST` | `/api/auth/login` | Log in `{ email, password }` | No |
| `GET` | `/api/auth/me` | Get the current user's info | ✅ |

### Habits
| Method | Endpoint | Description | Protected? |
|---|---|---|---|
| `GET` | `/api/habits` | Get all habits belonging to the current user | ✅ |
| `POST` | `/api/habits` | Create a new habit `{ name }` | ✅ |
| `PUT` | `/api/habits/:id` | Update a habit's name | ✅ |
| `DELETE` | `/api/habits/:id` | Delete a habit (and all its entries) | ✅ |

### Entries
| Method | Endpoint | Description | Protected? |
|---|---|---|---|
| `GET` | `/api/habits/:habitId/entries` | Get all logged days for a habit | ✅ |
| `POST` | `/api/habits/:habitId/entries` | Log/unlog a day (`{ date: "YYYY-MM-DD" }`) — acts as a toggle | ✅ |
| `DELETE` | `/api/habits/:habitId/entries/:date` | Remove a specific logged day | ✅ |

All protected endpoints require the header: `Authorization: Bearer <token>`

---

##  Frontend Logic: Streak Calculation

The backend only ever returns raw dates — no calculations. All of the following logic lives in `client/src/utils/streaks.js`:

- **Current Streak :** The number of consecutive days ending today (or yesterday, if today hasn't been logged yet) where the habit was completed.
- **Longest Streak:** The longest run of consecutive completed days across the habit's entire history (computed by comparing the day-gap between consecutive sorted entries).
- **Completion Rate (%):** The percentage of days completed out of the last 7 days.
- **Mini Calendar:** Renders the last 14 days as clickable squares, comparing each computed date against the set of entry dates returned by the API.

This logic is the project's core frontend responsibility — the backend's job ends at storing and retrieving raw data.

---

## Deployment Notes

- **Backend (Render):** Deployed directly from the `server` folder. Environment variables (`MONGO_URI`, `JWT_SECRET`, `PORT`) are configured in the Render dashboard.
- **Frontend (Render):** Deployed as a static site from the `client` folder. The `VITE_API_URL` environment variable points to the live backend API URL.
- **CORS:** The backend currently allows cross-origin requests from any origin via the `cors` package, so the Render-hosted frontend can reach the Render-hosted backend without extra configuration.

---

## 👩‍💻 Author

**Yara** — Computer Engineering Graduate, An-Najah National University
