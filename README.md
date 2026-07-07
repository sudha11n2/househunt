# HouseHunt

A full-stack real estate marketplace for renters, buyers, and agents — built with
MongoDB, Express, React (Vite), and Node (the MERN stack), secured with JWT auth.

Visual identity: **"Threshold"** — a blueprint-and-brick theme (deep ink green,
burnt terracotta, warm parchment, Fraunces/Work Sans/JetBrains Mono typography)
designed to look nothing like a generic real-estate template.

## Project structure

```
househunt/
├── backend/              Express API
│   ├── config/db.js       MongoDB connection
│   ├── models/            User, Property, Inquiry (Mongoose schemas)
│   ├── middleware/auth.js JWT verification + role guard
│   ├── controllers/       Route handlers
│   ├── routes/            Express routers
│   ├── server.js          App entry point
│   └── .env.example
└── frontend/              React + Vite SPA
    ├── src/
    │   ├── api/axios.js       Axios instance with auth interceptor
    │   ├── context/AuthContext.jsx
    │   ├── components/        Navbar, Footer, PropertyCard, ProtectedRoute, Loader
    │   ├── pages/              Home, Listings, PropertyDetail, Login, Register,
    │   │                       Dashboard, AddProperty, About, Contact, NotFound
    │   ├── index.css          Design tokens & global styles
    │   ├── App.jsx            Routes
    │   └── main.jsx           Entry point
    └── .env.example
```

## Features

- **JWT authentication** — register/login as a `renter` or `agent`, protected routes on both API and frontend.
- **Property CRUD** — agents create, edit, and delete listings; anyone can browse and filter.
- **Search & filters** — city, listing type, property type, price range, min bedrooms, pagination.
- **Inquiries** — signed-in users message a listing's owner directly; agents see all inquiries in their dashboard.
- **Agent dashboard** — manage listings, see view counts and status, review inquiries.
- **Saved properties** — toggle-save endpoint wired up on the User model, ready for a "favorites" UI.

## Getting started

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env     # then edit MONGO_URI and JWT_SECRET
npm run dev               # starts on http://localhost:5000
```

You'll need a MongoDB instance — either local (`mongodb://127.0.0.1:27017/househunt`)
or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster (paste its connection
string into `MONGO_URI`).

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env      # VITE_API_URL should match your backend URL
npm run dev                # starts on http://localhost:5173
```

### 3. Try it out

1. Register an account as **Agent / Landlord**.
2. Go to **Dashboard → + Add property** and publish a listing.
3. Log out, register a second account as **Renter / Buyer**, and browse **Listings**.
4. Open a listing and send an inquiry — it'll appear in the agent's Dashboard → Inquiries tab.

## API reference (quick)

| Method | Route                        | Auth        | Description                     |
|--------|-------------------------------|-------------|----------------------------------|
| POST   | `/api/auth/register`         | –           | Create account                   |
| POST   | `/api/auth/login`            | –           | Log in, returns JWT              |
| GET    | `/api/auth/me`                | Bearer      | Current user profile             |
| GET    | `/api/properties`            | –           | List/search/filter properties    |
| GET    | `/api/properties/:id`        | –           | Single property (increments views) |
| POST   | `/api/properties`            | Agent       | Create listing                   |
| PUT    | `/api/properties/:id`        | Owner/Admin | Update listing                   |
| DELETE | `/api/properties/:id`        | Owner/Admin | Delete listing                   |
| GET    | `/api/properties/mine/all`   | Agent       | My listings                      |
| PUT    | `/api/properties/:id/save`   | Bearer      | Toggle saved property            |
| POST   | `/api/inquiries`             | Bearer      | Message a property owner         |
| GET    | `/api/inquiries/received`    | Bearer      | Inquiries on my listings         |

## Notes for deployment

- Set `JWT_SECRET` to a long random string in production — never commit `.env`.
- Set `CLIENT_URL` on the backend to your deployed frontend origin for CORS.
- Image URLs are stored as plain strings (paste hosted image links when adding a
  listing); wiring up file uploads (e.g. Multer + S3/Cloudinary) is a natural next step.
