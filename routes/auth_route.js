const express = require("express");
const {
  registerFarmer,
  loginFarmer,
} = require("../controllers/farmer_controller");
const {
  loginIndivisualTransporter,
  registerIndivisualTransporter,
} = require("../controllers/indivisual_transporter_controller");
const {
  nameValidation,
  contactValidation,
  passwordValidation,
  locationValidation,
} = require("../middleware/validation/user_validaiton");
const {
  aadharValidation,
  licenseValidation,
  shop_nameValidation,
} = require("../middleware/validation/retailer_validation");
const router = express.Router();

const {
  landSizeValidation,
  farmingExpValidation,
} = require("../middleware/validation/farmer_validation");
const {
  vehicleNumberValidation,
  capacityTonsValidation,
} = require("../middleware/validation/indivisual_transporter_validaiton");
const { registerRetailer, loginRetailer } = require("../controllers/retailer_controller");

// farmer auth routes----------------------------------------------
router.post(
  "/farmer/register",
  nameValidation,
  contactValidation,
  passwordValidation,
  locationValidation,
  aadharValidation,
  landSizeValidation,
  farmingExpValidation,
  registerFarmer
);

router.post(
  "/farmer/login",
  contactValidation,
  passwordValidation,
  loginFarmer
);

// transporter auth routes----------------------------------------------
router.post(
  "/indivisual_transporter/register",
  nameValidation,
  contactValidation,
  passwordValidation,
  locationValidation,
  vehicleNumberValidation,
  licenseValidation,
  capacityTonsValidation,
  registerIndivisualTransporter
);
router.post(
  "/indivisual_transporter/login",
  contactValidation,
  passwordValidation,
  loginIndivisualTransporter
);

// retailer auth routes ----------------------------------------------
router.post(
  "/retailer/register",
  nameValidation,
  contactValidation,
  passwordValidation,
  locationValidation,
  aadharValidation,
  licenseValidation,
  shop_nameValidation,
  registerRetailer
);
router.post(
  "/retailer/login",
  contactValidation,
  passwordValidation,
  loginRetailer
);

module.exports = router;
