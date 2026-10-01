using CrudApp.API.Data;
using CrudApp.API.Models;
using CrudApp.API.Models.DTOs;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BCrypt.Net;

namespace CrudApp.API.Services
{
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthService(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<LoginResponse> LoginAsync(LoginRequest request)
        {
            try
            {
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Email == request.Email && u.IsActive);

                if (user == null)
                {
                    return new LoginResponse
                    {
                        Success = false,
                        Message = "Invalid email or password"
                    };
                }

                // Verify password
                if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                {
                    return new LoginResponse
                    {
                        Success = false,
                        Message = "Invalid email or password"
                    };
                }

                // Check if MFA is enabled
                if (user.MfaEnabled)
                {
                    if (string.IsNullOrEmpty(request.MfaCode))
                    {
                        return new LoginResponse
                        {
                            Success = false,
                            RequiresMfa = true,
                            Message = "MFA code required"
                        };
                    }

                    // Validate MFA code
                    if (!await ValidateMfaCodeAsync(user.Id, request.MfaCode))
                    {
                        return new LoginResponse
                        {
                            Success = false,
                            RequiresMfa = true,
                            Message = "Invalid MFA code"
                        };
                    }
                }

                // Update last login
                user.LastLoginAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                // Generate JWT token
                var token = GenerateJwtToken(user.Id, user.Email, request.RememberMe);

                return new LoginResponse
                {
                    Success = true,
                    Token = token,
                    RequiresMfa = false,
                    Message = "Login successful",
                    User = new UserInfo
                    {
                        Id = user.Id,
                        Email = user.Email,
                        MfaEnabled = user.MfaEnabled
                    }
                };
            }
            catch (Exception ex)
            {
                return new LoginResponse
                {
                    Success = false,
                    Message = $"An error occurred during login: {ex.Message}"
                };
            }
        }

        public async Task<bool> RegisterAsync(string email, string password)
        {
            try
            {
                var existingUser = await _context.Users
                    .FirstOrDefaultAsync(u => u.Email == email);

                if (existingUser != null)
                {
                    return false;
                }

                var user = new User
                {
                    Email = email,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
                    CreatedAt = DateTime.UtcNow,
                    IsActive = true
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                return true;
            }
            catch
            {
                return false;
            }
        }

        public string GenerateJwtToken(int userId, string email, bool rememberMe)
        {
            var jwtKey = _configuration["Jwt:Key"] ?? "YourSuperSecretKeyThatIsAtLeast32CharactersLong!";
            var jwtIssuer = _configuration["Jwt:Issuer"] ?? "CrudApp.API";
            var jwtAudience = _configuration["Jwt:Audience"] ?? "CrudApp.Client";

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, userId.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var expiration = rememberMe ? DateTime.UtcNow.AddDays(30) : DateTime.UtcNow.AddHours(12);

            var token = new JwtSecurityToken(
                issuer: jwtIssuer,
                audience: jwtAudience,
                claims: claims,
                expires: expiration,
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public async Task<bool> ValidateMfaCodeAsync(int userId, string code)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null || string.IsNullOrEmpty(user.MfaSecret))
            {
                return false;
            }

            // Simple MFA validation (in production, use TOTP library like OtpNet)
            // For demo purposes, we'll use a simple time-based validation
            var currentCode = GenerateSimpleMfaCode(user.MfaSecret);
            return code == currentCode;
        }

        public async Task<string> EnableMfaAsync(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                throw new Exception("User not found");
            }

            // Generate MFA secret
            var secret = Guid.NewGuid().ToString("N");
            user.MfaSecret = secret;
            user.MfaEnabled = true;

            await _context.SaveChangesAsync();

            return secret;
        }

        private string GenerateSimpleMfaCode(string secret)
        {
            // Simple demo MFA code generation
            // In production, use proper TOTP library like OtpNet
            var timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds() / 30;
            var hash = $"{secret}{timestamp}".GetHashCode();
            return Math.Abs(hash % 1000000).ToString("D6");
        }
    }
}
