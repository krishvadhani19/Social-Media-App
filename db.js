const mongoose = require("mongoose");
const mongoURI = "mongodb://localhost:27017/social-media-app";

const connectToMongo = () => {
  mongoose
    .connect(mongoURI, () => {
      console.log("Connected to Mongo Successfully!");
    })
    .catch((err) => {
      console.log("Error!");
    });
};

module.exports = connectToMongo;
