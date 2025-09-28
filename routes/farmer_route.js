const express = require("express");
const router = express.Router();
const {
  getFarmerProfile,
  updateFarmerProfile,
} = require("../controllers/farmer_controller");
const authenticateToken = require("../middleware/auth_middleware");
const {
  nameValidation,
  contactValidation,
  locationValidation,
} = require("../middleware/validation/user_validaiton");
const { aadharValidation, landSizeValidation, farmingExpValidation } = require("../middleware/validation/farmer_validation");

// routes for farmer profile------------------------------------------------------

router.get("/profile_details", authenticateToken, getFarmerProfile);

router.put(
  "/profile_update",
  authenticateToken,
  nameValidation,
  contactValidation,
  locationValidation,
  aadharValidation,
  landSizeValidation,
  farmingExpValidation,
  updateFarmerProfile
);

module.exports = router;
