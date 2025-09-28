const express = require("express");
const authenticateToken = require("../middleware/auth_middleware");
const {
  getRetailerProfile,
  updateRetailerProfile,
} = require("../controllers/retailer_controller");
const {
  contactValidation,
  passwordValidation,
  nameValidation,
  locationValidation,
} = require("../middleware/validation/user_validaiton");
const { aadharValidation, licenseValidation, shop_nameValidation } = require("../middleware/validation/retailer_validation");
const router = express.Router();

// routes for retailer profile-----------------------------------------
router.get(
  "/profile_details",
  authenticateToken,
  contactValidation,
  passwordValidation,
  getRetailerProfile
);

router.put(
  "/profile_update",
  authenticateToken,
  contactValidation,
  nameValidation,
  locationValidation,
  aadharValidation,
  licenseValidation,
  shop_nameValidation,
  updateRetailerProfile
);

module.exports = router;
