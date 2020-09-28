const express = require('express');
const app = express()
const port = 3000;
var budget = require('./budget.json');

app.use('/', express.static('public'));

app.get('/hello', (req, res) => {
    res.send('Hello World!');
});
app.get('/budget', (req, res) => {
    res.json(budget);
});
app.listen(port, () => {
    console.log('Example app listening at http://localhost:${port}');
});