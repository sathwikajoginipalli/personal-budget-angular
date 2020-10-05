//Budget API
const cors = require('cors');
const express = require('express');
const app = express()
const port = 3000;
var budget = require('./budget.json');

app.use(cors());

app.get('/budget', (req, res) => {
    res.json(budget);
});
app.listen(port, () => {
    console.log('API listening at http://localhost:${port}');
});