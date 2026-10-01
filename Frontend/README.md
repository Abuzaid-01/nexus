# Frontend Application Documentation

## Quick Start

```bash
cd Frontend
npm install
npm run dev
```

App will be available at: **http://localhost:3000**

## Test Login

Use any of these credentials:
- **Email:** admin@crudapp.com | **Password:** Admin@123
- **Email:** user@example.com | **Password:** User@123
- **Email:** demo@crudapp.com | **Password:** Demo@123

## Features

### Login Page
- Email/Password authentication
- Remember me checkbox
- Forgot password link
- MFA code input support
- Password visibility toggle
- Beautiful gradient design
- Responsive layout

### Dashboard Page
- Add new records with validation
- Edit existing records
- Delete with confirmation
- Real-time search
- Responsive data table
- User info display
- Logout functionality

## Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Tech Stack

- **React 18.3** - UI Library
- **Vite** - Build tool
- **React Router DOM** - Routing
- **Axios** - HTTP client
- **React Toastify** - Notifications
- **Lucide React** - Icons

## Project Structure

```
src/
├── pages/
│   ├── LoginPage.jsx         # Login page with auth
│   ├── LoginPage.css
│   ├── DashboardPage.jsx     # CRUD operations
│   └── DashboardPage.css
├── context/
│   └── AuthContext.jsx       # Global auth state
├── services/
│   └── api.js                # API calls
├── App.jsx                   # Routes & providers
├── main.jsx                  # Entry point
└── index.css                 # Global styles
```

## Configuration

Update API base URL in `src/services/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:5000/api'
```

Change to your production API URL for deployment.

## Build for Production

```bash
npm run build
```

The `dist` folder will contain the optimized production build ready for deployment.
