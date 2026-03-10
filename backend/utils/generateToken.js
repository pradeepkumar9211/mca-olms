const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const generateToken = (id, role) => {
  const token = jwt.sign({ user_id: id, role: role }, JWT_SECRET_KEY, {
    expiresIn: "24h",
  });

  return token;
};

module.exports = generateToken;
