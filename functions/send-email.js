const { Resend } = require('resend');

// Initialisiere Resend mit dem API-Key aus der Umgebungsvariable
const resend = new Resend(process.env.RESEND_API_KEY);

exports.handler = async function(event, context) {
  // Nur POST-Anfragen erlauben
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { name, email, message } = JSON.parse(event.body);

    // E-Mail senden
    const data = await resend.emails.send({
      from: 'Dotra Website <noreply@dotraapp.com>',
      to: ['dotraapp@gmail.com'],
      subject: `Neue Kontaktanfrage von ${name}`,
      html: `
        <h2>Neue Kontaktanfrage</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>E-Mail:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, data })
    };
  } catch (error) {
    console.error('Error sending message:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}; 