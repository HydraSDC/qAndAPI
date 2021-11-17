const mongoose = require('mongoose');

const QuestionSchema = require('./QuestionSchema.js')

const ProductSchema = new.mongooose.Schema(
  {
    product_id: Number,
    results: [ QuestionSchema ]
  },
)

const Products = mongoose.model("Products", ProductSchema);

module.exports = Products;