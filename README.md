# Fitness API – Final Project

## Overview
A backend REST API for managing users, training sessions, workouts, and exercises.  
Built with **Node.js**, **Express**, **Sequelize**, **JWT authentication**, and **role-based authorization**.

## Features
- REST API with Express  
- Relational database using Sequelize  
- SQLite for local development and testing  
- JWT authentication (register, login, token verification)  
- Role-based authorization (client, trainer, admin)  
- CRUD for Users, Sessions, Workouts, Exercises  
- Proper HTTP status codes and error handling  
- Unit tests using Jest + Supertest  
- Deployment-ready structure  

## Tech Stack
- Node.js  
- Express.js  
- Sequelize ORM  
- SQLite (local)  
- JWT (jsonwebtoken)  
- Jest + Supertest  

## Installation

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd <project-folder>
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create a `.env` file
```env
NODE_ENV=development
PORT=3000
DB_NAME=dev.db
JWT_SECRET=your-secret
JWT_EXPIRES_IN=24h
```

### 4. Setup, Seed and Run the server
```bash
npm run setup
npm run seed
npm start
```

## Running Tests
```bash
npm test
```

## Database Models

### Users
- id  
- name  
- email  
- password (hashed)  
- role (client, trainer, admin)  

### Sessions
- id  
- user_id  
- date  
- notes  

### Workouts
- id  
- session_id  
- exercise_id  
- sets  
- reps  
- weight  

### Exercises
- id  
- name  
- muscle_group  
- description  

## Authentication Endpoints

### Register
```http
POST /api/auth/register
```

### Login
```http
POST /api/auth/login
```

### Get Current User
```http
GET /api/auth/me
```

## User Endpoints
```http
GET /api/users
GET /api/users/:id
PUT /api/users/:id
DELETE /api/users/:id
GET /api/users/:id/workouts
GET /api/users/:id/prs
GET /api/users/:id/summary/weekly
```

## Sessions Endpoints
```http
GET /api/sessions
GET /api/sessions/:id
POST /api/sessions
PUT /api/sessions/:id
DELETE /api/sessions/:id
```

## Workout Endpoints
```http
GET /api/workouts
POST /api/workouts
PUT /api/workouts/:id
DELETE /api/workouts/:id
```

## Exercises Endpoints
```http
GET /api/exercises
POST /api/exercises
PUT /api/exercises/:id
DELETE /api/exercises/:id
```

## Deployment Notes
This project uses SQLite locally.  
For deployment, ensure your environment supports SQLite or use a WASM-based SQLite driver.

### Production Environment Variables
```env
NODE_ENV=production
DB_NAME=dev.db
JWT_SECRET=your-secret
JWT_EXPIRES_IN=24h
```

## Author
**Felipe Tramontin**