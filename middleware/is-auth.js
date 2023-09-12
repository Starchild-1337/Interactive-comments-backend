const jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET;

const isAuth = (req, res, next) => {
  const authHeader = req.get("Authorization");

  if (!authHeader) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodedToken = jwt.verify(token, secret);
    req.userId = decodedToken.userId;
    next();
  } catch (error) {
    res.status(403).json({ message: "Forbidden" });
  }
};

module.exports = isAuth;
