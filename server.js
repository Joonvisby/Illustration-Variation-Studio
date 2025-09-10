import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 8080;

const distPath = path.join(__dirname, 'dist');

// Serve static files from the 'dist' directory
app.use(express.static(distPath));

// Handle all other routes by serving the index.html file for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) {
      res.status(500).send(err);
    }
  });
});

app.listen(port, () => {
  console.log(`Illustration Variation Studio listening on port ${port}`);
});
