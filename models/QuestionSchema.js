const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema(
  {
    _id: ObjectID(),
    id: Number,
    body: String,
    date_written: Date,
    asker_name: String,
    asker_email: String,
    reported: Boolean,
    helpful: Number
  },
)

const Questions = mongoose.model("Questions", QuestionSchema);


module.exports = Questions;