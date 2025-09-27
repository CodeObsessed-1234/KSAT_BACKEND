const express = require("express");
const router = express.Router();
const {
  getFarmerProfile,
  updateFarmerProfile,
} = require("../controllers/farmer_controller");
const authenticateToken = require("../middleware/auth_middleware");

router.get("/profile_details", authenticateToken, getFarmerProfile);

router.put("/profile_update", authenticateToken, updateFarmerProfile);

module.exports = router;
