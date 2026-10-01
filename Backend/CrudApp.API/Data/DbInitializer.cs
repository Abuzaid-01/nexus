using CrudApp.API.Models;
using BCrypt.Net;

namespace CrudApp.API.Data
{
    public static class DbInitializer
    {
        public static void Initialize(ApplicationDbContext context)
        {
            // Ensure database is created
            context.Database.EnsureCreated();

            // Check if data already exists
            if (context.Users.Any())
            {
                return; // DB has been seeded
            }

            // Seed Users
            var users = new User[]
            {
                new User
                {
                    Email = "admin@crudapp.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                    MfaEnabled = false,
                    CreatedAt = DateTime.UtcNow,
                    IsActive = true
                },
                new User
                {
                    Email = "user@example.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("User@123"),
                    MfaEnabled = false,
                    CreatedAt = DateTime.UtcNow,
                    IsActive = true
                },
                new User
                {
                    Email = "demo@crudapp.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Demo@123"),
                    MfaEnabled = false,
                    CreatedAt = DateTime.UtcNow,
                    IsActive = true
                }
            };

            context.Users.AddRange(users);
            context.SaveChanges();

            // Seed Records
            var records = new Record[]
            {
                new Record
                {
                    Name = "John Doe",
                    Email = "john.doe@example.com",
                    Mobile = "+1-555-0101",
                    Address = "123 Main St, New York, NY 10001",
                    CreatedByUserId = 1,
                    CreatedAt = DateTime.UtcNow
                },
                new Record
                {
                    Name = "Jane Smith",
                    Email = "jane.smith@example.com",
                    Mobile = "+1-555-0102",
                    Address = "456 Oak Ave, Los Angeles, CA 90001",
                    CreatedByUserId = 1,
                    CreatedAt = DateTime.UtcNow
                },
                new Record
                {
                    Name = "Michael Johnson",
                    Email = "michael.j@example.com",
                    Mobile = "+1-555-0103",
                    Address = "789 Pine Rd, Chicago, IL 60601",
                    CreatedByUserId = 1,
                    CreatedAt = DateTime.UtcNow
                },
                new Record
                {
                    Name = "Sarah Williams",
                    Email = "sarah.w@example.com",
                    Mobile = "+1-555-0104",
                    Address = "321 Elm St, Houston, TX 77001",
                    CreatedByUserId = 1,
                    CreatedAt = DateTime.UtcNow
                },
                new Record
                {
                    Name = "David Brown",
                    Email = "david.brown@example.com",
                    Mobile = "+1-555-0105",
                    Address = "654 Maple Dr, Phoenix, AZ 85001",
                    CreatedByUserId = 2,
                    CreatedAt = DateTime.UtcNow
                },
                new Record
                {
                    Name = "Emily Davis",
                    Email = "emily.davis@example.com",
                    Mobile = "+1-555-0106",
                    Address = "987 Cedar Ln, Philadelphia, PA 19101",
                    CreatedByUserId = 2,
                    CreatedAt = DateTime.UtcNow
                },
                new Record
                {
                    Name = "Robert Miller",
                    Email = "robert.m@example.com",
                    Mobile = "+1-555-0107",
                    Address = "147 Birch Blvd, San Antonio, TX 78201",
                    CreatedByUserId = 2,
                    CreatedAt = DateTime.UtcNow
                },
                new Record
                {
                    Name = "Lisa Anderson",
                    Email = "lisa.a@example.com",
                    Mobile = "+1-555-0108",
                    Address = "258 Spruce St, San Diego, CA 92101",
                    CreatedByUserId = 3,
                    CreatedAt = DateTime.UtcNow
                },
                new Record
                {
                    Name = "Thomas Wilson",
                    Email = "thomas.w@example.com",
                    Mobile = "+1-555-0109",
                    Address = "369 Willow Way, Dallas, TX 75201",
                    CreatedByUserId = 3,
                    CreatedAt = DateTime.UtcNow
                },
                new Record
                {
                    Name = "Jennifer Martinez",
                    Email = "jennifer.m@example.com",
                    Mobile = "+1-555-0110",
                    Address = "741 Ash Ave, San Jose, CA 95101",
                    CreatedByUserId = 3,
                    CreatedAt = DateTime.UtcNow
                }
            };

            context.Records.AddRange(records);
            context.SaveChanges();
        }
    }
}
