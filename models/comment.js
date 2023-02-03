const { default: mongoose } = require("mongoose");

let commentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: [true, "A comment cannot be empty"],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    post: {
      type: mongoose.Schema.ObjectId,
      required: [true, "A comment must have post to which it is done."],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      required: [true, "A comment must be belong to a user."],
    },
  },
  // want something to show up in the output but not save in the database we use Virtual Property
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// the user will be populated on accessing the comment
commentSchema.pre(/^find/, function (next) {
  // user population
  this.populate({
    path: "user",
    select: "name email",
  });

  //   since it is a middleware next is must
  next();
});

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
