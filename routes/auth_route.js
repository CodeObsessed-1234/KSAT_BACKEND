const express = require("express");
const { registerFarmer, loginFarmer } = require("../controllers/farmer_controller");
const { loginIndivisualTransporter, registerIndivisualTransporter } = require("../controllers/indivisual_transporter_controller");
const router = express.Router();

// farmer auth routes
router.post("/farmer/register", registerFarmer);
router.post("/farmer/login", loginFarmer);

// transporter auth routes
router.post("/indivisual_transporter/register", registerIndivisualTransporter);
router.post("/indivisual_transporter/login", loginIndivisualTransporter);

module.exports = router;