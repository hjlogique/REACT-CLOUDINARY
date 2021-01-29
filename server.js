require('dotenv').config();
const express = require('express');
const cloudinary = require('cloudinary');
const formData = require('express-form-data');
const cors = require('cors');
const mongoose = require("mongoose");
const routes = require("./routes");
const ImageUrl = require("./models");
const app = express();
const PORT = process.env.PORT || 3001;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

app.use(formData.parse())

app.get('/wake-up', (req, res) => res.send('👌'))

app.post('/image-upload', (req, res) => {

  const values = Object.values(req.files)
  const promises = values.map(image => cloudinary.uploader.upload(image.path))

  Promise
    .all(promises)
    .then(results => {
      return ImageUrl.ImageUrl.create({
        image_url: results[0].url
      });
    }).then(dbResp => {
      res.json(dbResp);
    })
    .catch((err) => res.status(400).json(err));
});

// Define middleware here
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}
// Add routes, both API and view
app.use(routes);

// Connect to the Mongo DB
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/reactreadinglist"
);


// app.use(routes);
app.listen(PORT, () => console.log('👍'))