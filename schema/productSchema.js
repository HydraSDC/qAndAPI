const mongoose = require('mongoose');

const PhotoSchema = new mongoose.Schema(
  {
    photo_id: Number,
    url: String
  },
)

const AnswerSchema = new mongoose.Schema(
  {
    answer_id: Number,
    body: String,
    date: Date,
    answerer_name: String,
    helpfulness: Number,
    reported: Boolean,
    photos: [PhotoSchema]
  },
)

const QuestionSchema = new mongoose.Schema(
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

const ProductSchema = new mongoose.Schema(
  {
    product_id: Number,
    results: [ QuestionSchema ]
  },
)

const Products = mongoose.model("Products", ProductSchema);

const Questions = mongoose.model("Questions", QuestionSchema);

const Answers = mongoose.model("Answers", AnswerSchema);

const Photos = mongoose.model("Photos", PhotoSchema);


module.exports = Products;