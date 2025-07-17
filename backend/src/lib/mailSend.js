import { MailerSend, Recipient, EmailParams } from 'mailersend';

export async function mailerSendWithEmail(email, verificationToken) {
  const mailersend = new MailerSend({
    apiKey: 'mlsn.76958853ec7980f2ae5645383458b06f78e2690004f7206f12392bf3d10d8df5',
  });

  const recipients = [new Recipient(email, 'Marc Admin')];

  const emailParams = new EmailParams({
    from: {
      email: 'test-xkjn41m73xq4z781.mlsender.net', // Vérifie que ce domaine/email est validé
      name: 'Marc Mindombe',
    },
    to: recipients,
    subject: 'Mon premier email',
    html: `code de verification: <b>${verificationToken}</b>`,
    text: `code de verification: ${verificationToken}`,
  });

  try {
    const response = await mailersend.email.send(emailParams);
    console.log('✅ Email envoyé !', response);
  } catch (error) {
    console.error('❌ Erreur lors de l’envoi :', error);
  }
}
