# Task Manager

A full-stack Task Manager application built with NestJS and Next.js. It allows users to create, view, update, delete, filter, and sort tasks.

## Features

- Create, edit, and delete tasks.
- Set task titles, descriptions, completion status, and due dates.
- View tasks in a table with status badges.
- Filter tasks by status.
- Sort tasks by due date.
- Form validation and clear error messages.
- Loading, error, and empty states.
- Success notifications after actions.
- SQLite database for persistent storage.
- Docker Compose support for running the application.

## Technology Stack

**Frontend**
- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Sonner

**Backend**
- NestJS
- TypeScript
- TypeORM
- SQLite (`better-sqlite3`)
- class-validator

## Prerequisites

### For local development

Install the following:

- [Node.js 24.x](https://nodejs.org/)
- npm (included with Node.js)
- Git

You can check your installed versions:

```bash
node --version
npm --version
git --version
```

### For Docker

Install [Docker Desktop](https://www.docker.com/products/docker-desktop/).

Make sure Docker Desktop is running before executing Docker commands.

---

## Option 1: Run with Docker Compose (Recommended)

Docker Compose builds and starts both the frontend and backend. It also creates a persistent volume for the SQLite database.

### 1. Clone the repository

```bash
git clone https://github.com/SachiniDIL/task-manager.git
cd task-manager
```

### 2. Create the environment file

Copy the example environment file.

**Windows PowerShell:**

```powershell
Copy-Item .env.example .env
```

**macOS / Linux:**

```bash
cp .env.example .env
```

The default `.env.example` values are:

```env
# Frontend
WEB_PORT=3000
NEXT_PUBLIC_API_URL=http://localhost:3001

# Backend
API_PORT=3001
FRONTEND_URL=http://localhost:3000

# Database
DATABASE_PATH=data/task-manager.sqlite
```

These values are suitable for running the application locally with Docker Compose.

### 3. Build and start the application

```bash
docker compose up --build
```

The first run may take a few minutes because Docker needs to build the images and install dependencies.

Docker automatically runs the database migrations before starting the backend.

### 4. Open the application

Once the containers are running:

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

### 5. Stop the application

Press `Ctrl + C` in the terminal, then run:

```bash
docker compose down
```

**Database persistence:** The SQLite database is stored in a Docker named volume. Stopping and removing the containers with `docker compose down` does not delete your tasks.

To remove the database volume as well, run:

```bash
docker compose down -v
```

Warning: This command permanently deletes the database volume and its stored tasks.

---

## Option 2: Run Locally Without Docker

You can also run the frontend and backend separately on your computer.

### 1. Clone the repository

```bash
git clone https://github.com/SachiniDIL/task-manager.git
cd task-manager
```

### 2. Set up the backend

Open a terminal and navigate to the API directory:

```bash
cd api
```

Install dependencies:

```bash
npm ci
```

Create an `.env` file inside the `api` directory with the following values:

```env
PORT=3001
DATABASE_PATH=data/task-manager.sqlite
FRONTEND_URL=http://localhost:3000
```

The database directory is created automatically when the database connection is initialized.

Run the database migrations:

```bash
npm run migration:run
```

Start the backend in development mode:

```bash
npm run start:dev
```

The backend will run at:

http://localhost:3001

Keep this terminal running.

### 3. Set up the frontend

Open a second terminal and navigate to the frontend directory:

```bash
cd task-manager/web
```

If your terminal is already inside the project root, use:

```bash
cd web
```

Install dependencies:

```bash
npm ci
```

Create a `.env.local` file inside the `web` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Start the frontend:

```bash
npm run dev
```

The frontend will run at:

http://localhost:3000

You can now use the application in your browser.

---

## Environment Variables

### Backend (`api/.env`)

| Variable | Description | Default |
|---|---|---|
| `PORT` | Backend server port | `3001` |
| `DATABASE_PATH` | SQLite database file location | `data/task-manager.sqlite` |
| `FRONTEND_URL` | Frontend origin allowed by CORS | `http://localhost:3000` |

### Frontend (`web/.env.local`)

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:3001` |

### Docker Compose (root `.env`)

| Variable | Description | Default |
|---|---|---|
| `WEB_PORT` | Host port for the frontend | `3000` |
| `NEXT_PUBLIC_API_URL` | Backend URL used by the browser | `http://localhost:3001` |
| `API_PORT` | Host and backend API port | `3001` |
| `FRONTEND_URL` | Frontend origin allowed by CORS | `http://localhost:3000` |
| `DATABASE_PATH` | SQLite database file location inside the API container | `data/task-manager.sqlite` |

Do not commit your actual `.env` or `.env.local` files. They are excluded through `.gitignore`.

---

## Useful Development Commands

### Backend

Run from the `api` directory.

| Command | Description |
|---|---|
| `npm run start:dev` | Start the backend in development mode |
| `npm run build` | Build the backend |
| `npm test` | Run backend tests |
| `npm run lint` | Check code quality |
| `npm run migration:run` | Run pending database migrations |
| `npm run migration:show` | Show migration status |
| `npm run migration:revert` | Revert the latest migration |

### Frontend

Run from the `web` directory.

| Command | Description |
|---|---|
| `npm run dev` | Start the frontend in development mode |
| `npm run build` | Build the frontend |
| `npm start` | Start the production frontend |
| `npm run lint` | Check code quality |

---

## How I Used AI

I used **ChatGPT** as a development assistant during this project.

AI assistance was used to:
- Understand concepts and explore implementation approaches.
- Get suggestions for NestJS backend structure and Next.js frontend components.
- Improve form validation, error handling, and user feedback.
- Troubleshoot development and Docker configuration issues.
- Review code and identify possible improvements.

I reviewed and adapted the generated suggestions rather than using them without checking. I tested the implementation by running the application, executing backend tests, checking builds and linting, and manually testing the main application features.

The final implementation and testing decisions were made by me.