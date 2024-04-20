const express = require('express');
const path = require('path');

const app = express();
app.use('/static', express.static(path.join(__dirname, '/public/static')));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/public/views/landing/index.html'));
});

app.listen(3001);