export const WelcomeTemplateEmail = (activation_link, userName) => {
  return `
<!DOCTYPE html>
<html lang="fr" style="margin:0;padding:0;">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Bienvenue</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial, sans-serif;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#f4f4f4">
    <tr>
      <td align="center" style="padding:40px 0;">
        <table width="600" cellpadding="0" cellspacing="0" bgcolor="#ffffff" style="border-radius:8px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.05);">
          <tr>
            <td align="center" bgcolor="#4F46E5" style="padding:20px;color:#ffffff;font-size:28px;font-weight:bold;">
              Bienvenue chez YabiSo
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:30px;">
              <img src="https://cdn-icons-png.flaticon.com/512/2462/2462719.png" alt="Bienvenue" width="100%" style="display:block;margin:0 auto;" />
            </td>
          </tr>
          <tr>
            <td style="padding:0 30px 20px 30px;color:#333333;font-size:16px;line-height:1.6;">
              <p>Bonjour <strong>${userName}</strong>,</p>
              <p>Nous sommes ravis de vous compter parmi nous </p>
              <p>Avec <strong>YabiSo</strong>, vous pouvez désormais :</p>
              <ul>
                <li>Échanger rapidement avec vos contacts</li>
                <li> Partager facilement des fichiers</li>
                <li>🔒 Profiter d'une sécurité optimale</li>
              </ul>
              <p>Pour commencer, cliquez simplement sur le bouton ci-dessous 👇</p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:20px;">
              <a href="${activation_link}" 
                 style="background-color:#4F46E5;color:#ffffff;text-decoration:none;
                 padding:12px 25px;border-radius:6px;font-weight:bold;display:inline-block;">
               Cliquer ici pour Activer votre compte
              </a>
            </td>
          </tr>
          <tr>
            <td bgcolor="#f4f4f4" style="padding:20px;color:#777777;font-size:12px;text-align:center;">
              © 2025 YabiSo - Tous droits réservés<br />
              Vous recevez cet email car vous vous êtes inscrit(e) sur notre plateforme.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

export const VericationCompteTemplete = (code)=>{
   `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vérification de votre adresse email</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f5f7fa;
      font-family: Arial, sans-serif;
    }
    .container {
      max-width: 500px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 10px;
      box-shadow: 0px 4px 12px rgba(0,0,0,0.05);
      padding: 30px;
    }
    h1 {
      font-size: 20px;
      text-align: center;
      color: #333333;
    }
    p {
      font-size: 15px;
      color: #555555;
      text-align: center;
      line-height: 1.5;
    }
    .code-box {
      background-color: #f0f4ff;
      border: 1px solid #cbd5ff;
      color: #1a56db;
      font-weight: bold;
      font-size: 26px;
      letter-spacing: 6px;
      padding: 15px;
      text-align: center;
      border-radius: 8px;
      margin: 25px auto;
      width: fit-content;
    }
    .footer {
      font-size: 12px;
      color: #888888;
      text-align: center;
      margin-top: 20px;
      line-height: 1.4;
    }
    @media (max-width: 600px) {
      .container {
        margin: 20px;
        padding: 20px;
      }
      .code-box {
        font-size: 22px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Vérification de votre email</h1>
    <p>Bonjour,</p>
    <p>Pour sécuriser votre compte, veuillez entrer le code ci-dessous dans l'application :</p>

    <div class="code-box">
      ${code}
    </div>

    <p>Ce code est valable pendant <strong>10 minutes</strong>.  
       Si vous n'avez pas demandé cette vérification, ignorez simplement cet email.</p>

    <div class="footer">
      © 2025 Votre Application. Tous droits réservés.<br>
      Cet email a été envoyé automatiquement, merci de ne pas y répondre.
    </div>
  </div>
</body>
</html>
`
}