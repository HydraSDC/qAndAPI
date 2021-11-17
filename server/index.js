const express = require('express');

// const { API_URL, API_KEY } = require('./config.js');

const app = express();

app.use(express.json());

app.listen(3333, () => {
  console.log('Hail Hydra... 3333')
});