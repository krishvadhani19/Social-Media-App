const mongoose = require("mongoose");
const mongoURL = process.env.MONGO_URL;

const connectToMongo = () => {
  mongoose
    .connect(mongoURL, () => {
      console.log("Connected to Mongo Successfully!");
    })
    .catch((err) => {
      console.log("Error!");
    });
};

module.exports = connectToMongo;
