const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.Atlas_Url);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection failed", err);
    process.exit(1);
  }
};

module.exports = connectDB;
