const mongoose = require('mongoose');

const AnswerSchema = require('./AnswerSchema.js');

const QuestionSchema = new.mongoose.Schema(
  {
    question_id: Number,
    question_body: String,
    question_date: Date,
    asker_name: String,
    question_helpfulness: Number,
    reported: Boolean,
    answers: [ AnswerSchema ]
  },
)

const Questions = mongoose.model("Questions", QuestionSchema);

module.exports = Questions;