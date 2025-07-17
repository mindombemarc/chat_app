import { MailerSend, EmailParams, Recipient } from 'mailersend';

// ✅ Initialise MailerSend
const mailersend = new MailerSend({
  apiKey: 'mlsn.76958853ec7980f2ae5645383458b06f78e2690004f7206f12392bf3d10d8df5',
});

// ✅ Définis tes destinataires
const recipients = [
  new Recipient('mindombemarc@gmail.com', 'Marc Admin'),
];


// ✅ Crée les paramètres d’email CORRECTEMENT (pas de .setX() chaînés !)
const emailParams = new EmailParams({
  from: {
    email: 'test-xkjn41m73xq4z781.mlsender.net',  // Utilise ton domaine vérifié MailerSend
    name: 'marc mindombe',
  },
  to: recipients,
  subject: 'Subject',
  html: 'Greetings from the team, you got this message through MailerSend.',
  text: 'Greetings from the team, you got this message through MailerSend.'
});

// ✅ Envoi de l’email
mailersend.email.send(emailParams)
  .then((response) => {
    console.log('✅ Email envoyé !', response.body);
  })
  .catch((error) => {
    console.error('❌ Erreur lors de l’envoi :', error);
  });
