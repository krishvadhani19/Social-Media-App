const { default: mongoose } = require("mongoose");

let postSchema = new mongoose.Schema({
  caption: {
    type: String,
    required: [true, "A post must have caption"],
    maxLength: [300, "A post can have maximum of 300 characters"],
  },
  likesCount: {
    type: Number,
    required: [true, "A post must have number of likes"],
    default: 0,
  },
});

module.exports = mongoose.model("Post", postSchema);
