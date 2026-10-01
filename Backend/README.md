# Backend API Documentation

## Quick Start

```bash
cd Backend/CrudApp.API
dotnet restore
dotnet ef database update
dotnet run
```

API will be available at: **http://localhost:5000**
Swagger UI: **http://localhost:5000/swagger**

## Test Credentials

| Email | Password |
|-------|----------|
| admin@crudapp.com | Admin@123 |
| user@example.com | User@123 |
| demo@crudapp.com | Demo@123 |

## Key Features

✅ JWT Authentication with Bearer tokens
✅ BCrypt password hashing
✅ Rate limiting (5 login attempts/min)
✅ CORS protection
✅ Security headers
✅ Entity Framework Core with SQL Server
✅ Automatic database seeding
✅ Swagger API documentation
✅ Input validation

## Database Commands

```bash
# Create migration
dotnet ef migrations add MigrationName

# Apply migrations
dotnet ef database update

# Drop database
dotnet ef database drop

# Remove last migration
dotnet ef migrations remove
```

## Configuration

Edit `appsettings.json` to configure:
- Connection string
- JWT settings (Key, Issuer, Audience)
- Rate limiting rules
