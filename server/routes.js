const express = require("express");
const connection = require("./app.js");
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb://localhost:27017/sdc',{
  useNewUrlParser:true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error: "));

db.once("open", () => {
  console.log("Connected to the db...");
});


/*
 * * * * * * * * * * QUESTIONS * * * * * * * * * *
*/

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
  // Connect to MongoDB
  const database = db;
  const questions = database.collection("questions");
  const ids = database.collection("ids");
  const currentIds = await ids.findOne();
  // Set vars used for queries
  const count = currentIds.questionID;
  let filter = { "questionID": count};
  let newDoc = { $set: { questionID: (count + 1)} };
  // Object to insert
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
  // Increment ids table
  await ids.updateOne(filter, newDoc);
  console.log(`ID file updated...`)
  // Insert request into MongoDB
  questions
  .insertOne(newQ, (err, result) => {
    if (err) {
      res.status(400).send("Error adding question!");
    } else {
      console.log(`Added a new question with id ${result.insertedId}`);
      res.status(204).send();
    }
  });
})

app.put("/qa/questions/helpful", async (req, res) => {
  // store ID from request params
  let qID = Number(req.query.questionID);
  // connect to database
  const database = db;
  const questions = database.collection("questions");
  // Define query vars
  let markHelpful = { $inc: { helpful: 1 } }
  let query = {id: qID}
  // Update helpful field of question matching ID from request params
  await questions.updateOne(query, markHelpful);
  console.log(`File updated...`)
  // Send 204 according to Learn :
  // https://learn-2.galvanize.com/cohorts/2960/blocks/94/content_files/Front%20End%20Capstone/project-atelier-catwalk/qa.md
  res.status(204).send();
})

app.put("/qa/questions/report", async (req, res) => {
  let qID = Number(req.query.questionID);
  const database = db;
  const questions = database.collection("questions");
  let reportQ = { $set: { reported: 1 } }
  let query = {id: qID}
  await questions.updateOne(query, reportQ);
  console.log(`Question reported...`)
  res.status(204).send();
})

/*
 * * * * * * * * * * ANSWERS * * * * * * * * * *
*/

app.get("/qa/answers", async (req, res) => {
  const database = db;
  database
  .collection('answers')
  .find({}).limit(10)
  .toArray((err, data) => {
    if (err) {res.status(400).send("Error fetching Q's")}
    else {
      res.json(data)
    }
  })
})

app.post("/qa/answers", async (req, res) => {
  const qID = Number(req.query.questionID);
  const database = db;
  const answers = database.collection('answers');
  const ids = await database.collection('ids').findOne();
  const count = ids.answerID;

  const newAnswer = {
    id: count + 1,
    question_id: qID,
    body: req.body.body,
    date_written: new Date(),
    answerer_name: req.body.name,
    answerer_email: req.body.email,
    reported: 0,
    helpful: 0
  }

  await database.collection('ids').updateOne({answerID: count}, { $set: {answerID: count +1}});

  answers
  .insertOne(newAnswer, (err, result) => {
    if (err) {
      res.status(400).send("Error adding answer!");
    } else {
      console.log(`Added a new answer with id ${result.insertedId}`);
      res.status(204).send();
    }
  });
})

app.put("/qa/answers/helpful", async (req, res) => {
  let aID = Number(req.query.answerID);
  // connect to database
  const database = db;
  const answers = database.collection("answers");
  // Update helpful field of answer matching ID from request params
  await answers.updateOne({id: aID}, { $inc: { helpful: 1 } });
  console.log(`File updated...`)
  res.status(204).send();
})

app.put("/qa/answers/report", async (req, res) => {
  let aID = Number(req.query.answerID);
  // connect to database
  const database = db;
  const answers = database.collection("answers");
  // Update helpful field of answer matching ID from request params
  await answers.updateOne({id: aID}, { $set: { reported: 1 } });
  console.log(`File updated...`)
  res.status(204).send();
})


/*
 * * * * * * * * * * ANSWER PHOTOS * * * * * * * * * *
*/


app.get("/qa/answerPhotos", async (req, res) => {
  const database = db;
  database
  .collection('answerPhotos')
  .find({}).limit(10)
  .toArray((err, data) => {
    if (err) {res.status(400).send("Error fetching Q's")}
    else {
      res.json(data)
    }
  })
})


/*
 * * * * * * * * * * PRODUCTS * * * * * * * * * *
*/

app.get("/products", async (req, res) => {
  const database = db;
  database
  .collection('products')
  .find({}).limit(10)
  .toArray((err, data) => {
    if (err) {res.status(400).send("Error fetching Q's")}
    else {
      res.json(data.map((item) => {item}))
    }
  })
})

module.exports = app;