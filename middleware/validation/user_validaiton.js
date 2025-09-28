const CONTACT_REGEX = /^\d{10}$/;

// Validates that password is at least 6 characters long.
const passwordValidation = (req, res, next) => {
  const { password } = req.body;
  if (password === undefined) {
    return next();
  }
  if (password.length < 6) {
    return res
      .status(400)
      .json({ msg: "Password is required and must be at least 6 characters." });
  }
  next();
};

// Validates that contact number contains only digits and is exactly 10 digits long.
const contactValidation = (req, res, next) => {
  const { contact } = req.body;
  if (contact === undefined) {
    return next();
  }
  if (!CONTACT_REGEX.test(contact)) {
    return res.status(400).json({
      msg: "Contact number is invalid. It must be a 10-digit number.",
    });
  }
  next();
};

// Validates that name is between 2 to 50 characters.
const nameValidation = (req, res, next) => {
  const { name } = req.body;
  if (name === undefined) {
    return next();
  }
  if (name.length < 2 || name.length > 50) {
    return res
      .status(400)
      .json({ msg: "Name must be between 2 and 50 characters." });
  }
  next();
};

const locationValidation = (req, res, next) => {
  const { location } = req.body;
  if (location === undefined) {
    return next();
  }
  if (location.length < 2 || location.length > 100) {
    return res
      .status(400)
      .json({ msg: "Location must be between 2 and 100 characters." });
  }
  next();
};

module.exports = {
  contactValidation,
  nameValidation,
  passwordValidation,
  locationValidation,
};
