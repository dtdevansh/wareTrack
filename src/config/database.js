const mongoose = require("mongoose");

const url = process.env.DB_SECRET;

const connectionDB = async () => {
  try {
    await mongoose.connect(url);
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectionDB;
