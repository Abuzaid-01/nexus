using CrudApp.API.Models.DTOs;

namespace CrudApp.API.Services
{
    public interface IAuthService
    {
        Task<LoginResponse> LoginAsync(LoginRequest request);
        Task<bool> RegisterAsync(string email, string password);
        string GenerateJwtToken(int userId, string email, bool rememberMe);
        Task<bool> ValidateMfaCodeAsync(int userId, string code);
        Task<string> EnableMfaAsync(int userId);
    }
}
