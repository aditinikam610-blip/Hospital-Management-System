# Hospital Management System

A full-stack Hospital Management System built using **React, Node.js, Express.js, and MongoDB**.

## Tech Stack

* **Frontend:** React, Vite, Tailwind CSS, Axios
* **Backend:** Node.js, Express.js, Mongoose
* **Database:** MongoDB
* **Authentication:** JWT, bcrypt

## Features

* Admin, Doctor, and Patient login
* Patient and Doctor management
* Appointment booking and management
* Payment management
* Prescription management
* Admin dashboard
* Role-based authentication

## Run the Project

### Clone Integration Branch

```bash
git clone -b integration YOUR_GITHUB_REPO_URL
cd PROJECT_FOLDER
```

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Create a `.env` file in the backend with the required MongoDB and JWT configuration.

### Local URLs

```text
Frontend: http://localhost:5173
Backend:  http://localhost:5000
```

## Git Workflow

Get latest integration changes:

```bash
git checkout integration
git pull origin integration
```

The `integration` branch contains the combined frontend and backend project.
