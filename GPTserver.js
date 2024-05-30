const express = require('express')
const bodyParser = require('body-parser')
const cors = require("cors")

const app = express()
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT" , "DELETE"],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
)
const PORT = 3000;

// Middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Route to handle POST requests to /submit-form
app.post('/submit-form', (req, res) => {
    const formData = req.body;
    console.log('Received form data:', formData);
    res.send('Form data received successfully!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
