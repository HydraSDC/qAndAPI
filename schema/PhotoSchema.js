const mongoose = require('mongoose');

const PhotoSchema = new.mongoose.Schema(
  {
    photo_id: Number,
    url: String
  },
)

const Photos = mongoose.model("Photos", PhotoSchema);

module.exports = Photos;