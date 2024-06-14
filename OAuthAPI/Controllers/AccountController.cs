using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using OAuthAPI.Model;
using OAuthAPI.Services;


namespace OAuthAPI.Controllers;
[Route("[controller]")]
[ApiController]
public class AccountController(DataContext context, TokenService tokenService, EmailService emailService) : ControllerBase
{
   
    [HttpPost("Register")]
    public async Task<IActionResult> Register([FromBody] RegisterModel model)
    {
        if (context.Accounts.Any(a => a.Username == model.Username))
        {
            return BadRequest("Username already exists");
        }

        if (context.Accounts.Any(a => a.Email == model.Email))
        {
            return BadRequest("Email already exists");
        }
        var invalids = new List<string>();
        if(model.Email == null) invalids.Add("Invalid email");
        if(model.Username == "") invalids.Add("Invalid username");
        if(model.Password == "") invalids.Add("Invalid password");
        
        if(invalids.Count > 0)
        {
            return BadRequest(invalids.ToArray());
        }
        
        var account = new Account(model.Username,  model.Email!);
        account.SetPassword(model.Password);
        //await emailService.SendEmailAsync(model.Email, "Welcome to AiSL", "You have successfully registered!");
        context.Accounts.Add(account);
        await context.SaveChangesAsync();

        return Ok();
    }

    [HttpPost("Login")]
    public IActionResult Login([FromBody] LoginModel model)
    {
        Account account =context.Accounts.FirstOrDefault(a => a.Email == model.Email);
        
        if (account == null || !account.VerifyPassword(model.Password))
        {
            return Unauthorized("Invalid username or password");
        }

        var tokens = tokenService.GenerateToken(account);
        context.SaveChangesAsync();
        return Ok(tokens);
    }    
   
    [HttpPost("[action]")]
    public IActionResult RefreshToken([FromQuery] string refreshToken)
    {
        var account = context.Accounts.FirstOrDefault(a => a.RefreshToken == refreshToken);

        if (account == null || account.RefreshTokenExpiryTime < DateTime.UtcNow)
        {
            return BadRequest("Invalid refresh token");
        }

        var tokens = tokenService.GenerateToken(account);
        context.SaveChangesAsync();
        return Ok(tokens);
    }
    
    [HttpPost("[action]")]
    public IActionResult RevokeToken([FromQuery] string refreshToken)
    {
        var account = context.Accounts.FirstOrDefault(a => a.RefreshToken == refreshToken);

        if (account == null)
        {
            return BadRequest("Invalid refresh token");
        }

        account.RefreshToken = null;
        account.RefreshTokenExpiryTime = DateTime.UtcNow;
        context.SaveChangesAsync();

        return Ok();
    }

    [Authorize]
    [HttpGet]
    public IActionResult GetAccount()
    {
        var id = GetGuidFromToken(HttpContext);
        if (id == null) return BadRequest("User not found");
        var account = context.Accounts.FirstOrDefault(a => a.Id == Guid.Parse(id!));
        if(account == null) return BadRequest("User not found");
        return Ok(
            new AccountInfoModel
            {
                Username = account.Username,
                Email = account.Email,
                Id = account.Id.ToString()
            });
    }
    
    
    
    [HttpGet("confirm-email")]
    public IActionResult Confirm()
    {
        
        return Ok(context.Accounts.ToList());
    }
    
    public static string? GetGuidFromToken(HttpContext httpContext)
    {
        var identity = httpContext.User.Identity as ClaimsIdentity;
        if (identity == null) return null;
        var claim = identity.Claims.ToList().Find(c => c.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier");
        
        if(claim == null) return null;
        return claim.Value;
    }
    public static string? GetUserNameFromToken(HttpContext httpContext)
    {
        var identity = httpContext.User.Identity as ClaimsIdentity;
        if (identity == null) return null;
        var claim = identity.Claims.ToList().Find(c => c.Type == "name");
        
        if(claim == null) return null;
        return claim.Value;
    }
    
}
