const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "1h" });
  return token;
};

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    return decoded;
  } catch (err) {
    console.error("Token verification failed:", err);
    return null;
  }
};

module.exports = { generateToken, verifyToken };
