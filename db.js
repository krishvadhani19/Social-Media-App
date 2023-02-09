const { default: mongoose } = require("mongoose");
const mongoURL = `mongodb+srv://krishvadhani19:Testing%40123@cluster0.ldc02uh.mongodb.net/socialMediaApp?retryWrites=true&w=majority`;

const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
const connectToMongo = () => {
  mongoose
    .connect(mongoURL, connectionParams)
    .then(() => {
      console.log("Connected to database ");
    })
    .catch((err) => {
      console.error(`Error connecting to the database. \n${err}`);
    });
};

module.exports = connectToMongo;
