const { default: mongoose } = require("mongoose");
const validator = require("validator");

let activitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: [true, "A user must have name"],
      maxLength: [40, "Username can be at the most 40 charcters"],
      minLength: [3, "Username must be atleast 3 characters"],
    },
    email: {
      type: String,
      validate: [validator.isEmail, "Please enter a valid email id"],
      required: [true, "A user must have email"],
      lowercase: true,
      unique: true,
    },
  },
  // want something to show up in the output but not save in the database we use Virtual Property
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// virtul property "followers" from 'User'
activitySchema.virtual("followers", {
  ref: "User",
  foreignField: "following._id",
  localField: "user",
});

// Poulating followers
activitySchema.pre(/^find/, function (next) {
  this.populate({
    path: "followers",
  });
  next();
});

// view liked posts
activitySchema.virtual("getLikedPosts", {
  ref: "Post",
  foreignField: "likedBy._id",
  localField: "user",
});

// Poulating followers
activitySchema.pre(/^find/, function (next) {
  this.populate({
    path: "getLikedPosts",
  });
  next();
});

const Activity = mongoose.model("Activity", activitySchema);
module.exports = Activity;
