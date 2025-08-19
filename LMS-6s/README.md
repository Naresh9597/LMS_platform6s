# LMS Ultra — Role-Based Dashboard (React + Vite)

Enhancements:
- **Robust role switching** via re-auth (fixed blank screen issue).
- **Chatbot dock at the top** of the dashboard + full panel with more Q&A and charts.
- **Professional UI**: glass cards, gradients, dark mode, KPIs, trending courses, ratings breakdown.
- **Strict RBAC**: admin/student modules are isolated.

## Run
```bash
npm install
npm run dev
```
Open http://localhost:5173/

## Credentials
- Admin → `admin / admin123`
- Student → `student / student123`


📚 LMS-6s

A modern Learning Management System (LMS) Dashboard built with React, Vite, TailwindCSS, and ShadCN/UI. The project provides role-based dashboards for students and admins, interactive charts, announcements, chat features, and a responsive UI.

🚀 Features

Role-Based Dashboards:

🎓 Student Dashboard with progress, leaderboard, and announcements

🛠️ Admin Dashboard with analytics and management tools

Interactive Charts:

Line, Bar, Pie, Radar, and Area charts for data visualization

UI & UX Enhancements:

Responsive layout with TailwindCSS

Cards, badges, buttons from ShadCN/UI

Smooth animations using Framer Motion

ClickSpark, ScrollReveal, Spotlight, and Bento-style components

Collaboration Tools:

Built-in chat dock and chat panel for real-time communication

Data Handling:

Mock data for testing dashboards

Role context and RBAC (Role-Based Access Control) utilities

🛠️ Tech Stack

Frontend: React + Vite

Styling: TailwindCSS + ShadCN/UI

Charts: Recharts

State Management: React Context API

Other Utilities:

Role-based access (rbac.js)

Utility helpers (utils.js)
