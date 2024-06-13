namespace OAuthAPI.Services;

public class KeyService
{
    public string Issuer { get; init; }
    public string Audience { get; init; }
    public string SecretKey { get; init; }
    public KeyService(string SecretKey, string Issuer, string Audience)
    {
        this.SecretKey = SecretKey;
        this.Issuer = Issuer;
        this.Audience = Audience;
    }
}