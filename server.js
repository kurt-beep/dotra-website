const express = require('express');
const path = require('path');

const app = express();

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
  console.log(`Server läuft auf Port ${port}`);
}); 