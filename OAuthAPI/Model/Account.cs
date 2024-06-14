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
    
    public Account(string username, string email)
    {
        Username = username;
        Email = email;
        Id = Guid.NewGuid();
    }
    public void SetPassword(string password)
    {
        Password = HashPassword(password);
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