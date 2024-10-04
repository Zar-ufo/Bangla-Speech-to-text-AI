const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());

// Path to the qa.json file
const qaFilePath = path.join(__dirname, 'qa.json');

// API to fetch questions
app.get('/api/qa', (req, res) => {
  fs.readFile(qaFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to load questions.' });
    }
    res.json(JSON.parse(data));
  });
});

// API to add new questions
app.post('/api/qa', (req, res) => {
  const newQA = req.body;

  if (!newQA.question || !newQA.answer) {
    return res.status(400).json({ error: 'Question and answer are required.' });
  }

  // Read the existing data
  fs.readFile(qaFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to load questions.' });
    }

    const qaData = JSON.parse(data);
    // Add the new question-answer pair
    qaData.push(newQA);

    // Write the updated data back to the file
    fs.writeFile(qaFilePath, JSON.stringify(qaData, null, 2), 'utf8', (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to save the question.' });
      }
      res.json({ success: 'Question added successfully!' });
    });
  });
});

// Serve static files (like HTML, CSS, JS)
app.use(express.static('public'));

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
