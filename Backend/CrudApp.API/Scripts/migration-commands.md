# Entity Framework Core Migration Commands

## Prerequisites
Make sure you have the .NET EF Core tools installed:
```bash
dotnet tool install --global dotnet-ef
```

## Create Initial Migration
```bash
cd Backend/CrudApp.API
dotnet ef migrations add InitialCreate
```

## Apply Migration to Database
```bash
dotnet ef database update
```

## Create New Migration (after model changes)
```bash
dotnet ef migrations add YourMigrationName
dotnet ef database update
```

## Remove Last Migration (if not applied)
```bash
dotnet ef migrations remove
```

## Drop Database
```bash
dotnet ef database drop
```

## List All Migrations
```bash
dotnet ef migrations list
```

## Generate SQL Script
```bash
dotnet ef migrations script
```

## Connection String
The default connection string is configured in `appsettings.json`:
```
Server=(localdb)\\mssqllocaldb;Database=CrudAppDb;Trusted_Connection=True;MultipleActiveResultSets=true
```

## Alternative: Use SQL Script
If you prefer to create the database manually, run:
```bash
# Using SQL Server Management Studio or Azure Data Studio
# Open and execute: Scripts/setup-database.sql
```

## Seed Data
The application automatically seeds the database with:

### Test Users:
- **Email:** admin@crudapp.com | **Password:** Admin@123
- **Email:** user@example.com | **Password:** User@123
- **Email:** demo@crudapp.com | **Password:** Demo@123

### Sample Records:
10 pre-populated records for testing CRUD operations

## Troubleshooting

### If you get "No connection string" error:
Update the connection string in `appsettings.json` to match your SQL Server instance.

### If using SQL Server Express:
```
Server=.\\SQLEXPRESS;Database=CrudAppDb;Trusted_Connection=True;MultipleActiveResultSets=true
```

### If using Azure SQL:
```
Server=tcp:yourserver.database.windows.net,1433;Database=CrudAppDb;User ID=yourusername;Password=yourpassword;Encrypt=True;
```
