# SkillBridge LMS

A **Learning Management System (LMS)** web application built with **React.js**, **Node.js**, **Express**, and **MongoDB**. This platform allows **students** to browse courses, enroll, mark courses as complete, and view progress. **Admins** can manage courses, add new ones, and track student progress.

---

## Table of Contents

- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Installation](#installation)  
- [Folder Structure](#folder-structure)  
- [API Endpoints](#api-endpoints)  
- [Usage](#usage)  
- [Screenshots](#screenshots)  
- [Contributing](#contributing)  
- [License](#license)  

---

## Features

### Student
- View all available courses.
- Enroll in courses.
- Mark courses as complete.
- View enrolled and completed courses separately.
- Real-time updates on enrollment and completion.

### Admin
- Add new courses.
- Delete existing courses.
- View all courses and student progress.

### Common
- User authentication with roles (`student` and `admin`).
- Integrated **chatbot** for assistance.
- Dynamic and responsive UI using **TailwindCSS**.
- Persistent data storage with **MongoDB**.

---

## Tech Stack

- **Frontend:** React.js, TailwindCSS, JavaScript (ES6+), HTML, CSS  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB, Mongoose  
- **Tools:** VS Code, Git, Postman  

---

## Installation

1. Clone the repository:  
   ```bash
   git clone https://github.com/Naresh9597/LMS_platform6s.git
   cd LMS_platform6s
Install dependencies for backend:

bash
Copy code
cd backend
npm install
Set up environment variables (.env in backend folder):

env
Copy code
MONGO_URI=your_mongodb_connection_string
PORT=4000
JWT_SECRET=your_secret_key
Start the backend server:

bash
Copy code
node server.js
Install dependencies for frontend:

bash
Copy code
cd ../frontend
npm install
Start the React app:

bash
Copy code
npm start
Open the browser at http://localhost:3000.

Folder Structure
bash
Copy code
LMS_platform6s/
│
├─ backend/
│  ├─ config/          # DB configuration
│  ├─ controllers/     # Route controllers
│  ├─ models/          # Mongoose models
│  ├─ routes/          # Express routes
│  ├─ server.js        # Entry point
│  └─ update.js        # Data seeding / updates
│
├─ frontend/
│  ├─ src/
│  │  ├─ components/   # Reusable components (StudentCourses, AdminCourses, ChatDock)
│  │  ├─ context/      # RoleContext for auth
│  │  ├─ pages/        # Dashboard, CoursesPage
│  │  └─ App.js
│  └─ package.json
└─ README.md
