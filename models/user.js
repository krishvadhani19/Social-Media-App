// importing modules
const validator = require("validator");
const { default: mongoose } = require("mongoose");

let userSchema = new mongoose.Schema({
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
    // validate: {
    //   validatior: function (value) {
    //     return value === this.password;
    //   },
    //   message: "Password does not match ConfirmPassword!",
    // },
    select: false,
  },
  passwordChangedAt: {
    type: Date,
    default: Date.now(),
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
