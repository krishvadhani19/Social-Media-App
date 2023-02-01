// setting up absolute path
global.base_dir = "./";
global.abs_path = function (path) {
  return base_dir + path;
};
global.include = function (file) {
  return require(abs_path("/" + file));
};

// importing files
const app = require("./app");
const connectToMongo = require("./db");

// working on port
const port = 3000;

// connecting to mongo
connectToMongo();

//
const server = app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
