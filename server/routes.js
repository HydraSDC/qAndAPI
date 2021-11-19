const express = require("express");
const connection = require("./app.js");
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb://localhost:27017/sdc',{
  useNewUrlParser:true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error: "));

db.once("open", function () {
  console.log("Connected to the db...");
});


// QUESTIONS

app.get("/qa/questions", async (req, res) => {
  let productID = Number(req.query.productId);
  const database = db;
  const questions = database.collection("questions");

  questions
  .find({}).limit(5)
  .toArray((err, data) => {
    if (err) {res.status(400).send("Error fetching Q's")}
    else { res.json(data) }
  })
})

app.post("/qa/questions", async (req, res) => {

 const database = db;
 const questions = database.collection("questions");
 const ids = database.collection("ids");

  // const test = await questions.countDocuments()
  const currentIds = await ids.findOne();
  const count = currentIds.questionID;
  let filter = { "questioID": count};
  let newDoc = { $set: { questionID: (count + 1)} };

  let newQ = {
    id: count + 1,
    product_id: Number(req.body.product_id),
    body: req.body.body,
    date_written: Date(),
    asker_name: req.body.name,
    asker_email: req.body.email,
    reported: 0,
    helpful: 0,
  }

  const update = await ids.updateOne({},newDoc);

  console.log(`${update.modifiedCount} file updated...`)

  questions
  .insertOne(newQ, function (err, result) {
    if (err) {
      res.status(400).send("Error adding question!");
    } else {
      console.log(`Added a new question with id ${result.insertedId}`);
      res.status(204).send();
    }
  });


})

// ANSWERS

app.get("/qa/answers", async (req, res) => {
  connection.db
  .collection('answers')
  .find({}).limit(10)
  .toArray((err, data) => {
    if (err) {res.status(400).send("Error fetching Q's")}
    else {
      res.json(data)
    }
  })
})

app.get("/qa/answerPhotos", async (req, res) => {
  connection.db
  .collection('answerPhotos')
  .find({}).limit(10)
  .toArray((err, data) => {
    if (err) {res.status(400).send("Error fetching Q's")}
    else {
      res.json(data)
    }
  })
})


// PRODUCTS

app.get("/products", async (req, res) => {
  connection.db
  .collection('products')
  .find({}).limit(10)
  .toArray((err, data) => {
    if (err) {res.status(400).send("Error fetching Q's")}
    else {
      res.json(data)
    }
  })
})

module.exports = app;