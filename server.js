const express = require('express');
const path = require('path');
const app = express();

// Statische Dateien aus dem aktuellen Verzeichnis servieren
app.use(express.static(__dirname));

// Alle Routen zur index.html weiterleiten
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server läuft auf Port ${port}`);
}); 