const express = require("express");
const bcrypt = require("bcrypt");
const validator = require("validator");

const { validatorSignupData } = require("../utills/dataValidator");
const User = require("../models/user");

const authRouter = express.Router();
const secret = process.env.JWT_SECRET;

authRouter.post("/signup", async (req, res) => {
  try {
    // console.log("req.body", req.body);
    validatorSignupData(req);

    const { firstName, lastName, email, password } = req.body;

    const userExist = await User.find({ email: email });
    if (userExist.length > 0) {
      return res.status(400).json("User already exists with this email.");
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashPassword,
    });
    await user.save();
    res.json({ message: "User Created Successfully", user });
  } catch (err) {
    res.json("Error: " + err);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new Error("Please enter your credentials");
    } else if (!validator.isEmail(email)) {
      throw new Error("Please enter a valid email address.");
    }
    const user = await User.findOne({ email: email });

    if (!user) {
      throw new Error("Wrong credentials. User not found.");
    }

    const passwordMatched = await user.validatePassword(password);
    if (passwordMatched) {
      const token = await user.getJWT(secret);
      res.cookie("token", token, {
        expires: new Date(Date.now() + 2 * 3600000),
      });
      res.json({ message: "Login Successful" });
    } else {
      throw new Error("Wrong credentials. email or password incorrect.");
    }
  } catch (err) {
    res.json("Error: " + err);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", "", {
    expires: new Date(Date.now()),
  });
  res.json({ message: "Logout Successful" });
});

module.exports = { authRouter };
