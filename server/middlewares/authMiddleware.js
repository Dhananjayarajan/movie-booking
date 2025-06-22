const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send({
        success: false,
        message: "Authorization header missing or malformed",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.jwt_secret);

    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error("JWT VERIFY ERROR:", error);
    return res.status(401).send({
      success: false,
      message: "Invalid token",
    });
  }
};
