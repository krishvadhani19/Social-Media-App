const { default: mongoose } = require("mongoose");
const mongoURL = "mongodb://localhost:27017/social-media-app";

const connectToMongo = () => {
  mongoose
    .connect(mongoURL, () => {
      console.log("Connected to Mongo Successfully!");
    })
    .catch((err) => {
      console.log(err, "Error!");
    });
};

module.exports = connectToMongo;
