const mongoose = require("mongoose");
const { Schema } = mongoose;

const farmerSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    landSize: { type: Number },
    farming_exp: { type: Number },
    prefered_crop_type: { type: [String] },
    certifications: { type: [String] },
    aadhar_number: { type: String,required:true, unique:true },
  },
  { timestamps: true }
);

const Farmer = mongoose.model("Farmer", farmerSchema);

module.exports = Farmer;
