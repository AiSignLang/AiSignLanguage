using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using OAuthAPI.Model;
using OAuthAPI.Services;


namespace OAuthAPI.Controllers;
[Route("auth/[controller]")]
[ApiController]
public class AccountController(DataContext context, TokenService tokenService, EmailService emailService) : ControllerBase
{
   
    [HttpPost("Register")]
    public async Task<IActionResult> Register([FromBody] RegisterModel model)
    {
        using var transaction = context.Database.BeginTransaction();
        try
        {
            if (context.Accounts.Any(a => a.Email == model.Email))
            {
                return BadRequest("Email already exists");
            }
            var invalids = new List<string>();
            if(model.Email == null) invalids.Add("Invalid email");
            if(model.Password == "") invalids.Add("Invalid password");

            if(invalids.Count > 0)
            {
                return BadRequest(invalids.ToArray());
            }

            var account = new Account( model.Email!);
            account.SetPassword(model.Password);
            context.Accounts.Add(account);

            // Generate token for the new user

            await context.SaveChangesAsync();
            await transaction.CommitAsync();

            return Ok(new{code=tokenService.GenerateAccessCode(account)});
        }
        catch (Exception)
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    [HttpPost("Login")]
    public async Task<IActionResult> Login([FromBody] LoginModel model)
    {
        using var transaction = context.Database.BeginTransaction();
        try
        {
            Account account = context.Accounts.FirstOrDefault(a => a.Email == model.Email);

            if (account == null || !account.VerifyPassword(model.Password))
            {
                return Unauthorized("Invalid username or password");
            }

            //tokenService.GenerateToken(account);
            await context.SaveChangesAsync();
            await transaction.CommitAsync();
            
            return Ok(new{code=tokenService.GenerateToken(account)});
        }
        catch (Exception)
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    [HttpPost("[action]")]
    public async Task<IActionResult> Token([FromBody] GetTokenModel code )
    {
        if(!tokenService.AccessCodes.TryGetValue(code.Email, out var accessCode))
        {
            return BadRequest("Invalid access code");
        }
        if(!tokenService.ValidateAccessCode(code.AccessCode, accessCode))
        {
            return BadRequest("Invalid access code");
        }
        var account = context.Accounts.FirstOrDefault(a => a.Email == code.Email);
        if(account == null) return ValidationProblem("User not found");
        return Ok(tokenService.GenerateToken(account));
    }
    
    [HttpPost("[action]")]
    public async Task<IActionResult> RefreshToken([FromQuery] string refreshToken)
    {
        using var transaction = context.Database.BeginTransaction();
        try
        {
            var account = context.Accounts.FirstOrDefault(a => a.RefreshToken == refreshToken);

            if (account == null || account.RefreshTokenExpiryTime < DateTime.UtcNow)
            {
                return BadRequest("Invalid refresh token");
            }

            var tokens = tokenService.GenerateToken(account);
            await context.SaveChangesAsync();

            await transaction.CommitAsync();

            return Ok(tokens);
        }
        catch (Exception)
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    [HttpPost("[action]")]
    public async Task<IActionResult> RevokeToken([FromQuery] string refreshToken)
    {
        using var transaction = context.Database.BeginTransaction();
        try
        {
            var account = context.Accounts.FirstOrDefault(a => a.RefreshToken == refreshToken);

            if (account == null)
            {
                return BadRequest("Invalid refresh token");
            }

            account.RefreshToken = null;
            account.RefreshTokenExpiryTime = DateTime.UtcNow;
            await context.SaveChangesAsync();

            await transaction.CommitAsync();

            return Ok(new{message="Token revoked"});
        }
        catch (Exception)
        {
            await transaction.RollbackAsync();
            throw;
        }
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
                Email = account.Email,
                Id = account.Id.ToString()
            });
    }
    
    [HttpPost("verify")]
    public IActionResult Verify([FromBody] VerifyTokenModel token)
    {
        var email = tokenService.VerifyToken(token.Token);
        if (email == null) 
        {
            return Unauthorized();
        }
        var account = context.Accounts.FirstOrDefault(a => a.Email == email);
        if(account == null) return ValidationProblem("User not found");
        return Ok(new AccountInfoModel
        {
            Email = email,
            Id = account.Id.ToString()
        });
    }
    
    [HttpGet("validate-email")]
    public IActionResult ValidateEmail([FromQuery] string email)
    {
        if (context.Accounts.Any(a => a.Email == email))
        {
            return BadRequest("Email already exists");
        }
        return Ok(new{message="Email is available"});
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
