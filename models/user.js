// importing modules
const validator = require("validator");
const { default: mongoose } = require("mongoose");
const bcrypt = require("bcryptjs");

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
    followers: {
      type: [mongoose.Schema.ObjectId],
      default: [],
    },
    following: {
      type: [mongoose.Schema.ObjectId],
      default: [],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },

  // want something to show up in the output but not save in the database we use Virtual Property
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

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

// compare hashed and input password
userSchema.methods.checkPassword = async function (
  inputPassword,
  userPassword
) {
  return await bcrypt.compare(inputPassword, userPassword);
};

// only selecting the active users
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
