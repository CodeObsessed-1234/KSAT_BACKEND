const { verifyToken } = require("../config/jwt");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  if (!authHeader.startsWith("Bearer ") && !authHeader.startsWith("bearer ")) {
    return res.status(401).json({ msg: "Malformed token format" });
  }

  const token = authHeader.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ msg: "Malformed token format" });
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(403).json({ msg: "Token is not valid or has expired" });
  }

  req.userId = decoded.id;

  next();
};

module.exports = authenticateToken;
