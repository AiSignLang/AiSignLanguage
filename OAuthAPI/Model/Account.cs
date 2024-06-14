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
    // making that the hash is correct
    public void SetPassword(string password)
    {
        var salt = Environment.GetEnvironmentVariable("SALT") ?? throw new Exception("Salt not set in Environment Variables!");
        Password = HashPassword(password+salt);
    }
    private string HashPassword(string password)
    {
        var passwordHasher = new PasswordHasher<Account>();
        return passwordHasher.HashPassword(this, password);
    }
    
    public bool VerifyPassword(string providedPassword)
    {
        var passwordHasher = new PasswordHasher<Account>();
        var salt = Environment.GetEnvironmentVariable("SALT") ?? throw new Exception("Salt not set in Environment Variables!");

        var verificationResult = passwordHasher.VerifyHashedPassword(this, this.Password, providedPassword+salt);

        return verificationResult == PasswordVerificationResult.Success;
    }
}