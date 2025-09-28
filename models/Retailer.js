const mongoose = require("mongoose");
const { Schema } = mongoose;

const retailerSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    shop_name: { type: String, required: true },
    shop_address: { type: String, required: true },
    gst_number: { type: String, required: true, unique: true },
    license_number: { type: String, required: true, unique: true },
    aadhar_number: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const Retailer = mongoose.model("Retailer", retailerSchema);

module.exports = Retailer;