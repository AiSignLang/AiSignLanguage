using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using OAuthAPI.Model;

namespace OAuthAPI.Services;

public class TokenService
{
    
    private static readonly TimeSpan TokenLifetime = TimeSpan.FromHours(8);
    private readonly JwtSecurityTokenHandler _tokenHandler;
    private readonly KeyService _keyService;

    public TokenService(JwtSecurityTokenHandler tokenHandler, KeyService keyService)
    {
        _tokenHandler = tokenHandler;
        _keyService = keyService;
    }

    public Tokens GenerateToken(Account user)
    {
        var tokenDescriptor = new SecurityTokenDescriptor()
        {
            Subject = new ClaimsIdentity(new Claim[]
            {
                new(JwtRegisteredClaimNames.Name,user.Username),
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