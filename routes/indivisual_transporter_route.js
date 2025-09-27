const express = require("express");
const { getIndivisualTransporterProfile, updateIndivisualTransporterProfile } = require("../controllers/indivisual_transporter_controller");
const authenticateToken = require("../middleware/auth_middleware");
const router = express.Router();

router.get("/profile_details", authenticateToken ,getIndivisualTransporterProfile);
router.put("/profile_update", authenticateToken ,updateIndivisualTransporterProfile);

module.exports = router;