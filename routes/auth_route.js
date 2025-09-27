const express = require("express");
const { registerFarmer, getFarmerProfile } = require("../controllers/farmer_controller");
const router = express.Router();


router.post("/farmer/register", registerFarmer);


module.exports = router;
