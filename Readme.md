# LinkShort – URL Shortener

A full-stack URL shortener built with the MERN stack. Create short links, customize URLs, track clicks, and analyze link performance through a clean dashboard.

## 🌐 Live Demo

**[Visit LinkShort](https://link-short-flame.vercel.app)**

## ✨ Features

- User authentication with JWT
- Create short URLs instantly
- Custom short URL aliases
- Set expiration dates for links
- Track link clicks and view analytics
- Generate and download QR codes
- Copy and share short links
- Delete existing links
- Automatic redirection to original URLs
- Responsive user interface
- Persistent login session after page refresh

## 🛠️ Tech Stack

**Frontend**
- React.js
- Vite
- Axios
- CSS

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt

**Deployment**
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

## 🏗️ Architecture

The application follows a client-server architecture:

1. React frontend handles the user interface.
2. Axios sends API requests to the Express backend.
3. Backend handles authentication, URL generation, redirects, and analytics.
4. MongoDB stores user accounts, URLs, and click information.

## 📁 Project Structure

```text
LinkShort/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── server.js
│   └── package.json
│
└── README.md
```

## ⚙️ Run Locally

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd LinkShort
```

### 2. Setup Backend

```bash
cd server
npm install
```

Create a `.env` file inside the server folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
CLIENT_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

### 3. Setup Frontend

Open another terminal:

```bash
cd client
npm install
npm run dev
```

Configure the frontend API base URL to point to your backend.

## 🔐 Security

- Password hashing using bcrypt
- JWT-based authentication
- Protected backend routes
- Environment variables for sensitive configuration

## 👨‍💻 Author

**Your Name**

[GitHub](YOUR_GITHUB_PROFILE_URL)
