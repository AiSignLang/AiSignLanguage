using Microsoft.AspNetCore.Identity;

namespace OAuthAPI.Model;

public class Account
{
    public string Username { get; set; }
    public string Password { get; set; }
    public string Email { get; set; }
    public Guid Id { get; set; }
    
    public string? RefreshToken { get; set; }
    public DateTime RefreshTokenExpiryTime { get; set; }
    
    public Account(string username, string password, string email)
    {
        Username = username;
        Password = HashPassword(password);
        Email = email;
        Id = Guid.NewGuid();
    }
    
    private string HashPassword(string password)
    {
        var passwordHasher = new PasswordHasher<Account>();
        return passwordHasher.HashPassword(this, password);
    }
    
    public bool VerifyPassword(string providedPassword)
    {
        var passwordHasher = new PasswordHasher<Account>();
        var verificationResult = passwordHasher.VerifyHashedPassword(this, this.Password, providedPassword);

        return verificationResult == PasswordVerificationResult.Success;
    }
}