const mongoose = require('mongoose');

const PhotoSchema = require('./PhotoSchema.js');

const AnswerSchema = new.mongoose.Schema(
  {
    answer_id: Number,
    body: String,
    date: Date,
    answerer_name: String,
    helpfulness: Number,
    reported: Boolean,
    photos: [ PhotoSchema ]
  },
)

const Answers = mongoose.model("Answers", AnswerSchema);

module.exports = Answers;