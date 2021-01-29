const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const uploadSchema = new Schema({
  image_url: String
});

const ImageUrl = mongoose.model("ImageUrl", uploadSchema);

module.exports = ImageUrl;
