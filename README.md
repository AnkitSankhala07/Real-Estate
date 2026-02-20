# 🏠 Akxton — India's Real Estate Portal (MERN Stack)

> A full-featured real estate portal migrated from PHP/MySQL to the **MERN Stack** (MongoDB, Express, React, Node.js), styled to match the premium look of 99acres.com.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, React Router v6, Axios, TanStack Query |
| **Styling** | Vanilla CSS with Design Tokens, Font Awesome 6, Inter font |
| **Backend** | Node.js, Express 5, Mongoose |
| **Database** | MongoDB (local or Atlas) |
| **Auth** | JWT (JSON Web Tokens) + bcryptjs |
| **Images** | Cloudinary (cloud storage) |
| **State** | React Context (auth) + TanStack Query (server state) |

---

## 📋 Prerequisites

- **Node.js** v18+
- **MongoDB** running locally, or a [MongoDB Atlas](https://cloud.mongodb.com) URI
- **Cloudinary** account (free tier) for image uploads

---

## ⚡ Quick Start

### 1. Clone & Install

```bash
# Install backend dependencies
npm install --prefix backend

# Install frontend dependencies  
npm install --prefix frontend
```

### 2. Configure Environment

Edit `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/akxton_real_estate
JWT_SECRET=your_secret_key_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Create Admin Account (once only)

```bash
cd backend && npm run seed:admin
# Creates: admin / admin123
```

### 4. Run Both Servers

```bash
# From mern_project/ directory — runs both backend & frontend
npm run dev
```

- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:5173
- **API Health**: http://localhost:5000/api/health

---

## 🗂️ Project Structure

```
mern_project/
├── backend/
│   ├── config/           # DB + Cloudinary setup
│   ├── controllers/      # Business logic (6 controllers)
│   ├── middleware/        # Auth + Admin middleware
│   ├── models/           # Mongoose schemas (6 models)
│   ├── routes/           # Express routes (6 route files)
│   ├── scripts/          # Seed scripts
│   └── server.js
└── frontend/
    └── src/
        ├── api/          # Axios instance with interceptors
        ├── components/   # Header, Footer, ErrorBoundary, ProtectedRoute
        ├── context/      # AuthContext (JWT state)
        └── pages/        # 9 pages (Home, Search, Property, Dashboard, etc.)
```

---

## 🔌 API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/health` | Public | Server status |
| POST | `/api/users/register` | Public | Register |
| POST | `/api/users/login` | Public | Login |
| GET/PUT | `/api/users/profile` | Private | Profile |
| GET | `/api/properties` | Public | Search + filter |
| POST | `/api/properties` | Private | Post listing |
| PUT | `/api/properties/:id` | Owner | Update listing |
| DELETE | `/api/properties/:id` | Owner | Delete listing |
| GET | `/api/properties/my-listings` | Private | My listings |
| POST | `/api/saved/toggle` | Private | Save/unsave |
| GET | `/api/saved` | Private | My saved |
| POST | `/api/requests` | Private | Send enquiry |
| GET | `/api/requests/received` | Private | Enquiries received |
| POST | `/api/messages` | Public | Contact form |
| POST | `/api/admin/login` | Public | Admin login |
| GET | `/api/admin/stats` | Admin | Dashboard stats |
| GET/DELETE | `/api/admin/users/:id` | Admin | Manage users |
| GET/DELETE | `/api/admin/properties/:id` | Admin | Manage listings |

---

## ✅ Features

- **User Auth** — Register, Login, JWT, Profile update, Password change
- **Property Listings** — Post, Edit, Delete with up to 5 Cloudinary images  
- **Advanced Search** — Filter by location, type, BHK, price range, status, furnishing  
- **Save Properties** — Toggle save/unsave, view all saved listings  
- **Enquiry System** — Send enquiries to property owners, view sent/received  
- **Contact Form** — Public contact messages (admin readable)  
- **Admin Panel** — Dashboard stats, user management, property management  
- **Pagination & Sorting** — Server-side pagination, sort by price/date  
- **12 Amenities** — Gym, parking, school, hospital, garden, etc.
