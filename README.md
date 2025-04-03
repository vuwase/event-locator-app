# event-locator-app
# 🌍 Event Locator API

An API backend for discovering, managing, and interacting with events based on user location and preferences. Supports user authentication, geospatial search, multilingual support, and JWT-protected endpoints.

---

## 🚀 Features

- 🧭 Search events by location (latitude, longitude, radius)
- 🔒 Secure authentication (JWT-based)
- 🌐 Multilingual support (i18next)
- 🗺️ Filter events by category
- 🧑‍💼 Role-based access (user/admin)
- 🔔 Real-time notifications (Pub/Sub ready)
- ✅ Well-tested (Jest or Mocha)
- 📑 Auto-generated Swagger API documentation

---

## 🛠️ Technologies Used

| Layer         | Stack                        |
|--------------|-------------------------------|
| Backend       | Node.js, Express.js           |
| Auth          | Passport.js (JWT strategy)    |
| DB            | PostgreSQL + PostGIS          |
| Realtime      | Redis Pub/Sub / RabbitMQ      |
| Docs          | Swagger + swagger-jsdoc       |
| i18n          | i18next                       |
| Testing       | Jest / Mocha                  |
| Deployment    | Render (backend), Vercel (frontend) |

---

## 📦 Installation

```bash
# Clone the project
git clone https://github.com/your-username/event-locator-api.git
cd event-locator-api

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Fill in your DB credentials, JWT secret, etc.

# Run the server
npm run dev


PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/eventdb
JWT_SECRET=your_super_secret
REDIS_URL=redis://localhost:6379

Authorization: Bearer <your_token>


Link to the Swagger API Documentation ; http://localhost:5000/api-docs


---
Link to the video ; https://vimeo.com/1072376776/0e97795212?share=copy