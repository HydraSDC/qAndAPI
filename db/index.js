const mongoose = require('mongoose');

mongoose.connect('mongodb://sdc-mongo:27017/sdc',{ useNewUrlParser:true });

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error: "));

db.once("open", () => {
  console.log("Connected to the db...");
});

module.exports = db;