using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.Extensions.Options;
using System.Net;
using System.Net.Mail;
namespace OAuthAPI.Services;

public class EmailService 
{
    public string EmailAdress { get; init; }
    private string EmailServer { get; init; }

    private string EmailPassword =>
        Environment.GetEnvironmentVariable("EMAIL_PASSWORD") 
        ?? throw new Exception("Email Password not set in Environment Variables!");

    private int SmtpPort { get; init; }

    public EmailService(string emailAdress, string emailServer, int smtpPort)
    {
        EmailAdress = emailAdress;
        EmailServer = emailServer;
        SmtpPort = smtpPort;
    }
    
    public async Task SendEmailAsync(string email, string subject, string message)
    {
        var smtpClient = new SmtpClient
        {
            Host = EmailServer, // Set your SMTP Server
            Port = SmtpPort, // Set your SMTP Port
            EnableSsl = true,
            Credentials = new NetworkCredential(EmailAdress, EmailPassword)
        };

        var mailMessage = new MailMessage
        {
            From = new MailAddress(EmailAdress),
            Subject = subject,
            Body = message,
            IsBodyHtml = true,
        };
        mailMessage.To.Add(email);
        mailMessage.IsBodyHtml = true;
        await smtpClient.SendMailAsync(mailMessage);
    }
}
