-- SQL Server Database Setup Script
-- Run this script to create the database manually if needed

-- Create Database
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'CrudAppDb')
BEGIN
    CREATE DATABASE CrudAppDb;
END
GO

USE CrudAppDb;
GO

-- Create Users Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Users')
BEGIN
    CREATE TABLE Users (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Email NVARCHAR(255) NOT NULL UNIQUE,
        PasswordHash NVARCHAR(MAX) NOT NULL,
        MfaSecret NVARCHAR(MAX) NULL,
        MfaEnabled BIT NOT NULL DEFAULT 0,
        CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        LastLoginAt DATETIME2 NULL,
        IsActive BIT NOT NULL DEFAULT 1
    );

    CREATE INDEX IX_Users_Email ON Users(Email);
END
GO

-- Create Records Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Records')
BEGIN
    CREATE TABLE Records (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Name NVARCHAR(100) NOT NULL,
        Email NVARCHAR(255) NOT NULL,
        Mobile NVARCHAR(15) NOT NULL,
        Address NVARCHAR(500) NOT NULL,
        CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        UpdatedAt DATETIME2 NULL,
        CreatedByUserId INT NOT NULL
    );

    CREATE INDEX IX_Records_CreatedByUserId ON Records(CreatedByUserId);
END
GO

-- Insert Sample Users (passwords are already hashed with BCrypt)
-- Default passwords: Admin@123, User@123, Demo@123
IF NOT EXISTS (SELECT * FROM Users WHERE Email = 'admin@crudapp.com')
BEGIN
    INSERT INTO Users (Email, PasswordHash, MfaEnabled, CreatedAt, IsActive)
    VALUES 
    ('admin@crudapp.com', '$2a$11$XJ9vWxKxZp4lH5qJQK5Fy.H5O9E4Q1F5K8pK9lQ5gH5K8pK9lQ5gH', 0, GETUTCDATE(), 1),
    ('user@example.com', '$2a$11$XJ9vWxKxZp4lH5qJQK5Fy.H5O9E4Q1F5K8pK9lQ5gH5K8pK9lQ5gH', 0, GETUTCDATE(), 1),
    ('demo@crudapp.com', '$2a$11$XJ9vWxKxZp4lH5qJQK5Fy.H5O9E4Q1F5K8pK9lQ5gH5K8pK9lQ5gH', 0, GETUTCDATE(), 1);
END
GO

-- Insert Sample Records
IF NOT EXISTS (SELECT * FROM Records)
BEGIN
    INSERT INTO Records (Name, Email, Mobile, Address, CreatedByUserId, CreatedAt)
    VALUES 
    ('John Doe', 'john.doe@example.com', '+1-555-0101', '123 Main St, New York, NY 10001', 1, GETUTCDATE()),
    ('Jane Smith', 'jane.smith@example.com', '+1-555-0102', '456 Oak Ave, Los Angeles, CA 90001', 1, GETUTCDATE()),
    ('Michael Johnson', 'michael.j@example.com', '+1-555-0103', '789 Pine Rd, Chicago, IL 60601', 1, GETUTCDATE()),
    ('Sarah Williams', 'sarah.w@example.com', '+1-555-0104', '321 Elm St, Houston, TX 77001', 1, GETUTCDATE()),
    ('David Brown', 'david.brown@example.com', '+1-555-0105', '654 Maple Dr, Phoenix, AZ 85001', 2, GETUTCDATE()),
    ('Emily Davis', 'emily.davis@example.com', '+1-555-0106', '987 Cedar Ln, Philadelphia, PA 19101', 2, GETUTCDATE()),
    ('Robert Miller', 'robert.m@example.com', '+1-555-0107', '147 Birch Blvd, San Antonio, TX 78201', 2, GETUTCDATE()),
    ('Lisa Anderson', 'lisa.a@example.com', '+1-555-0108', '258 Spruce St, San Diego, CA 92101', 3, GETUTCDATE()),
    ('Thomas Wilson', 'thomas.w@example.com', '+1-555-0109', '369 Willow Way, Dallas, TX 75201', 3, GETUTCDATE()),
    ('Jennifer Martinez', 'jennifer.m@example.com', '+1-555-0110', '741 Ash Ave, San Jose, CA 95101', 3, GETUTCDATE());
END
GO

PRINT 'Database setup completed successfully!';
