// Validates that license number is alphanumeric and between 8 to 20 characters.
const licenseValidation = (req, res, next) => {
  const { license_number } = req.body;
  if (license_number === undefined) {
    return next();
  }
  if (!/^[a-zA-Z0-9\s]{8,20}$/.test(license_number)) {
    return res.status(400).json({
      msg: "License number is invalid. Use letters, numbers, or spaces only (8-20 characters).",
    });
  }
  next();
};

// Validates that vehicle number is alphanumeric and between 6 to 15 characters.
const vehicleNumberValidation = (req, res, next) => {
  const { vehicle_number } = req.body;
  if (vehicle_number === undefined) {
    return next();
  }
  if (!/^[a-zA-Z0-9\s-]{6,15}$/.test(vehicle_number)) {
    return res.status(400).json({
      msg: "Vehicle number is invalid. Use letters, numbers, spaces, or hyphens only (6-15 characters).",
    });
  }
  next();
};

// Validates that capacity in tons is a positive number.
const capacityTonsValidation = (req, res, next) => {
  const { capacity_tons } = req.body;
  if (capacity_tons === undefined) {
    return next();
  }
  const capacity = Number(capacity_tons);
  if (capacity <= 0) {
    return res
      .status(400)
      .json({ msg: "Capacity in tons must be a positive number." });
  }
  next();
};

module.exports = {
  licenseValidation,
  vehicleNumberValidation,
  capacityTonsValidation,
};
