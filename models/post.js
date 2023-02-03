const { default: mongoose } = require("mongoose");

let postSchema = new mongoose.Schema({
  img: {
    type: [String],
    required: [true, "A post must have atleat 1 image"],
  },
  caption: {
    type: String,
    required: [true, "A post must have caption"],
    maxLength: [300, "A post can have maximum of 300 characters"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    required: [true, "a post will be done by a user"],
  },
  likesCount: {
    type: Number,
    required: [true, "A post must have number of likes"],
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});

module.exports = mongoose.model("Post", postSchema);
