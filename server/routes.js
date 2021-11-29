const express = require("express");
const connection = require("./app.js");
const mongoose = require('mongoose');
const { produceWithPatches } = require("immer");
const db = require('../db/index.js');

const app = express();

/*
 * * * * * * * * * * QUESTIONS * * * * * * * * * *
*/

app.get("/qa/questions", async (req, res) => {

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
  let count = 5;

  let question = Number(req.query.question_id);

  const answerArray = await database.collection('answers').find({question_id: question}).limit(count).toArray();
  const mapped = answerArray.map((a) => {
    let result = {}
    result.answer_id = a.id;
    result.body = a.body;
    result.date = a.date_written;
    result.answerer_name = a.answerer_name;
    result.helpfulness = a.helpful;
    result.photos = [];
    return result;
  })

  res.status(200).send({
    question: question,
    page: 0,
    count: count,
    results: mapped
  })

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
  let limit = 5;
  if (req.query.count) {limit = Number(req.query.count)}
  const database = db;
  database
  .collection('products')
  .find({}).limit(limit)
  .toArray((err, data) => {
    if (err) {res.status(400).send("Error fetching Q's")}
    else {
      const newData = data.map(product => {
        return {
          id: product.id,
          name: product.name,
          slogan: product.slogan,
          description: product.description,
          category: product.category,
          default_price: product.default_price
        }
      })
      res.status(200).send(newData)
    }
  })
})

module.exports = app;