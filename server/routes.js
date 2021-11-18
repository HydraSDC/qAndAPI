const express = require("express");
const mongoose = require('mongoose');

const Question = require('../models/QuestionSchema.js');

const connection = require("./app.js");

const app = express();

app.get("/questions", async (req, res) => {
  connection.db
  .collection('questions')
  .find({}).limit(10)
  .toArray((err, data) => {
    if (err) {res.status(400).send("Error fetching Q's")}
    else {
      res.json(data)
    }
  })
})

module.exports = app;