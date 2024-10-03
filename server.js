const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Route to handle adding a question
app.post('/api/qa', (req, res) => {
    const { question, answer } = req.body;

    // Here, you would typically add the question and answer to your database
    // For this example, we will just send a success message
    // You can also add error handling as needed
    res.json({ success: 'Question added successfully!', question, answer });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
