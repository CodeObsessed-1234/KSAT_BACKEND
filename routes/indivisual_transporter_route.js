const express = require("express");
const {
  getIndivisualTransporterProfile,
  updateIndivisualTransporterProfile,
} = require("../controllers/indivisual_transporter_controller");
const authenticateToken = require("../middleware/auth_middleware");
const {
  contactValidation,
  nameValidation,
  locationValidation,
} = require("../middleware/validation/user_validaiton");
const {
  vehicleNumberValidation,
  licenseValidation,
  capacityTonsValidation,
} = require("../middleware/validation/indivisual_transporter_validaiton");
const router = express.Router();

// routes for indivisual transporter profile-----------------------------------------
router.get(
  "/profile_details",
  authenticateToken,
  getIndivisualTransporterProfile
);
router.put(
  "/profile_update",
  authenticateToken,
  contactValidation,
  nameValidation,
  locationValidation,
  vehicleNumberValidation,
  licenseValidation,
  capacityTonsValidation,
  updateIndivisualTransporterProfile
);

module.exports = router;
