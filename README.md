# 🔗 URL Shortener

A full-stack web application that allows users to generate short, shareable links from long URLs — with redirection and basic analytics tracking.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-success)
![React](https://img.shields.io/badge/Frontend-React-blue)

---

## 🛠️ Features

- 🔗 Shortens long URLs into concise, unique short links
- 🚀 Redirects users to the original URL using the short link
- 📊 Tracks visitor data (timestamp, IP, browser user-agent)
- 🎨 Responsive frontend with React and Tailwind CSS
- 🔐 Input validation and proper error handling
- Modular backend with clean MVC structure

---

## ⚙️ Tech Stack

| Layer     | Technology                          |
|-----------|--------------------------------------|
| Frontend  | React.js, Tailwind CSS, Axios        |
| Backend   | Node.js, Express.js, MongoDB         |
| Database  | MongoDB with Mongoose ODM            |
| Version Control | Git, GitHub                    |

---

## 📁 Project Structure

url-shortener/
├── backend/
│   ├── controllers/           # Logic for creating, redirecting, and analytics
│   │   └── urlController.js
│   ├── models/                # Mongoose schemas
│   │   └── url.js
│   ├── routes/                # Express routes
│   │   └── url.js
│   ├── connect.js             # MongoDB connection logic
│   ├── server.js              # Main Express server
│   └── .env                   # Environment variables for backend
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/        # React components (e.g., Form, Output)
│   │   │   └── UrlForm.jsx
│   │   ├── App.jsx            # Root component
│   │   └── main.jsx           # Entry point
│   ├── .env                   # Environment variables for frontend
│   ├── tailwind.config.js     # Tailwind configuration
│   └── vite.config.js         # Vite (or webpack) setup
│
├── README.md                  # Project documentation
├── package.json               # Project metadata and scripts (frontend)
├── .gitignore


---

## 🔧 Getting Started

### Prerequisites

- Node.js 18.x or higher
- MongoDB (Local or MongoDB Atlas)
- Yarn or npm

---

### Backend Setup

```bash
cd backend
npm install
# or yarn
npm start
