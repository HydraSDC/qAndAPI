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
  //get needed variables from params
  let product = {};
  let limit = 5;
  if (req.query.product_id){ product = { product_id: Number(req.query.product_id) }}
  if (req.query.count){limit = Number(req.query.count)}
  //connect to database
  const database = db;
  const questions = database.collection("questions");

  const getAnswers = async (questionID) => {
    const results = await database.collection('answers').find({question_id: Number(questionID)});
    return results;
  }
  questions
  .find(product).limit(limit)
  .toArray((err, data) => {
    if (err) {res.status(400).send("Error fetching Q's")}
    else {

      const questionAPI = data.map(question => {

        let isReported = false;
        let answersArray = JSON.stringify(getAnswers(question.id));
        if (question.reported === '1'){ isReported = true }



        return {
          question_id: question.id,
          question_body: question.body,
          question_date: question.date_written,
          asker_name: question.asker_name,
          question_helpfulness: question.helpful,
          reported: isReported,
          answers: answersArray
        }
      })
      res.status(333).send(questionAPI);
     }
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