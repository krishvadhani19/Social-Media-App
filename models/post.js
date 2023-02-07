const { default: mongoose } = require("mongoose");

let postSchema = new mongoose.Schema(
  {
    img: [
      {
        type: String,
        required: [true, "A post must have atleat 1 image"],
      },
    ],

    caption: {
      type: String,
      required: [true, "A post must have caption"],
      maxLength: [300, "A post can have maximum of 300 characters"],
    },

    user: {
      type: mongoose.Schema.ObjectId,
      required: [true, "a post will be done by a user"],
      unique: false,
    },

    likesCount: {
      type: Number,
      required: [true, "A post must have number of likes"],
      default: 0,
    },

    tags: [
      {
        id: { type: mongoose.Schema.ObjectId, ref: "User" },
      },
    ],

    likedBy: [
      {
        id: { type: mongoose.Schema.ObjectId, ref: "User" },
      },
    ],

    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
  },
  // want something to show up in the output but not save in the database we use Virtual Property
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// referencing comments related to the post
postSchema.virtual("comments", {
  ref: "Comment",
  foreignField: "post",
  localField: "_id",
});

// Poulating comments
postSchema.pre(/^find/, function (next) {
  this.populate({
    path: "comments",
  });
  next();
});

module.exports = mongoose.model("Post", postSchema);
