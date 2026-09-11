# SkillBridge Backend

This is the backend API for SkillBridge. It is built with Node.js, Express, TypeScript, and MongoDB.

## Setup

1. Open the backend folder:

```bash
cd backend
```

2. Install packages:

```bash
npm install
```

3. Create a `.env` file in the `backend` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET_KEY=your_secret_key
FRONTEND_URL=http://localhost:5173
MAILER_USER=your_email
MAILER_PASS=your_email_password
```

## Run the backend

For development:

```bash
npm run dev
```

To check the TypeScript build:

```bash
npm run build
```

The API runs at:

```text
http://localhost:5000
```

## Main endpoints

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/profile
GET  /api/auth/users
```

### Jobs

```text
GET  /api/jobs
GET  /api/jobs/search?title=developer&location=karachi&page=1&limit=10
GET  /api/jobs/:id
POST /api/jobs
```

`POST /api/jobs` requires an authenticated employer. Send the token in the request header:

```text
Authorization: Bearer YOUR_TOKEN
```

## Search examples

```text
/api/jobs/search?title=engineer
/api/jobs/search?location=karachi
/api/jobs/search?location=karachi&page=2&limit=10
```

Search is case-insensitive and supports partial city or address names.
