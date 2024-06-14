using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using DotNetEnv;
using OAuthAPI;
using OAuthAPI.Services;

var builder = WebApplication.CreateBuilder(args);
Env.Load();
// Add services to the container.
var apiKey = Environment.GetEnvironmentVariable("API_SECRET");
var  smtpServer = Environment.GetEnvironmentVariable("SMTP_SERVER");
var smtpPortStr = Environment.GetEnvironmentVariable("SMTP_PORT");
var emailAdress = Environment.GetEnvironmentVariable("EMAIL_ADDRESS");
var issuer = builder.Configuration["Jwt:Issuer"];
var audience = builder.Configuration["Jwt:Audience"];
if (string.IsNullOrWhiteSpace(apiKey)
    || string.IsNullOrWhiteSpace(issuer)
    || string.IsNullOrWhiteSpace(audience)
    || string.IsNullOrWhiteSpace(smtpServer)
    || string.IsNullOrWhiteSpace(emailAdress)
    || string.IsNullOrWhiteSpace(smtpPortStr)
    || !int.TryParse(smtpPortStr, out var smtpPort))
{
    throw new Exception("Environment variables not set");
}

builder.Services.AddSingleton(new KeyService(apiKey, issuer, audience));
builder.Services.AddSingleton<JwtSecurityTokenHandler>();
builder.Services.AddSingleton(new EmailService(emailAdress, smtpServer, smtpPort));
builder.Services.AddSingleton<TokenService>(d=> new TokenService(d.GetRequiredService<JwtSecurityTokenHandler>(), d.GetRequiredService<KeyService>()));
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
});;
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<DataContext>();
builder.Services.Configure<JsonOptions>(o => o.SerializerOptions.Converters
    .Add(new JsonStringEnumConverter()));
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey
            (Encoding.UTF8.GetBytes(apiKey)),
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true
    };
});
builder.Services.AddAuthorization();

var app = builder.Build();
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<DataContext>();
    await context.Database.MigrateAsync();
}
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
   
}
else
{
    app.UseHttpsRedirection();
}


app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
