const express = require('express');
const path = require('path');
const { request } = require('undici');

const app = express();
app.use(express.json());

// Healthcheck-Route
app.get('/health', (req, res) => {
  res.send('OK');
});

// E-Mail-Endpunkt
app.post('/api/send-email', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.error('❌ RESEND_API_KEY is not set in environment variables');
      throw new Error('Email service configuration is missing');
    }

    console.log('📧 Attempting to send email:', { name, email });

    const response = await request("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "Dotra <noreply@dotraapp.com>",
        to: "dotraapp@gmail.com",
        subject: `New Contact Form Submission from ${name}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `
      })
    });

    const responseBody = await response.body.text();
    console.log('📨 Resend API Response:', responseBody);

    const data = JSON.parse(responseBody);

    if (response.statusCode >= 400) {
      console.error("❌ Error sending email:", {
        statusCode: response.statusCode,
        data: data
      });
      throw new Error(data.message || "Failed to send email");
    }

    console.log('✅ Email sent successfully');
    res.json({ success: true, data });
  } catch (error) {
    console.error('❌ Error in /api/send-email:', {
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ 
      error: "Failed to send email",
      details: error.message 
    });
  }
});

// Statische Dateien
app.use(express.static(__dirname));

// Hauptroute
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log('Environment:', {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    RESEND_API_KEY: process.env.RESEND_API_KEY ? 'Set' : 'Not Set'
  });
}); 