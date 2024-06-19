namespace OAuthAPI.Services;

public class KeyService
{
    public string Issuer { get; init; }
    public string Audience { get; init; }
    public string SecretKey { get; init; }
    public string ClientSecret { get; init; }
    public KeyService(string secretKey, string issuer, string audience, string clientSecret)
    {
        this.SecretKey = secretKey;
        this.Issuer = issuer;
        this.Audience = audience;
        this.ClientSecret = clientSecret;
    }
}