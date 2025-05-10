const express = require('express');
const path = require('path');
const { Resend } = require('resend');

const app = express();
const resend = new Resend(process.env.RESEND_API_KEY);

// Middleware für JSON-Parsing
app.use(express.json());

// Healthcheck-Route - muss als erste Route definiert werden
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// API-Endpunkt für das Kontaktformular
app.post('/api/send-email', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const data = await resend.emails.send({
      from: 'Dotra Website <noreply@dotraapp.com>',
      to: ['dotraapp@gmail.com'],
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    });

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: error.message });
  }
});

// Statische Dateien
app.use(express.static(__dirname));

// Hauptroute
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Fehlerbehandlung
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const port = process.env.PORT || 8080;
const host = '0.0.0.0';

app.listen(port, host, () => {
  console.log(`Server running on http://${host}:${port}`);
}); 