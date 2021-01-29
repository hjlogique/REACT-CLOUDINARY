const mongoose = require("mongoose");
const db = require("../models");

// This file empties the Books collection and inserts the books below

mongoose.connect(
  process.env.MONGODB_URI ||
  "mongodb://localhost/imageurl"
);

const imageSeed = [
  {
    image_url: "The Dead Zone",
  }
];

db.ImageUrl
  .remove({})
  .then(() => db.ImageUrl.collection.insertMany(imageSeed))
  .then(data => {
    console.log(data.result.n + " records inserted!");
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
