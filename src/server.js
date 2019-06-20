const express = require('express');
const app = express();
const port = 3000;
const parseController = require('./controllers/parseController');


app.get('/', (req, res) => res.send('Welcome to ResumeParser.js'));
app.post('/parse',parseController.parse);

app.listen(port, '0.0.0.0', () => console.log(`Test server running on port ${port}`));
