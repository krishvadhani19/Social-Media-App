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

// importing modules
const dotenv = require("dotenv");

// catching uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("Unhandled Rejection. Shutting down...");
  process.exit(1);
});

// setting up the environment
dotenv.config({ path: "./config.env" });

// working on port
const port = process.env.PORT;

// connecting to mongo
connectToMongo();

// listening at given port
const server = app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});

// Errors outside express unhandled rejections
process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("Unhandled Rejection. Shutting down...");
  server.close(() => {
    process.exit(1);
  });
});
