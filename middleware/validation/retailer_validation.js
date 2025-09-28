const AADHAR_REGEX = /^\d{12}$/;

// Validates that Aadhar number contains only digits and is exactly 12 digits long.
const aadharValidation = (req, res, next) => {
  const { aadhar_number } = req.body;
  if (aadhar_number === undefined) {
    return next();
  }
  if (!AADHAR_REGEX.test(aadhar_number)) {
    return res.status(400).json({
      msg: "Aadhar number is invalid. It must be a 12-digit number.",
    });
  }
  next();
};

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

// Validates that shop name is between 2 to 100 characters.
const shop_nameValidation = (req, res, next) => {
  const { shop_name } = req.body;
  if (shop_name === undefined) {
    return next();
  }
  if (shop_name.length < 2 || shop_name.length > 100) {
    return res
      .status(400)
      .json({ msg: "Shop name must be between 2 and 100 characters." });
  }
  next();
};

module.exports = {
  aadharValidation,
  licenseValidation,
  shop_nameValidation,
};
