using Microsoft.AspNetCore.Html;

namespace OAuthAPI.View;

public static class Mail
{
    public static HtmlString GenerateConfirm(string url)
    {
        var html = $$"""
                             <html>
                                 <head>
                                     <style>
                                         body {
                                             font-family: Arial, sans-serif;
                                             margin: 0;
                                             padding: 0;
                                             background-color: #f0f0f0;
                                         }
                                         .email-container {
                                             width: 100%;
                                             max-width: 600px;
                                             margin: 0 auto;
                                             padding: 20px;
                                             background-color: #ffffff;
                                             box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1);
                                         }
                                         .button {
                                             display: inline-block;
                                             padding: 10px 20px;
                                             margin: 20px 0;
                                             color: #ffffff;
                                             background-color: #007BFF;
                                             border: none;
                                             text-decoration: none;
                                         }
                                     </style>
                                 </head>
                                 <body>
                                     <div class='email-container'>
                                         <h1>Willkommen bei AiSL!</h1>
                                         <p>Bitte klicken Sie auf den folgenden Link, um Ihre E-Mail-Adresse zu bestätigen und die Registrierung abzuschließen:</p>
                                         <a href='{{url}}' class='button'>Bestätigen Sie Ihre E-Mail-Adresse</a>
                                         <p>Wenn Sie diese E-Mail nicht angefordert haben, können Sie sie ignorieren.</p>
                                         <p>Viele Grüße,</p>
                                         <p>Ihr AiSL-Team</p>
                                     </div>
                                 </body>
                             </html>
                     """;

        return new HtmlString(html);
    }
}