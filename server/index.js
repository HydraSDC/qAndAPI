const express = require('express');

const mongoose = require('mongoose');

const routes = require('./routes.js');

// const { API_URL, API_KEY } = require('./config.js');

const app = express();

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/qAndAPI');

app.listen(3333, () => {
  console.log('Hail Hydra... 3333')
});