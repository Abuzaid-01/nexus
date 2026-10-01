# ⚡ Quick Start Guide

Get the application running in **5 minutes**!

## 🚀 One-Command Setup (Copy & Paste)

### Step 1: Backend Setup
```bash
cd Backend/CrudApp.API && dotnet restore && dotnet ef database update && dotnet run
```

**Expected Output:**
```
✅ Database created: CrudAppDb
✅ 3 users seeded
✅ 10 records seeded
✅ API running at http://localhost:5000
✅ Swagger at http://localhost:5000/swagger
```

### Step 2: Frontend Setup (New Terminal)
```bash
cd Frontend && npm install && npm run dev
```

**Expected Output:**
```
✅ Dependencies installed
✅ Dev server running at http://localhost:3000
```

---

## 🎯 Test It Out

1. **Open Browser:** `http://localhost:3000`

2. **Login with:**
   - Email: `admin@crudapp.com`
   - Password: `Admin@123`

3. **Try CRUD Operations:**
   - ➕ Click "Add New Record"
   - ✏️ Click Edit icon on any record
   - 🗑️ Click Delete icon
   - 🔍 Use search box

---

## 📋 Prerequisites Checklist

Before starting, ensure you have:

- [ ] **Node.js 18+** → [Download](https://nodejs.org/)
- [ ] **.NET SDK 8.0** → [Download](https://dotnet.microsoft.com/download)
- [ ] **SQL Server** (LocalDB, Express, or Full) → [Download](https://www.microsoft.com/sql-server)

### Quick Verification:
```bash
node --version    # Should be v18+
npm --version     # Should be 9+
dotnet --version  # Should be 8.0+
```

---

## 🛠️ Common Issues & Fixes

### ❌ "dotnet ef command not found"
```bash
dotnet tool install --global dotnet-ef
```

### ❌ "Cannot connect to database"
**Option 1:** Use SQL Server LocalDB (Recommended)
```
Server=(localdb)\\mssqllocaldb;Database=CrudAppDb;Trusted_Connection=True
```

**Option 2:** Use SQL Server Express
```
Server=.\\SQLEXPRESS;Database=CrudAppDb;Trusted_Connection=True
```

### ❌ "Port 5000 already in use"
Kill the process:
```bash
# Mac/Linux
lsof -ti:5000 | xargs kill -9

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### ❌ "npm install fails"
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

## 🎨 What You Get

### Login Page
- 🔐 Secure authentication
- 🛡️ MFA support
- 💾 Remember me
- 🔑 Forgot password
- 👁️ Show/hide password

### Dashboard
- ➕ Add records
- ✏️ Edit records
- 🗑️ Delete records
- 🔍 Search records
- 📊 Data table
- 🚪 Logout

---

## 🔑 Test Accounts

| Email | Password | Records |
|-------|----------|---------|
| admin@crudapp.com | Admin@123 | 4 records |
| user@example.com | User@123 | 3 records |
| demo@crudapp.com | Demo@123 | 3 records |

---

## 📸 Expected Result

After setup, you should see:

1. **Backend Terminal:**
   ```
   Now listening on: http://localhost:5000
   ```

2. **Frontend Terminal:**
   ```
   Local: http://localhost:3000
   ```

3. **Browser:**
   - Beautiful login page with gradient background
   - After login: Dashboard with 10 sample records

---

## 🎯 Next Steps

1. ✅ Successfully logged in? **Awesome!**
2. 📚 Read the full [README.md](README.md) for detailed documentation
3. 🔒 Check [SECURITY.md](SECURITY.md) for security features
4. 🚀 Ready to deploy? See deployment section in README

---

## 💡 Pro Tips

**For Development:**
```bash
# Backend with hot reload
dotnet watch run

# Frontend with hot reload (default in Vite)
npm run dev
```

**API Testing:**
- Visit `http://localhost:5000/swagger` for interactive API docs
- Test endpoints without frontend

**Database Inspection:**
- Use **Azure Data Studio** or **SQL Server Management Studio**
- Connect to: `(localdb)\mssqllocaldb`
- Database: `CrudAppDb`

---

## 🆘 Still Having Issues?

1. Check if all prerequisites are installed
2. Ensure ports 5000 and 3000 are available
3. Verify SQL Server is running
4. Read the full README.md for troubleshooting
5. Check firewall settings

---

**🎉 Enjoy your CRUD Management System!**

For detailed documentation, see [README.md](README.md)
