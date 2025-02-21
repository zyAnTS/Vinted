const User = require("../models/User");

const isAuthenticated = async (req, res, next) => {
  // sécuriser
  // présence du token
  if (!req.headers.authorization) {
    console.log("No token detected");
    console.log("--------------------");
    return res.status(401).json({ error: "Unauthorized" });
  }

  console.log(req.headers);
  const token = req.headers.authorization.replace("Bearer ", "");
  console.log("User token : " + token);
  const user = await User.findOne({ token: token });

  // validité du token
  if (!user) {
    console.log("Unauthorized access");
    console.log("--------------------");
    return res.status(401).json({ error: "Unauthorized" });
  }

  req.user = user;
  console.log("Authorized access");
  console.log("--------------------");

  next();
};

module.exports = isAuthenticated;
