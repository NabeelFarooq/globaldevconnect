const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://nabeel007dar:fY283pUTEyXLQq2q@learnnodenn.krcmu1e.mongodb.net/globaldevconnect"
  );
};

module.exports = connectDB;
