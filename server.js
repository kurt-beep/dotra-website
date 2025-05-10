const express = require('express');
const path = require('path');

const app = express();

// Healthcheck-Route
app.get('/health', (req, res) => {
  res.send('OK');
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
}); 