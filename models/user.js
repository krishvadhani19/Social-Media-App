// importing modules
const validator = require("validator");
const { default: mongoose } = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

let userSchema = new mongoose.Schema(
  {
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
    password: {
      type: String,
      required: [true, "A user must have password"],
      minLength: 8,
      select: false,
    },
    confirmPassword: {
      type: String,
      required: [true, "A user must have Confirm Password"],
      minLength: 8,
      validate: {
        validator: function (value) {
          return value === this.password;
        },
        message: "Password does not match ConfirmPassword!",
      },
      select: false,
    },
    passwordChangedAt: {
      type: Date,
      default: Date.now(),
    },
    followers: [
      {
        id: { type: mongoose.Schema.ObjectId, select: false },
      },
    ],
    following: [
      {
        id: { type: mongoose.Schema.ObjectId, select: false },
      },
    ],
    activeTime: {
      type: Number,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetExpires: {
      type: Date,
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
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

userSchema.index({ activeTime: -1 });

// =================================================================================================

// Hashing the password before saving
userSchema.pre("save", async function (next) {
  // if password is not modified then hashing will be skipped
  if (!this.isModified("password")) {
    return next();
  }

  // Hashing the password
  this.password = await bcrypt.hash(this.password, 10);

  // Deleting the confirmPassword
  this.confirmPassword = undefined;

  next();
});

// =================================================================================================

// only selecting the active users
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

// =================================================================================================

// compare hashed and input password
userSchema.methods.checkPassword = async function (
  currentEnteredPassword,
  dbPassword
) {
  return await bcrypt.compare(currentEnteredPassword, dbPassword);
};

// =================================================================================================

userSchema.methods.createPasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  // storing resetToken in db
  // hashing it before stored
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // set password expires to 10 mins
  this.passwordResetExpires = Date.now() + 60 * 10 * 1000;

  return resetToken;
};

// =================================================================================================

userSchema.methods.endActiveTime = async function (time) {
  this.activeTime = this.activeTime + (Date.now() - time);
  console.log(this.activeTime);
};

// =================================================================================================

// virtual likedpost from 'Posts'
userSchema.virtual("getLikedPosts", {
  ref: "Post",
  foreignField: "likedBy._id",
  localField: "_id",
});

// Poulating getLikedPosts
userSchema.pre(/^find/, function (next) {
  this.populate({
    path: "getLikedPosts",
  });
  next();
});

// =================================================================================================

// virtual likedpost from 'Posts'
userSchema.virtual("getTaggedPosts", {
  ref: "Post",
  foreignField: "tags._id",
  localField: "_id",
});

// Poulating getLikedPosts
userSchema.pre(/^find/, function (next) {
  this.populate({
    path: "getTaggedPosts",
  });
  next();
});

// =================================================================================================

const User = mongoose.model("User", userSchema);
module.exports = User;
