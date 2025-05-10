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
      subject: `Neue Kontaktanfrage von ${name}`,
      html: `
        <h2>Neue Kontaktanfrage</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>E-Mail:</strong> ${email}</p>
        <p><strong>Nachricht:</strong></p>
        <p>${message}</p>
      `
    });

    res.json({ success: true, data });
  } catch (error) {
    console.error('Fehler beim Senden der E-Mail:', error);
    res.status(500).json({ error: error.message });
  }
});

// Statische Dateien aus dem aktuellen Verzeichnis servieren
app.use(express.static(__dirname));

// Alle Routen zur index.html weiterleiten
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const port = process.env.PORT || 3000;
const host = '0.0.0.0';

app.listen(port, host, () => {
  console.log(`Server läuft auf http://${host}:${port}`);
}); 