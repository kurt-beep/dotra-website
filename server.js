const express = require('express');
const path = require('path');
const { request } = require('undici');

const app = express();
app.use(express.json());

// Healthcheck-Route
app.get('/health', (req, res) => {
  res.send('OK');
});

// Formspree-Endpunkt
app.post('/api/send-email', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const response = await request("https://formspree.io/f/mbloqpvb", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        email,
        message
      })
    });

    if (response.statusCode >= 400) {
      throw new Error("Failed to send form submission");
    }

    res.json({ success: true });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Statische Dateien
app.use(express.static(path.join(__dirname, 'public')));

// Hauptroute
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 