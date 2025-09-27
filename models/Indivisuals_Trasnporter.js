const mongoose = require("mongoose");
const { Schema } = mongoose;

const indivisual_transporter_schema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    vehicle_number: { type: String, required: true, unique: true },
    license_number: { type: String, required: true, unique: true },
    vehicle_type: { type: String, required: true },
    capacity_tons: { type: Number, required: true },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const IndivisualTransporter = mongoose.model("Indivisual_Transporter", indivisual_transporter_schema);

module.exports = IndivisualTransporter;
