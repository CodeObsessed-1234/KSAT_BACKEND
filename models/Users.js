const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    password: { type: String, required: true },
    contact: { type: String, required: true, unique: true },
    location: { type: String, required: true },
    role: {
      type: String,
      enum: [
        "farmer",
        "middleman",
        "indivisual_transporter",
        "logisitics_company",
        "admin",
        "retailer",
        "customer",
      ],
      required: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
