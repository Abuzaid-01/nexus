# 🚀 CRUD Management System

A full-stack web application with **React** frontend, **.NET Core** backend, **SQL Server** database, featuring secure authentication with **MFA (Multi-Factor Authentication)** and enterprise-grade security.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![.NET](https://img.shields.io/badge/.NET-8.0-purple.svg)
![React](https://img.shields.io/badge/React-18.3-blue.svg)
![SQL Server](https://img.shields.io/badge/SQL%20Server-2022-red.svg)

---

## ✨ Features

### 🔐 Security Features
- **JWT Authentication** - Secure token-based authentication
- **MFA Support** - Multi-factor authentication for enhanced security
- **BCrypt Password Hashing** - Industry-standard password encryption
- **Rate Limiting** - Protection against brute force attacks (5 login attempts/minute)
- **CORS Protection** - Configured cross-origin resource sharing
- **Security Headers** - XSS protection, frame options, content type options
- **Input Validation** - Server and client-side validation

### 📝 CRUD Operations
- **Create** - Add new records with validation
- **Read** - View all records with search functionality
- **Update** - Edit existing records
- **Delete** - Remove records with confirmation

### 🎨 Modern UI/UX
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Beautiful Gradients** - Modern color schemes
- **Smooth Animations** - Fade-in, slide-in effects
- **Loading States** - Visual feedback for async operations
- **Error Handling** - User-friendly error messages
- **Toast Notifications** - Real-time feedback

### 👤 User Management
- Login with email/password
- Remember me functionality
- Forgot password feature
- User session management
- Secure logout

---

## 🛠️ Technology Stack

### Backend
- **.NET Core 8.0** - Modern web framework
- **Entity Framework Core** - ORM for database operations
- **SQL Server** - Relational database
- **JWT Bearer** - Authentication middleware
- **BCrypt.NET** - Password hashing
- **AspNetCoreRateLimit** - Rate limiting
- **Swagger/OpenAPI** - API documentation

### Frontend
- **React 18.3** - UI library
- **Vite** - Fast build tool
- **React Router** - Navigation
- **Axios** - HTTP client
- **React Toastify** - Notifications
- **Lucide React** - Icon library
- **CSS3** - Modern styling with gradients and animations

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **.NET SDK 8.0** - [Download](https://dotnet.microsoft.com/download)
- **SQL Server** (LocalDB, Express, or Developer Edition) - [Download](https://www.microsoft.com/sql-server/sql-server-downloads)
- **Visual Studio Code** or **Visual Studio 2022** (optional but recommended)

---

## 🚀 Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone <repository-url>
cd extra
```

### 2️⃣ Backend Setup

#### Step 1: Navigate to Backend Directory
```bash
cd Backend/CrudApp.API
```

#### Step 2: Restore NuGet Packages
```bash
dotnet restore
```

#### Step 3: Update Database Connection String (if needed)
Open `appsettings.json` and modify the connection string:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=CrudAppDb;Trusted_Connection=True;MultipleActiveResultSets=true"
  }
}
```

**Alternative Connection Strings:**

- **SQL Server Express:**
  ```
  Server=.\\SQLEXPRESS;Database=CrudAppDb;Trusted_Connection=True;MultipleActiveResultSets=true
  ```

- **SQL Server with Authentication:**
  ```
  Server=localhost;Database=CrudAppDb;User Id=sa;Password=YourPassword;Encrypt=False
  ```

#### Step 4: Install EF Core Tools (if not already installed)
```bash
dotnet tool install --global dotnet-ef
```

#### Step 5: Apply Database Migrations
```bash
dotnet ef database update
```

This will:
- Create the `CrudAppDb` database
- Create `Users` and `Records` tables
- Seed test data automatically

#### Step 6: Run the Backend
```bash
dotnet run
```

The API will start at: **http://localhost:5000**

Swagger UI: **http://localhost:5000/swagger**

### 3️⃣ Frontend Setup

#### Step 1: Navigate to Frontend Directory
```bash
cd ../../Frontend
```

#### Step 2: Install Dependencies
```bash
npm install
```

#### Step 3: Start Development Server
```bash
npm run dev
```

The app will start at: **http://localhost:3000**

---

## 🔑 Test Credentials

The database is automatically seeded with test users:

| Email | Password | Description |
|-------|----------|-------------|
| `admin@crudapp.com` | `Admin@123` | Administrator account |
| `user@example.com` | `User@123` | Regular user account |
| `demo@crudapp.com` | `Demo@123` | Demo account |

**Note:** 10 sample records are also pre-populated for testing CRUD operations.

---

## 📖 Usage Guide

### Login
1. Open your browser to `http://localhost:3000`
2. Enter your email and password
3. Check "Remember Me" to stay logged in for 30 days
4. Click **Sign In**

### CRUD Operations

#### Add New Record
1. Click **"Add New Record"** button
2. Fill in the form:
   - Name (required)
   - Email (required, valid format)
   - Mobile (required, valid phone number)
   - Address (required)
3. Click **Save**

#### Edit Record
1. Click the **Edit** icon (pencil) on any record
2. Modify the fields
3. Click **Update**

#### Delete Record
1. Click the **Delete** icon (trash) on any record
2. Confirm the deletion

#### Search Records
- Use the search box to filter by name, email, mobile, or address

---

## 🔒 Security Features Explained

### 1. Password Hashing
- Uses **BCrypt** with salt rounds
- Passwords are never stored in plain text
- One-way hashing prevents reverse engineering

### 2. JWT Authentication
- Token-based authentication
- Tokens expire after 12 hours (or 30 days with "Remember Me")
- Tokens include user ID and email claims

### 3. Rate Limiting
- **General API calls:** 100 requests per minute
- **Login endpoint:** 5 requests per minute
- Prevents brute force attacks

### 4. CORS Protection
- Only allows requests from `http://localhost:3000` and `http://localhost:5173`
- Configurable for production domains

### 5. Security Headers
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

### 6. Input Validation
- Client-side validation with real-time feedback
- Server-side validation with data annotations
- Email format validation
- Phone number format validation
- String length limits

---

## 📁 Project Structure

```
extra/
├── Backend/
│   └── CrudApp.API/
│       ├── Controllers/
│       │   ├── AuthController.cs       # Authentication endpoints
│       │   └── RecordsController.cs    # CRUD endpoints
│       ├── Data/
│       │   ├── ApplicationDbContext.cs # EF Core context
│       │   └── DbInitializer.cs        # Seed data
│       ├── Models/
│       │   ├── User.cs                 # User entity
│       │   ├── Record.cs               # Record entity
│       │   └── DTOs/                   # Data transfer objects
│       ├── Services/
│       │   ├── IAuthService.cs         # Auth interface
│       │   └── AuthService.cs          # Auth implementation
│       ├── Migrations/
│       │   └── InitialCreate.cs        # Database migration
│       ├── Scripts/
│       │   ├── setup-database.sql      # Manual DB setup
│       │   └── migration-commands.md   # EF commands
│       ├── Program.cs                  # App entry point
│       ├── appsettings.json            # Configuration
│       └── CrudApp.API.csproj          # Project file
│
├── Frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx           # Login page
│   │   │   ├── LoginPage.css
│   │   │   ├── DashboardPage.jsx       # CRUD dashboard
│   │   │   └── DashboardPage.css
│   │   ├── context/
│   │   │   └── AuthContext.jsx         # Auth state management
│   │   ├── services/
│   │   │   └── api.js                  # API client
│   │   ├── App.jsx                     # Main app component
│   │   ├── main.jsx                    # App entry point
│   │   └── index.css                   # Global styles
│   ├── index.html
│   ├── vite.config.js                  # Vite configuration
│   └── package.json
│
└── README.md                            # This file
```

---

## 🔧 Configuration

### Backend Configuration (appsettings.json)

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Your SQL Server connection string"
  },
  "Jwt": {
    "Key": "Change this to a secure 32+ character key in production",
    "Issuer": "CrudApp.API",
    "Audience": "CrudApp.Client"
  },
  "IpRateLimiting": {
    "EnableEndpointRateLimiting": true,
    "GeneralRules": [
      {
        "Endpoint": "*",
        "Period": "1m",
        "Limit": 100
      },
      {
        "Endpoint": "*/api/auth/login",
        "Period": "1m",
        "Limit": 5
      }
    ]
  }
}
```

### Frontend Configuration (src/services/api.js)

```javascript
const API_BASE_URL = 'http://localhost:5000/api'
```

Change this to your production API URL when deploying.

---

## 🐛 Troubleshooting

### Backend Issues

**Error: "Cannot connect to database"**
- Ensure SQL Server is running
- Verify connection string in `appsettings.json`
- Try using SQL Server Express or LocalDB

**Error: "Database does not exist"**
- Run: `dotnet ef database update`
- Or manually run: `Scripts/setup-database.sql`

**Port 5000 already in use**
- Change port in `Properties/launchSettings.json`
- Update frontend API URL accordingly

### Frontend Issues

**Error: "Cannot connect to API"**
- Ensure backend is running on port 5000
- Check CORS configuration
- Verify API_BASE_URL in `src/services/api.js`

**npm install fails**
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

---

## 🚢 Deployment

### Backend Deployment

1. **Update Production Configuration**
   - Change JWT secret key
   - Update connection string
   - Set appropriate CORS origins
   - Enable HTTPS redirection

2. **Publish the application**
   ```bash
   dotnet publish -c Release -o ./publish
   ```

3. **Deploy to:**
   - Azure App Service
   - IIS
   - Docker container
   - AWS Elastic Beanstalk

### Frontend Deployment

1. **Build for production**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder to:**
   - Vercel
   - Netlify
   - Azure Static Web Apps
   - AWS S3 + CloudFront
   - GitHub Pages

3. **Update API URL** in `src/services/api.js` to production backend URL

---

## 📝 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/forgot-password` - Password reset

### Records (Requires Authentication)
- `GET /api/records` - Get all records
- `GET /api/records/{id}` - Get record by ID
- `POST /api/records` - Create new record
- `PUT /api/records/{id}` - Update record
- `DELETE /api/records/{id}` - Delete record

**All endpoints require JWT token in Authorization header:**
```
Authorization: Bearer <your-token>
```

---

## 🎯 Future Enhancements

- [ ] Email verification
- [ ] Password reset via email
- [ ] Proper TOTP-based MFA (using OtpNet)
- [ ] User profile management
- [ ] Export records to CSV/PDF
- [ ] File upload support
- [ ] Advanced filtering and sorting
- [ ] Pagination for large datasets
- [ ] Role-based access control (RBAC)
- [ ] Audit logging
- [ ] Two-factor authentication via SMS
- [ ] Social media login (OAuth)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Author

Created with ❤️ by Your Team

---

## 📞 Support

For support, email support@crudapp.com or create an issue in the repository.

---

## 🙏 Acknowledgments

- React Team for the amazing framework
- Microsoft for .NET Core
- All open-source contributors
- Icons by Lucide React
- UI inspiration from modern design systems

---

## 📸 Screenshots

### Login Page
Beautiful gradient background with secure authentication including MFA support, remember me, and forgot password functionality.

### Dashboard
Modern CRUD interface with real-time search, add/edit modal, and responsive data table with edit and delete actions.

---

**⭐ If you find this project helpful, please give it a star!**
