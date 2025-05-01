const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email Address");
        }
      },
    },
    password: {
      type: String,
      required: true,
    },
    photoUrl: {
      type: String,
      default:
        "https://img.freepik.com/premium-vector/user-icons-includes-user-icons-people-icons-symbols-premiumquality-graphic-design-elements_981536-526.jpg",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid URL");
        }
      },
    },
    about: {
      type: String,
      default: "Hey, I am using WareTrack to track my inventory.",
    },
    phoneNumber: {
      type: Number,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = async function (secret) {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, secret, {
    expiresIn: "2h",
  });
  return token;
};

userSchema.methods.validatePassword = async function (inputPassword) {
  const user = this;
  const isMatch = await bcrypt.compare(inputPassword, user.password);
  return isMatch;
};

module.exports = mongoose.model("User", userSchema);
