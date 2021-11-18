const express = require('express');

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const bodyParser = require('body-parser');

const Router = require('./routes.js');

const Questions = require('../models/QuestionSchema.js');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/sdc',{
  useNewUrlParser:true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error: "));

db.once("open", function () {
  console.log("Connected to the db...");
});

app.use(Router);

app.listen(3333, () => {
  console.log('Connected to the island...')
});

exports.db = db