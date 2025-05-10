const express = require('express');
const path = require('path');
const { Resend } = require('resend');

const app = express();
const resend = new Resend(process.env.RESEND_API_KEY);

// Middleware für JSON-Parsing
app.use(express.json());

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

// Healthcheck-Route
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
}); 