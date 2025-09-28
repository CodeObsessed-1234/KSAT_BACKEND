const AADHAR_REGEX = /^\d{12}$/;

// Validates that Aadhar number contains only digits and is exactly 12 digits long.
const aadharValidation = (req, res, next) => {
  const { aadhar_number } = req.body;
  if (aadhar_number === undefined) {
    return next();
  }
  if (!AADHAR_REGEX.test(aadhar_number)) {
    return res
      .status(400)
      .json({ msg: "Aadhar number must contain only digits." });
  }
  next();
};

/**
 * Validats land Size
 **/
const landSizeValidation = (req, res, next) => {
  const { landSize } = req.body;
  if (landSize === undefined) {
    return next();
  }
  const size = Number(landSize);

  if (size <= 0) {
    return res
      .status(400)
      .json({ msg: "Land size must be a positive number." });
  }

  next();
};

/**
 * Validates that farming experience is a non-negative number (0 or positive).
 */
const farmingExpValidation = (req, res, next) => {
  const { farming_exp } = req.body;
  if (farming_exp === undefined) {
    return next();
  }
  const experience = Number(farming_exp);

  if (experience < 0) {
    return res
      .status(400)
      .json({ msg: "Farming experience cannot be negative or invalid." });
  }

  next();
};

module.exports = {
  aadharValidation,
  landSizeValidation,
  farmingExpValidation,
};
