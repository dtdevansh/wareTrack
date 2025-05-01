const express = require("express");
const validator = require("validator");
const bcrypt = require("bcrypt");

const { userAuth } = require("../middlewares/auth");
const { validationUserData } = require("../utills/dataValidator");
const User = require("../models/user");

const profileRouter = express.Router();
const USER_SAFE = "email firstName lastName photoUrl about phoneNumber";

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const userSafedata = await User.findById(req.user._id).select(USER_SAFE);
    if (!userSafedata) {
      throw new Error("User not found");
    }
    res.json({ message: "User Profile", data: userSafedata });
  } catch (err) {
    res.json("Error: " + err);
  }
});

profileRouter.patch("/profile", userAuth, async (req, res) => {
  try {
    if (!validationUserData(req)) {
      throw new Error("Invalid change request");
    }

    const loggedInUser = await User.findById(req.user._id);

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();
    const userDetails = await User.findById(loggedInUser._id).select(USER_SAFE);

    res.json({
      message: `${loggedInUser.firstName} your profile has been updated succesfully, here is your updated profile`,
      data: userDetails,
    });
  } catch (err) {
    res.json("Error: " + err);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const allowedFields = ["password", "newPassword"];
    const checkFields = Object.keys(req.body).every((field) =>
      allowedFields.includes(field)
    );
    if (checkFields) {
      const loggedInUser = await User.findById(req.user._id);
      const { password, newPassword } = req.body;
      const passwordMatched = await loggedInUser.validatePassword(password);
      if (!passwordMatched) {
        throw new Error("Current password is incorrect.");
      }
      const newHashPassword = await bcrypt.hash(newPassword, 10);
      loggedInUser.password = newHashPassword;
      await loggedInUser.save();
      res.json({
        message: "Password updated successfully.",
      });
    }
  } catch (err) {
    res.json("Error: " + err);
  }
});

module.exports = { profileRouter };
