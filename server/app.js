const express = require('express');

const Router = require('./routes.js');

const app = express();

app.use(express.json());

app.use(Router);

app.listen(3333, () => {
  console.log('Connected to the island...')
});
