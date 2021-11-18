const express = require("express");
const connection = require("./app.js");

const app = express();

// QUESTIONS

app.get("/qa/questions", async (req, res) => {
  let productID = Number(req.query.productId);
  connection.db
  .collection('questions')
  .find({
    product_id: productID
  }).limit(10)
  .toArray((err, data) => {
    if (err) {res.status(400).send("Error fetching Q's")}
    else { res.json(data) }
  })
})

app.post("/qa/questions", async (req, res) => {

  // let newQ = {
  //   {$inc: {id:1}}
  //   product_id: Number(req.body.product_id),
  //   body: req.body.body,
  //   date_written: Date(),
  //   asker_name: req.body.name,
  //   asker_email: req.body.email,
  //   reported: 0,
  //   helpful: 0,
  // }
  // console.log(newQ);
  const sdc = connection.db;
  sdc
  .collection("questions")
  .insertOne({
    id: Math.floor(Math.random() * (Number(req.body.product_id))),
    product_id: Number(req.body.product_id),
    body: req.body.body,
    date_written: Date(),
    asker_name: req.body.name,
    asker_email: req.body.email,
    reported: 0,
    helpful: 0,
  }, function (err, result) {
    if (err) {
      res.status(400).send("Error adding question!");
    } else {
      console.log(result);
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