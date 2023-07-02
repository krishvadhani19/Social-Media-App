import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);

  if (isConnected) {
    console.log("Database already connected!");
    return;
  }

  try {
    mongoose.connect(process.env.MONGO_URI, {
      dbName: "share_prompt",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = true;
    console.log("Database is connected now!");
  } catch (error) {
    console.log(error);
  }
};