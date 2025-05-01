const jwt = require("jsonwebtoken");

//local imports
const User = require("../models/user");
const secret = process.env.JWT_SECRET;

const userAuth = async (req, res, next) => {
  console.log("User Authenticating...");
  try {
    const { token } = req.cookies;

    const tokenObj = await jwt.verify(token, secret);

    const userId = tokenObj._id;

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("Unauthorised request");
    }

    req.user = user;
    console.log("User Authenticated");

    next();
  } catch (err) {
    res.json({ Error: err });
  }
};

module.exports = { userAuth };
