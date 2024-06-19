using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using OAuthAPI.Model;

namespace OAuthAPI.Services;

public class TokenService
{
    
    private static readonly TimeSpan TokenLifetime = TimeSpan.FromHours(5);
    private readonly JwtSecurityTokenHandler _tokenHandler;
    private readonly KeyService _keyService;
    public Dictionary<string,string> AccessCodes = new(); // email, accessCode
    public TokenService(JwtSecurityTokenHandler tokenHandler, KeyService keyService)
    {
        _tokenHandler = tokenHandler;
        _keyService = keyService;
    }

    public string? VerifyToken(string token)
    {
        var tokenValidationParameters = new TokenValidationParameters()
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidIssuer = _keyService.Issuer,
            ValidAudience = _keyService.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_keyService.SecretKey))
        };

        try
        {
            var claims = _tokenHandler.ValidateToken(token, tokenValidationParameters, out _);
            return claims.FindFirst(JwtRegisteredClaimNames.Email)?.Value;
        }
        catch
        {
            return null;
        }
    }

    public string GenerateAccessCode(Account user)
    {
        // Generate a new random access code
        var randomNumber = new byte[32];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomNumber);
        var accessCode = Convert.ToBase64String(randomNumber);
        AccessCodes.Add(user.Email, accessCode);
        return accessCode;
    }
    
    public bool ValidateAccessCode(string providedCode, string accessCode)
    {
        // Hash the provided access code with the client secret 
        using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(_keyService.ClientSecret));
        var newHashedAccessCode = hmac.ComputeHash(Encoding.UTF8.GetBytes(accessCode));

        // Convert the byte array to a string
        var newHashedAccessCodeStr = Convert.ToBase64String(newHashedAccessCode);

        // Compare the newly hashed access code with the provided hashed access code
        return newHashedAccessCodeStr == providedCode;
    }
    
    public Tokens GenerateToken(Account user)
    {
        var tokenDescriptor = new SecurityTokenDescriptor()
        {
            Subject = new ClaimsIdentity(new Claim[]
            {
                new(JwtRegisteredClaimNames.Email, user.Email),
                new(JwtRegisteredClaimNames.NameId, user.Id.ToString())
            }),
            Expires = DateTime.UtcNow.Add(TokenLifetime),
            Issuer = _keyService.Issuer,
            Audience = _keyService.Audience,
            SigningCredentials = new SigningCredentials
            (
                new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_keyService.SecretKey)),
                SecurityAlgorithms.HmacSha256Signature
            )
        };
        
        var token = _tokenHandler.CreateToken(tokenDescriptor);
        var accessToken = _tokenHandler.WriteToken(token);

        // Generate refresh token
        var randomNumber = new byte[32];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomNumber);
        var refreshToken = Convert.ToBase64String(randomNumber);

        user.RefreshToken = refreshToken;
        // Set refresh token expiry time to 6 months in the future
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddMonths(5);

        return new Tokens
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken
        };
    }
}